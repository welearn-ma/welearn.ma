-- Flux d'activite admin : journalisation des renvois d'e-mail de code
-- (« Renvoyer l'e-mail » sur un justificatif valide ou un code de reduction).
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- * admin_activity_log.event_type accepte desormais 'proof_email_resent'
--   (entite 'student_proof') et 'code_email_resent' (entite 'code').
-- * Aucune autre modification ; aucun backfill.
--
-- PREREQUIS : 20261124000000_cmi_products_codes_students.sql applique.
--
-- ORDRE DE DEPLOIEMENT : appliquer AVANT le backend qui journalise ces
-- evenements. Sans cette migration, l'insertion dans le journal echoue (erreur
-- journalisee cote serveur) mais l'e-mail part quand meme.
--
-- Idempotente : meme methode que 20261109000000 et 20261124000000.

begin;

-- Suppression de TOUTE contrainte CHECK portant sur event_type (en principe
-- admin_activity_log_event_type_valid), puis recreation sous le meme nom.
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
  add constraint admin_activity_log_event_type_valid
  check (event_type in (
    'new_request', 'brochure_request', 'treated', 'untreated',
    'proof_submitted', 'proof_approved', 'proof_rejected',
    'code_created', 'code_revoked',
    'proof_email_resent', 'code_email_resent'
  ));

commit;

notify pgrst, 'reload schema';

-- VERIFICATION (lecture seule) :
--   select conname, pg_get_constraintdef(oid)
--   from pg_constraint
--   where conrelid = 'public.admin_activity_log'::regclass and contype = 'c';
-- Attendu : admin_activity_log_entity_type_valid et
-- admin_activity_log_event_type_valid (11 valeurs).
