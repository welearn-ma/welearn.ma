-- Multi-programmes de sponsoring : /sponsoring, /sponsoring/mooc, /sponsoring/fnpi.
-- Migration ADDITIVE uniquement — aucun rename, aucun drop.
--
-- * sponsors.program discrimine la page d'origine de la demande
--   ('sponsoring' | 'mooc' | 'fnpi'). Colonne nullable avec default
--   'sponsoring' : les lignes existantes restent valides sans backfill,
--   et l'API existante (qui n'envoie pas de program) continue de
--   fonctionner a l'identique via le default.
-- * sponsor_moocs.mooc_name est du texte libre (aucune FK vers une table
--   moocs) : la table est reutilisee TELLE QUELLE pour les items FNPI —
--   l'"item" selectionne y est simplement le nom du departement.

alter table sponsors
  add column if not exists program text default 'sponsoring';

-- Postgres ne supporte pas ADD CONSTRAINT IF NOT EXISTS : garde manuelle
-- pour rester idempotent comme la migration precedente.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'sponsors_program_check'
      and conrelid = 'sponsors'::regclass
  ) then
    alter table sponsors
      add constraint sponsors_program_check
      check (program is null or program in ('sponsoring', 'mooc', 'fnpi'));
  end if;
end $$;
