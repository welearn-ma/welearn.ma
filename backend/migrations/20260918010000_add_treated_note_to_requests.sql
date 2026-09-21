-- Denormalizes the treat-time note onto the request rows themselves
-- (mirrors treated_at/treated_by), so the admin table rows and detail
-- modals can show it without joining admin_activity_log.
-- Run in the Supabase SQL editor for the welearn.ma project.

begin;

alter table public.registration_requests
  add column if not exists treated_note text;

alter table public.sponsors
  add column if not exists treated_note text;

commit;

notify pgrst, 'reload schema';
