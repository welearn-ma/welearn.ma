-- Distingue les telechargements de brochure dans le flux d'activite admin.
--
-- * admin_activity_log.event_type accepte desormais 'brochure_request'.
-- * log_admin_new_request() ecrit 'brochure_request' quand la ligne inseree
--   dans registration_requests a source = 'brochure' ; comportement INCHANGE
--   sinon ('new_request'), y compris pour le trigger sur public.sponsors.
-- * Aucun backfill : les lignes de log existantes restent telles quelles.
--
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- PREREQUIS : 20261105000000_add_source_to_registration_requests.sql applique
-- (sinon aucune ligne n'a source = 'brochure' et rien ne change).
--
-- ORDRE DE DEPLOIEMENT : deployer le FRONTEND qui connait 'brochure_request'
-- AVANT d'appliquer cette migration — l'ancien frontend plante sur un
-- event_type inconnu dans la vue Activite.

begin;

-- 1. Contrainte CHECK sur event_type.
--    La contrainte d'origine a ete declaree inline dans CREATE TABLE : son nom
--    est genere par Postgres (en principe admin_activity_log_event_type_check).
--    Pour ne pas dependre de ce nom, on supprime TOUTE contrainte CHECK de la
--    table portant sur event_type, puis on recree une contrainte nommee.
--    Idempotent : rejouer le fichier supprime puis recree la meme contrainte.
do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.admin_activity_log'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) like '%event_type%'
  loop
    execute format(
      'alter table public.admin_activity_log drop constraint %I',
      c.conname
    );
  end loop;
end $$;

alter table public.admin_activity_log
  add constraint admin_activity_log_event_type_check
  check (event_type in ('new_request', 'brochure_request', 'treated', 'untreated'));

-- 2. Fonction de trigger partagee (registration_requests ET sponsors).
--    `source` est lu via to_jsonb(NEW) : la table sponsors n'a pas de colonne
--    `source`, et une reference directe NEW.source y leverait une erreur qui
--    annulerait l'INSERT du sponsor. Les triggers existants pointent deja sur
--    cette fonction : CREATE OR REPLACE suffit, aucun trigger a recreer.
create or replace function public.log_admin_new_request()
returns trigger as $$
declare
  v_event_type text := 'new_request';
begin
  if TG_ARGV[0] = 'student' and (to_jsonb(NEW) ->> 'source') = 'brochure' then
    v_event_type := 'brochure_request';
  end if;

  insert into public.admin_activity_log (entity_type, entity_id, event_type, actor_email)
  values (TG_ARGV[0], NEW.id, v_event_type, null);
  return NEW;
end;
$$ language plpgsql;

commit;

notify pgrst, 'reload schema';
