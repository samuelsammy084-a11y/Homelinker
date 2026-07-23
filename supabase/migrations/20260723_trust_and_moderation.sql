create extension if not exists pgcrypto;

create table if not exists public.property_verification (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
  verification_method text,
  verification_date timestamptz,
  verified_by uuid,
  owner_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_reports (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  reporter_id uuid,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.property_reviews (
  id uuid primary key default gen_random_uuid(),
  property_id bigint,
  landlord_id uuid,
  reviewer_id uuid,
  overall_rating int not null check (overall_rating between 1 and 5),
  communication_rating int not null check (communication_rating between 1 and 5),
  accuracy_rating int not null check (accuracy_rating between 1 and 5),
  professionalism_rating int not null check (professionalism_rating between 1 and 5),
  condition_rating int not null check (condition_rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','resolved','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  applicant_id uuid not null,
  employment text,
  income text,
  references text,
  move_in_date date,
  documents jsonb,
  status text not null default 'submitted' check (status in ('submitted','approved','rejected','pending')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  requester_id uuid not null,
  viewing_date timestamptz not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null references public.properties(id) on delete cascade,
  previous_price numeric,
  current_price numeric not null,
  changed_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.trust_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  score numeric not null default 0,
  percentage numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.properties add column if not exists verification_status text default 'pending' check (verification_status in ('pending','verified','rejected'));
alter table public.properties add column if not exists verified_by uuid;
alter table public.properties add column if not exists verification_date timestamptz;
alter table public.properties add column if not exists verification_method text;
alter table public.properties add column if not exists owner_confirmed boolean default false;
alter table public.properties add column if not exists report_count int default 0;
alter table public.properties add column if not exists hidden boolean default false;

create or replace view public.property_trust_summary as
select
  p.id as property_id,
  p.user_id,
  coalesce(ts.percentage, 0) as trust_percentage
from public.properties p
left join public.trust_scores ts on ts.user_id = p.user_id;
