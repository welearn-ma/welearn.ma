-- Paiement CMI : promotions a duree limitee (premiere : Black Friday -25 %
-- sur les 2 packs BIM Foundations Professional).
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- * promotions         : une promotion = libelle, pourcentage, fenetre
--   [starts_at, ends_at[ (ends_at EXCLU), drapeau active. Le backend applique
--   une promotion a l'instant T (horloge du serveur) si
--   active AND starts_at <= T < ends_at. Aucune date dans le code.
-- * promotion_products : produits concernes (formation_prices).
-- * orders.promotion_id : promotion appliquee a la commande. Le prix
--   d'origine et la remise vont dans les colonnes existantes
--   list_amount_mad / discount_mad (amount_mad = list - discount, contrainte
--   orders_amount_consistency) : rapprochement Finance par promotion_id.
-- * admin_activity_log : + entite 'promotion', evenements
--   'promotion_activated' / 'promotion_deactivated'.
-- * Black Friday : du vendredi 27/11/2026 00:00 au lundi 30/11/2026
--   23:59:59 (heure de Casablanca), soit ends_at = 01/12/2026 00:00 exclu.
--
-- HEURE DU MAROC : UTC+0 depuis le 20/09/2026 (fin de l'heure UTC+1
-- permanente ; donnees de fuseaux de Windows et de Chrome 158). Les bornes
-- sont donc ecrites en UTC EXPLICITE (+00) : on ne depend pas des donnees
-- de fuseaux du serveur Postgres, qui peuvent dater d'avant ce changement
-- (avec at time zone Africa/Casablanca, un Postgres non a jour donnerait
-- encore UTC+1 et la promotion finirait a 23:00, heure locale).
--
-- Note archi : comme les autres tables du paiement, RLS activee SANS policy ;
-- seul le backend (service role) lit / ecrit. Le site lit la promotion en
-- cours via GET /api/payments/products/:slug.
--
-- NOMMAGE : contraintes nommees explicitement (pas de collision possible
-- avec un nom genere par Postgres), comme 20261124000000.
--
-- PREREQUIS (dans cet ordre) :
--   * 20261124000000_cmi_products_codes_students.sql applique (deja fait) ;
--   * 20261124010000_admin_activity_resend_events.sql applique. IMPORTANT :
--     cette migration recree la contrainte event_type avec ses 11 valeurs
--     PLUS les 2 nouvelles. Lancer 20261124010000 APRES celle-ci retirerait
--     les evenements de promotion.
--
-- ORDRE DE DEPLOIEMENT : appliquer AVANT le nouveau backend, qui lit
-- promotions a chaque /cmi/init (sans ces tables : page d'echec « erreur
-- technique », aucun debit).
--
-- COMPATIBILITE : additive. L'ancien backend ignore ces tables et
-- orders.promotion_id (nullable) : il continue de vendre au prix catalogue.
--
-- Idempotente : if not exists, on conflict do nothing, drop ... if exists.

begin;

-- 1. Promotions.
create table if not exists public.promotions (
  id          uuid primary key default gen_random_uuid(),
  label       text not null
                constraint promotions_label_not_blank
                check (char_length(btrim(label)) between 1 and 80),
  percent_off numeric(5,2) not null
                constraint promotions_percent_off_range
                check (percent_off > 0 and percent_off < 100),
  starts_at   timestamptz not null,
  -- EXCLU : la promotion s'arrete a ends_at.
  ends_at     timestamptz not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint promotions_window_valid check (ends_at > starts_at),
  constraint promotions_label_start_unique unique (label, starts_at)
);

-- 2. Produits concernes.
create table if not exists public.promotion_products (
  promotion_id uuid not null
                 constraint promotion_products_promotion_fk
                 references public.promotions (id),
  product_slug text not null
                 constraint promotion_products_product_fk
                 references public.formation_prices (formation_slug),
  constraint promotion_products_pk primary key (promotion_id, product_slug)
);

create index if not exists promotion_products_product_slug_idx
  on public.promotion_products (product_slug);

-- 3. Commandes : promotion appliquee.
alter table public.orders
  add column if not exists promotion_id uuid
    constraint orders_promotion_fk references public.promotions (id);

create index if not exists orders_promotion_id_idx
  on public.orders (promotion_id)
  where promotion_id is not null;

-- 4. Flux d'activite admin. Meme methode que 20261124000000 / 20261124010000 :
--    suppression de TOUTE contrainte CHECK sur entity_type / event_type, puis
--    recreation des contraintes nommees.
do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.admin_activity_log'::regclass
      and con.contype = 'c'
      and (pg_get_constraintdef(con.oid) like '%entity_type%'
           or pg_get_constraintdef(con.oid) like '%event_type%')
  loop
    execute format(
      'alter table public.admin_activity_log drop constraint %I',
      c.conname
    );
  end loop;
end $$;

alter table public.admin_activity_log
  add constraint admin_activity_log_entity_type_valid
  check (entity_type in ('student', 'sponsor', 'student_proof', 'code', 'promotion'));

alter table public.admin_activity_log
  add constraint admin_activity_log_event_type_valid
  check (event_type in (
    'new_request', 'brochure_request', 'treated', 'untreated',
    'proof_submitted', 'proof_approved', 'proof_rejected',
    'code_created', 'code_revoked',
    'proof_email_resent', 'code_email_resent',
    'promotion_activated', 'promotion_deactivated'
  ));

-- 5. RLS activee, aucune policy : acces backend (service_role) uniquement.
alter table public.promotions enable row level security;
alter table public.promotion_products enable row level security;

-- 6. Black Friday 2026 : -25 % sur les 2 packs BIM, active.
--    Creation journalisee comme une activation (acteur : migration).
with created as (
  insert into public.promotions (label, percent_off, starts_at, ends_at, active)
  values (
    'Black Friday',
    25.00,
    -- 27/11/2026 00:00 et 01/12/2026 00:00 heure de Casablanca (UTC+0).
    timestamptz '2026-11-27 00:00:00+00',
    timestamptz '2026-12-01 00:00:00+00',
    true
  )
  on conflict on constraint promotions_label_start_unique do nothing
  returning id
)
insert into public.admin_activity_log (entity_type, entity_id, event_type, actor_email, note)
select 'promotion', id, 'promotion_activated', null,
       'Créée active par la migration 20261127005000.'
from created;

insert into public.promotion_products (promotion_id, product_slug)
select p.id, s.slug
from public.promotions p
cross join (values ('bim-foundations-pro'), ('bim-foundations-etudiant')) as s (slug)
where p.label = 'Black Friday'
  and p.starts_at = timestamptz '2026-11-27 00:00:00+00'
on conflict on constraint promotion_products_pk do nothing;

commit;

notify pgrst, 'reload schema';

-- 7. VERIFICATIONS (lecture seule, a lancer apres la migration).
--
-- a) La promotion et ses bornes (UTC = heure de Casablanca depuis le
--    20/09/2026) :
--      select id, label, percent_off, active,
--             starts_at at time zone 'UTC' as debut,
--             ends_at   at time zone 'UTC' as fin_exclue
--      from public.promotions;
--    Attendu : Black Friday, 25.00, true, 2026-11-27 00:00:00,
--    2026-12-01 00:00:00.
--
-- a bis) Donnees de fuseaux de Postgres (information seulement) :
--      select timestamptz '2026-11-27 00:00:00+00' at time zone 'Africa/Casablanca';
--    2026-11-27 00:00:00 = a jour ; 2026-11-27 01:00:00 = anterieures au
--    20/09/2026 (sans effet sur la promotion : bornes en UTC explicite).
--
-- b) Produits et prix promo :
--      select pp.product_slug, f.amount_mad,
--             round(f.amount_mad * (1 - p.percent_off / 100), 2) as prix_promo
--      from public.promotion_products pp
--      join public.promotions p on p.id = pp.promotion_id
--      join public.formation_prices f on f.formation_slug = pp.product_slug
--      order by 1;
--    Attendu : bim-foundations-etudiant 5000.00 3750.00 ;
--              bim-foundations-pro      8500.00 6375.00.
--
-- c) RLS :
--      select relname, relrowsecurity from pg_class
--      where relname in ('promotions', 'promotion_products');
--    Attendu : true, true.

-- 8. ARRET ANTICIPE (une ligne ; journalise dans le flux d'activite admin).
--    Preferer le bouton « Désactiver » de l'admin (onglet Promotions), qui
--    journalise l'admin connecte. En SQL :
--
--      with p as (update public.promotions set active = false, updated_at = now() where label = 'Black Friday' and active returning id) insert into public.admin_activity_log (entity_type, entity_id, event_type, actor_email, note) select 'promotion', id, 'promotion_deactivated', null, 'Désactivée en SQL.' from p;
--
--    Effet immediat : les commandes creees ensuite sont au prix catalogue ;
--    une commande deja creee garde son prix (le callback compare au montant
--    de la commande). Reactivation : meme requete avec active = true,
--    "and not active" et 'promotion_activated'.
--
--    PROLONGER / AVANCER LA FIN (ex. fin le mardi 01/12 a 23:59:59, heure
--    de Casablanca = UTC+0) :
--      update public.promotions
--      set ends_at = timestamptz '2026-12-02 00:00:00+00',
--          updated_at = now()
--      where label = 'Black Friday';
