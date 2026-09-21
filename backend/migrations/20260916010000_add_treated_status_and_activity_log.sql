-- Adds a "treated" workflow status to student registrations and sponsor
-- requests, plus a shared admin_activity_log fed by insert triggers.
-- Run in the Supabase SQL editor for the welearn.ma project.

begin;

alter table public.registration_requests
  add column if not exists treated boolean not null default false,
  add column if not exists treated_at timestamptz,
  add column if not exists treated_by text;

alter table public.sponsors
  add column if not exists treated boolean not null default false,
  add column if not exists treated_at timestamptz,
  add column if not exists treated_by text;

create table if not exists public.admin_activity_log (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text not null check (entity_type in ('student', 'sponsor')),
  entity_id    uuid not null,
  event_type   text not null check (event_type in ('new_request', 'treated', 'untreated')),
  actor_email  text,
  created_at   timestamptz not null default now()
);

create index if not exists admin_activity_log_created_at_idx
  on public.admin_activity_log (created_at desc);

create index if not exists admin_activity_log_actor_email_idx
  on public.admin_activity_log (actor_email);

-- RLS enabled with no policies: default-deny, same as the other admin-only
-- tables in this project. Only the backend's service_role key (which
-- bypasses RLS) reads/writes this table.
alter table public.admin_activity_log enable row level security;

-- Shared trigger function: logs a 'new_request' event for whichever table
-- fires it. The entity_type ('student' | 'sponsor') is passed as the
-- trigger argument so one function covers both tables.
create or replace function public.log_admin_new_request()
returns trigger as $$
begin
  insert into public.admin_activity_log (entity_type, entity_id, event_type, actor_email)
  values (TG_ARGV[0], NEW.id, 'new_request', null);
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_registration_requests_new_request on public.registration_requests;
create trigger trg_registration_requests_new_request
  after insert on public.registration_requests
  for each row execute function public.log_admin_new_request('student');

drop trigger if exists trg_sponsors_new_request on public.sponsors;
create trigger trg_sponsors_new_request
  after insert on public.sponsors
  for each row execute function public.log_admin_new_request('sponsor');

commit;

notify pgrst, 'reload schema';
