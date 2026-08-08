-- ============================================================
-- HomeLinker Messaging Migration
-- Conversations, Messages, Notifications RLS
-- ============================================================

-- ============================================================
-- 1. CONVERSATIONS TABLE
-- ============================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  property_id bigint not null,
  property_title text,
  owner_id uuid not null,
  buyer_id uuid not null,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. MESSAGES TABLE
-- ============================================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references public.conversations(id)
    on delete cascade,
  sender_id uuid not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

create index if not exists idx_conversations_property_id
  on public.conversations(property_id);

create index if not exists idx_messages_conversation_id
  on public.messages(conversation_id);

-- ============================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table if exists public.conversations
  enable row level security;

alter table if exists public.messages
  enable row level security;

alter table if exists public.notifications
  enable row level security;

-- ============================================================
-- 5. REMOVE ONLY OUR EXISTING POLICIES
-- ============================================================

drop policy if exists "conversations select participant"
  on public.conversations;

drop policy if exists "conversations insert buyer only"
  on public.conversations;

drop policy if exists "conversations update participant"
  on public.conversations;

drop policy if exists "conversations delete participant"
  on public.conversations;

drop policy if exists "messages select participant"
  on public.messages;

drop policy if exists "messages insert sender only"
  on public.messages;

drop policy if exists "messages update sender only"
  on public.messages;

drop policy if exists "messages delete sender only"
  on public.messages;

drop policy if exists "notifications select owner"
  on public.notifications;

drop policy if exists "notifications insert participant"
  on public.notifications;

drop policy if exists "notifications update owner"
  on public.notifications;

drop policy if exists "notifications delete owner"
  on public.notifications;

-- ============================================================
-- 6. CONVERSATION POLICIES
-- ============================================================

create policy "conversations select participant"
on public.conversations
for select
using (
  auth.uid() is not null
  and (
    buyer_id = auth.uid()
    or owner_id = auth.uid()
  )
);

create policy "conversations insert buyer only"
on public.conversations
for insert
with check (
  auth.uid() is not null
  and buyer_id = auth.uid()
  and owner_id = (
    select p.user_id
    from public.properties p
    where p.id = property_id
  )
  and property_title = (
    select p.title
    from public.properties p
    where p.id = property_id
  )
);

create policy "conversations update participant"
on public.conversations
for update
using (
  auth.uid() is not null
  and (
    buyer_id = auth.uid()
    or owner_id = auth.uid()
  )
)
with check (
  auth.uid() is not null
  and (
    buyer_id = auth.uid()
    or owner_id = auth.uid()
  )
  and property_id = (
    select c.property_id
    from public.conversations c
    where c.id = id
  )
  and property_title = (
    select c.property_title
    from public.conversations c
    where c.id = id
  )
  and buyer_id = (
    select c.buyer_id
    from public.conversations c
    where c.id = id
  )
  and owner_id = (
    select c.owner_id
    from public.conversations c
    where c.id = id
  )
);

create policy "conversations delete participant"
on public.conversations
for delete
using (
  auth.uid() is not null
  and (
    buyer_id = auth.uid()
    or owner_id = auth.uid()
  )
);

-- ============================================================
-- 7. MESSAGE POLICIES
-- ============================================================

create policy "messages select participant"
on public.messages
for select
using (
  auth.uid() is not null
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (
        c.buyer_id = auth.uid()
        or c.owner_id = auth.uid()
      )
  )
);

create policy "messages insert sender only"
on public.messages
for insert
with check (
  auth.uid() is not null
  and sender_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (
        c.buyer_id = auth.uid()
        or c.owner_id = auth.uid()
      )
  )
);

create policy "messages update sender only"
on public.messages
for update
using (
  auth.uid() is not null
  and sender_id = auth.uid()
)
with check (
  auth.uid() is not null
  and sender_id = auth.uid()
);

create policy "messages delete sender only"
on public.messages
for delete
using (
  auth.uid() is not null
  and sender_id = auth.uid()
);

-- ============================================================
-- 8. NOTIFICATION POLICIES
-- ============================================================

create policy "notifications select owner"
on public.notifications
for select
using (
  auth.uid() is not null
  and user_id = auth.uid()
);

create policy "notifications insert participant"
on public.notifications
for insert
with check (
  auth.uid() is not null
  and (
    user_id = auth.uid()

    or exists (
      select 1
      from public.conversations c
      where c.buyer_id = auth.uid()
        and c.owner_id = user_id
    )

    or exists (
      select 1
      from public.conversations c
      where c.owner_id = auth.uid()
        and c.buyer_id = user_id
    )
  )
);

create policy "notifications update owner"
on public.notifications
for update
using (
  auth.uid() is not null
  and user_id = auth.uid()
)
with check (
  auth.uid() is not null
  and user_id = auth.uid()
);

create policy "notifications delete owner"
on public.notifications
for delete
using (
  auth.uid() is not null
  and user_id = auth.uid()
);

-- ============================================================
-- END OF HOMELINKER MESSAGING MIGRATION
-- ============================================================