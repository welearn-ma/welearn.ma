-- Distingue l'origine d'une demande dans registration_requests :
--   'inscription' = formulaire d'inscription d'une page formation (existant),
--   'brochure'    = formulaire de telechargement de brochure (POST /api/brochures/request).
-- Le DEFAULT couvre les lignes existantes : aucun backfill necessaire.
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- ORDRE DE DEPLOIEMENT : appliquer cette migration AVANT de deployer le
-- backend — le nouveau backend lit et ecrit la colonne `source`
-- (listAdminRegistrations la selectionne ; sans elle, le dashboard admin
-- echoue).

begin;

alter table public.registration_requests
  add column if not exists source text not null default 'inscription';

-- Postgres ne supporte pas ADD CONSTRAINT IF NOT EXISTS : garde manuelle
-- pour rester idempotent comme les migrations precedentes.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'registration_requests_source_check'
      and conrelid = 'public.registration_requests'::regclass
  ) then
    alter table public.registration_requests
      add constraint registration_requests_source_check
      check (source in ('inscription', 'brochure'));
  end if;
end $$;

commit;

notify pgrst, 'reload schema';
