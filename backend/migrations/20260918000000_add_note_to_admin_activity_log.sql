-- Adds an optional note to admin_activity_log, populated when an admin
-- marks a student/sponsor request as treated (required at the API level).
-- Run in the Supabase SQL editor for the welearn.ma project.

begin;

alter table public.admin_activity_log
  add column if not exists note text;

commit;

notify pgrst, 'reload schema';
