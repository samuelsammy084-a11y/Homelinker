begin;

create table public.listing_view_days (
  property_id bigint not null references public.properties(id) on delete cascade,
  view_day date not null,
  visitor_key uuid not null,
  primary key (property_id, view_day, visitor_key)
);

alter table public.listing_view_days enable row level security;
revoke all on public.listing_view_days from public, anon, authenticated;

create function public.record_listing_view(p_property_id bigint, p_visitor_key uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.listing_view_days (property_id, view_day, visitor_key)
  select p.id, (now() at time zone 'Africa/Johannesburg')::date, p_visitor_key
  from public.properties p
  where p.id = p_property_id
    and p.status = 'active'
    and p.user_id is distinct from auth.uid()
    and p_visitor_key is not null
  on conflict do nothing;
$$;

revoke all on function public.record_listing_view(bigint, uuid) from public;
grant execute on function public.record_listing_view(bigint, uuid) to anon, authenticated;

create table public.listing_favourite_weeks (
  property_id bigint not null references public.properties(id) on delete cascade,
  week_start date not null,
  saver_id uuid not null,
  primary key (property_id, week_start, saver_id)
);

alter table public.listing_favourite_weeks enable row level security;
revoke all on public.listing_favourite_weeks from public, anon, authenticated;

create function public.record_listing_favourite()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.listing_favourite_weeks (property_id, week_start, saver_id)
  select p.id, date_trunc('week', now() at time zone 'Africa/Johannesburg')::date, new.user_id
  from public.properties p
  where p.id = new.property_id and p.user_id is distinct from new.user_id
  on conflict do nothing;
  return new;
end;
$$;

revoke all on function public.record_listing_favourite() from public, anon, authenticated;

create trigger record_listing_favourite
after insert on public.favorites
for each row execute function public.record_listing_favourite();

create function public.get_listing_performance(p_property_id bigint)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with owned as (
    select id, title
    from public.properties
    where id = p_property_id and user_id = auth.uid()
  ),
  weeks as (
    select (date_trunc('week', now() at time zone 'Africa/Johannesburg')::date - offset_week * 7) as starts_on
    from generate_series(0, 8) as offset_week
  ),
  summaries as (
    select starts_on,
      (select count(*) from public.listing_view_days v
       where v.property_id = p_property_id
         and v.view_day >= starts_on and v.view_day < starts_on + 7) as views,
      (select count(*) from public.listing_favourite_weeks f
       where f.property_id = p_property_id and f.week_start = starts_on) as new_saves,
      (select count(distinct c.buyer_id) from public.conversations c
       where c.property_id = p_property_id and c.owner_id = auth.uid()
         and c.created_at >= (starts_on::timestamp at time zone 'Africa/Johannesburg')
         and c.created_at < ((starts_on + 7)::timestamp at time zone 'Africa/Johannesburg')) as enquiries
    from weeks
  )
  select jsonb_build_object(
    'title', owned.title,
    'current_saves', (select count(distinct f.user_id) from public.favorites f
                      where f.property_id = owned.id and f.user_id <> auth.uid()),
    'weeks', (select jsonb_agg(to_jsonb(s) order by starts_on desc) from summaries s)
  )
  from owned;
$$;

revoke all on function public.get_listing_performance(bigint) from public, anon;
grant execute on function public.get_listing_performance(bigint) to authenticated;

create table public.listing_performance_deliveries (
  owner_id uuid not null,
  week_start date not null,
  primary key (owner_id, week_start)
);

alter table public.listing_performance_deliveries enable row level security;
revoke all on public.listing_performance_deliveries from public, anon, authenticated;

create function public.send_weekly_listing_performance()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  this_week date := date_trunc('week', now() at time zone 'Africa/Johannesburg')::date;
  last_week date := this_week - 7;
begin
  with owner_listings as (
    select p.user_id as owner_id, p.id
    from public.properties p
    where p.user_id is not null and (
      p.status = 'active'
      or exists (select 1 from public.listing_view_days v
                 where v.property_id = p.id and v.view_day >= last_week and v.view_day < this_week)
      or exists (select 1 from public.listing_favourite_weeks f
                 where f.property_id = p.id and f.week_start = last_week)
      or exists (select 1 from public.conversations c
                 where c.property_id = p.id and c.owner_id = p.user_id
                   and c.created_at >= (last_week::timestamp at time zone 'Africa/Johannesburg')
                   and c.created_at < (this_week::timestamp at time zone 'Africa/Johannesburg'))
    )
  ),
  deliveries as (
    insert into public.listing_performance_deliveries (owner_id, week_start)
    select distinct owner_id, last_week from owner_listings
    on conflict do nothing
    returning owner_id
  ),
  reports as (
    select d.owner_id, count(*) as listings,
      sum((select count(*) from public.listing_view_days v where v.property_id = p.id
           and v.view_day >= last_week and v.view_day < this_week)) as views,
      sum((select count(distinct c.buyer_id) from public.conversations c
           where c.property_id = p.id and c.owner_id = d.owner_id
             and c.created_at >= (last_week::timestamp at time zone 'Africa/Johannesburg')
             and c.created_at < (this_week::timestamp at time zone 'Africa/Johannesburg'))) as enquiries,
      sum((select count(*) from public.listing_favourite_weeks w
           where w.property_id = p.id and w.week_start = last_week)) as new_saves,
      sum((select count(distinct f.user_id) from public.favorites f
           where f.property_id = p.id and f.user_id <> d.owner_id)) as saves
    from deliveries d join owner_listings p on p.owner_id = d.owner_id
    group by d.owner_id
  )
  insert into public.notifications (user_id, title, message, type, is_read, action_url, action_label)
  select owner_id, 'Your weekly listing report',
    format('%s to %s: %s listing(s), %s views, %s new enquiry contact(s), %s new saves, %s current saves.',
           last_week, this_week - 1, listings, views, enquiries, new_saves, saves),
    'listing_performance', false, '/dashboard', 'View listing performance'
  from reports;

  delete from public.listing_view_days
  where view_day < this_week - 63;

  delete from public.listing_favourite_weeks
  where week_start < this_week - 63;

  delete from public.listing_performance_deliveries
  where week_start < this_week - 63;
end;
$$;

revoke all on function public.send_weekly_listing_performance() from public, anon, authenticated;

commit;
