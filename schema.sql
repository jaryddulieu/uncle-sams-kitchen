-- Uncle Sam's Kitchen — shared data table for Supabase.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.

-- 1) One table that holds your whole app's data as a single record.
create table if not exists household_data (
  id text primary key,
  data jsonb,
  updated_at timestamptz default now()
);

-- 2) Turn on Row Level Security, then allow the app's public key to read/write.
alter table household_data enable row level security;

drop policy if exists "app read write" on household_data;
create policy "app read write" on household_data
  for all
  to anon
  using (true)
  with check (true);

-- 3) Make sure the public role can use the table.
grant usage on schema public to anon;
grant select, insert, update, delete on household_data to anon;

-- 4) Seed the single shared record the app reads from.
insert into household_data (id, data)
values ('main', '{"recipes":[],"week":{},"checked":{}}')
on conflict (id) do nothing;
