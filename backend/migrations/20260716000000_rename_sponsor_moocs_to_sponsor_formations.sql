-- Renommage generique du sponsoring : sponsor_moocs -> sponsor_formations,
-- mooc_name -> formation_name, + ajout de la cle de reporting stable
-- formation_slug (referentiel canonique de 6 slugs).
--
-- Etat production verifie le 2026-07-16 (mapping approuve) :
-- * 10 lignes dans sponsor_moocs :
--   - 8 libelles MOOC -> backfill du slug canonique (correspondance exacte),
--   - 2 lignes departements FNPI ("Top Management",
--     "Département Finance & Achat") -> SUPPRIMEES ; la ligne sponsors
--     parente (entreprise 'welearn', program='fnpi') est CONSERVEE
--     (demande contact seul, zero formation liee).
-- * RENAME/ALTER uniquement — aucun drop-recreate : PK, FK -> sponsors
--   (on delete cascade) et la colonne formation_name (cache d'affichage)
--   sont preserves.
-- * Ordre de deploiement : appliquer cette migration PUIS deployer le
--   backend (l'ancien backend ecrit/lit sponsor_moocs et echoue apres le
--   rename). Le nouveau backend accepte encore les anciens libelles en
--   entree et les normalise en slug.
--
-- IMPORTANT : coller ce fichier tel quel (UTF-8) — les libelles contiennent
-- des tirets demi-cadratins « – » (U+2013) et des accents qui doivent
-- correspondre exactement aux valeurs stockees.

begin;

-- 1. Rename de la table (idempotent).
do $$
begin
  if to_regclass('public.sponsor_moocs') is not null
     and to_regclass('public.sponsor_formations') is null then
    alter table public.sponsor_moocs rename to sponsor_formations;
  end if;
end $$;

-- 2. Rename de la colonne (idempotent).
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'sponsor_formations'
      and column_name = 'mooc_name'
  ) then
    alter table public.sponsor_formations
      rename column mooc_name to formation_name;
  end if;
end $$;

-- 3. Cosmetique : renommer PK/FK/index portant encore "mooc". Les noms
--    reels sont lus dans le catalogue (defauts attendus :
--    sponsor_moocs_pkey, sponsor_moocs_sponsor_id_fkey,
--    sponsor_moocs_sponsor_id_idx) — aucun echec si un nom differe.
do $$
declare
  pk_name text;
  fk_name text;
begin
  select conname into pk_name
  from pg_constraint
  where conrelid = 'public.sponsor_formations'::regclass
    and contype = 'p'
    and conname like '%mooc%';
  if pk_name is not null then
    execute format(
      'alter table public.sponsor_formations rename constraint %I to sponsor_formations_pkey',
      pk_name
    );
  end if;

  select conname into fk_name
  from pg_constraint
  where conrelid = 'public.sponsor_formations'::regclass
    and contype = 'f'
    and conname like '%mooc%';
  if fk_name is not null then
    execute format(
      'alter table public.sponsor_formations rename constraint %I to sponsor_formations_sponsor_id_fkey',
      fk_name
    );
  end if;

  if exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and indexname = 'sponsor_moocs_sponsor_id_idx'
  ) then
    alter index public.sponsor_moocs_sponsor_id_idx
      rename to sponsor_formations_sponsor_id_idx;
  end if;
end $$;

-- 4. Cle de reporting stable. Nullable volontairement : la colonne reste
--    additive, aucun NOT NULL force.
alter table public.sponsor_formations
  add column if not exists formation_slug text;

-- 5. Backfill par correspondance EXACTE des libelles stockes (verifies en
--    production, cf. en-tete). 8 lignes attendues.
update public.sponsor_formations
set formation_slug = mapping.slug
from (values
  ('MOOC Etanchéité – Toitures Terrasses et Toitures Inclinées', 'etancheite-toitures'),
  ('MOOC Etanchéité – Façade',                                   'etancheite-facades'),
  ('MOOC Etanchéité – Sous sol, salles d''eau et gradins',       'etancheite-soussols'),
  ('MOOC Planchers et dalles en béton',                          'plancher-beton'),
  ('MOOC Fondamentaux du BIM',                                   'bim'),
  ('MOOC Sécurité Incendie',                                     'securite-incendie')
) as mapping(label, slug)
where sponsor_formations.formation_name = mapping.label
  and sponsor_formations.formation_slug is null;

-- 6. Suppression APPROUVEE : uniquement les 2 lignes departements FNPI.
--    Double garde : l'id ET le libelle doivent correspondre.
delete from public.sponsor_formations
where id in (
    '832e130d-5472-4734-84fa-e711476fc46a', -- Top Management
    '5d60fcf0-1324-4cc5-af63-8030e5743eca'  -- Département Finance & Achat
  )
  and formation_name in ('Top Management', 'Département Finance & Achat');

-- 7. Verification bloquante : toute ligne restante doit porter un slug du
--    referentiel canonique, sinon EXCEPTION -> ROLLBACK complet de la
--    transaction (rien n'est applique). Un compte inattendu (soumission
--    survenue entre l'audit et l'execution) leve aussi une exception :
--    dans ce cas, ne pas forcer — re-auditer puis rejouer.
do $$
declare
  bad_count integer;
  total_count integer;
begin
  select count(*) into bad_count
  from public.sponsor_formations
  where formation_slug is null
     or formation_slug not in (
       'etancheite-toitures', 'etancheite-facades', 'etancheite-soussols',
       'plancher-beton', 'bim', 'securite-incendie'
     );

  if bad_count > 0 then
    raise exception
      'sponsor_formations: % ligne(s) sans slug canonique — migration annulee (rollback)',
      bad_count;
  end if;

  select count(*) into total_count from public.sponsor_formations;
  if total_count <> 8 then
    raise exception
      'sponsor_formations: % ligne(s) au lieu des 8 attendues — migration annulee (rollback), re-auditer les nouvelles soumissions',
      total_count;
  end if;

  raise notice 'sponsor_formations OK : 8 lignes, toutes avec slug canonique (10 initiales = 8 mises a jour + 2 supprimees)';
end $$;

-- 8. Additifs : index de reporting + garde referentielle (NULL tolere :
--    contrainte additive, jamais bloquante pour les lignes legacy).
create index if not exists sponsor_formations_slug_idx
  on public.sponsor_formations (formation_slug);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'sponsor_formations_slug_check'
      and conrelid = 'public.sponsor_formations'::regclass
  ) then
    alter table public.sponsor_formations
      add constraint sponsor_formations_slug_check
      check (
        formation_slug is null
        or formation_slug in (
          'etancheite-toitures', 'etancheite-facades', 'etancheite-soussols',
          'plancher-beton', 'bim', 'securite-incendie'
        )
      );
  end if;
end $$;

commit;

-- Recharge le cache de schema PostgREST (embed sponsor_formations(...)).
notify pgrst, 'reload schema';
