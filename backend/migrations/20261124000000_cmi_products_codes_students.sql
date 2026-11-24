-- Paiement CMI, produits reels : packs BIM Foundations Professional, codes
-- personnels (etudiant / reduction 5 %), justificatifs etudiants.
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- * formation_prices : + label, page_slug, requires_student_code ; 2 packs
--   BIM Foundations Professional (8 500,00 / 5 000,00 MAD TTC).
-- * student_proofs   : justificatifs de statut etudiant (fichier dans le
--   bucket PRIVE student-proofs ; seul le chemin est stocke, jamais une URL).
-- * codes            : codes WL-XXXX-XXXX lies a l'e-mail du client
--   (kind 'student' : debloque le Pack Etudiants ; 'discount' : -5 %).
-- * orders           : + list_amount_mad, discount_mad, code_id.
--   amount_mad reste le montant REELLEMENT debite.
-- * admin_activity_log : + entites 'student_proof' / 'code' et leurs
--   evenements ; 'proof_submitted' est ecrit par trigger (meme principe que
--   'new_request').
-- * Bucket Storage prive 'student-proofs' (5 Mo, PDF / JPEG / PNG).
--
-- Note archi : comme les tables CMI existantes, RLS activee SANS policy ; seul
-- le backend (service role) lit / ecrit.
--
-- NOMMAGE : chaque contrainte porte un nom explicite qui ne suit PAS le
-- schema des noms automatiques de Postgres (<table>_<colonne>_check / _key /
-- _fkey) : aucune collision possible avec un nom genere.
--
-- COMPATIBILITE : additive. Le backend deja deploye (0fd76ca) continue de
-- fonctionner : les nouvelles colonnes de orders sont nullables ou ont un
-- defaut, et il ne lit que formation_prices.amount_mad.
--
-- PRODUITS INACTIFS : les 2 packs BIM sont inseres avec active = false. Le
-- backend deploye (0fd76ca) ne connait ni requires_student_code ni les codes :
-- actif, il accepterait le Pack Etudiants SANS code. Les activer seulement
-- APRES le deploiement du nouveau backend (bloc 9, a lancer a part).
--
-- ORDRE DE DEPLOIEMENT : cette migration -> verification Storage (bloc 8)
-- -> nouveau backend -> nouveau frontend -> activation des packs (bloc 9).
--
-- Idempotente : if not exists, on conflict, drop ... if exists + add.

begin;

-- 1. Produits : colonnes de catalogue sur formation_prices.
alter table public.formation_prices
  add column if not exists label                 text,
  add column if not exists page_slug             text,
  add column if not exists requires_student_code boolean not null default false;

update public.formation_prices
set label = 'Test paiement CMI', updated_at = now()
where formation_slug = 'test-paiement-cmi'
  and label is null;

insert into public.formation_prices
  (formation_slug, amount_mad, active, label, page_slug, requires_student_code)
values
  ('bim-foundations-pro', 8500.00, false,
   'BIM Foundations Professional — Pack Professionnels',
   'bim-foundations-professional', false),
  ('bim-foundations-etudiant', 5000.00, false,
   'BIM Foundations Professional — Pack Étudiants',
   'bim-foundations-professional', true)
on conflict (formation_slug) do nothing;

-- Echoue (et annule tout) si une autre ligne n'a pas de libelle : le
-- completer a la main puis relancer.
alter table public.formation_prices
  alter column label set not null;

alter table public.formation_prices
  drop constraint if exists formation_prices_label_not_blank;
alter table public.formation_prices
  add constraint formation_prices_label_not_blank
  check (char_length(btrim(label)) > 0);

-- 2. Justificatifs etudiants.
create table if not exists public.student_proofs (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null
                     constraint student_proofs_full_name_length
                     check (char_length(full_name) between 1 and 255),
  email            text not null
                     constraint student_proofs_email_valid
                     check (char_length(email) <= 64 and email = lower(email)),
  phone            text,
  page_slug        text not null,
  -- Chemin de l'objet DANS le bucket student-proofs : "<uuid>.<ext>".
  -- Le format interdit d'y stocker une URL.
  file_path        text not null
                     constraint student_proofs_file_path_format
                     check (file_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|jpg|png)$'),
  file_mime        text not null
                     constraint student_proofs_file_mime_valid
                     check (file_mime in ('application/pdf', 'image/jpeg', 'image/png')),
  file_size        integer not null
                     constraint student_proofs_file_size_range
                     check (file_size > 0 and file_size <= 5242880),
  status           text not null default 'PENDING'
                     constraint student_proofs_status_valid
                     check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  rejection_reason text
                     constraint student_proofs_rejection_reason_length
                     check (char_length(rejection_reason) <= 1000),
  reviewed_by      text,
  reviewed_at      timestamptz,
  code_id          uuid,
  created_at       timestamptz not null default now(),
  -- "is not null" explicite : un CHECK qui vaut NULL est considere comme
  -- satisfait par Postgres.
  constraint student_proofs_rejected_reason
    check (status <> 'REJECTED'
           or (rejection_reason is not null
               and char_length(btrim(rejection_reason)) > 0)),
  constraint student_proofs_reviewed_fields
    check (status = 'PENDING' or (reviewed_by is not null and reviewed_at is not null))
);

create index if not exists student_proofs_status_created_at_idx
  on public.student_proofs (status, created_at desc);

-- 3. Codes personnels.
--    Alphabet sans 0 / O / 1 / I : A-H J-N P-Z 2-9.
create table if not exists public.codes (
  id               uuid primary key default gen_random_uuid(),
  code             text not null
                     constraint codes_code_unique unique
                     constraint codes_code_format
                     check (code ~ '^WL-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$'),
  kind             text not null
                     constraint codes_kind_valid
                     check (kind in ('student', 'discount')),
  percent_off      numeric(5,2),
  -- student : produit debloque (bim-foundations-etudiant) ;
  -- discount : null = tout produit sauf le produit de test et le Pack Etudiants.
  product_slug     text
                     constraint codes_product_fk
                     references public.formation_prices (formation_slug),
  customer_email   text not null
                     constraint codes_customer_email_valid
                     check (char_length(customer_email) <= 64
                            and customer_email = lower(customer_email)),
  max_uses         integer not null default 1
                     constraint codes_max_uses_positive
                     check (max_uses >= 1),
  used_count       integer not null default 0
                     constraint codes_used_count_range
                     check (used_count >= 0 and used_count <= max_uses),
  expires_at       timestamptz not null,
  revoked_at       timestamptz,
  created_by       text not null,
  student_proof_id uuid
                     constraint codes_student_proof_fk
                     references public.student_proofs (id),
  created_at       timestamptz not null default now(),
  constraint codes_kind_percent_consistency check (
    (kind = 'discount' and percent_off is not null
       and percent_off > 0 and percent_off < 100)
    or (kind = 'student' and percent_off is null and product_slug is not null)
  ),
  constraint codes_expiry_after_creation check (expires_at > created_at)
);

create index if not exists codes_customer_email_idx
  on public.codes (customer_email);

-- Au plus un code par justificatif (double validation concurrente).
create unique index if not exists codes_one_per_student_proof
  on public.codes (student_proof_id)
  where student_proof_id is not null;

-- Lien justificatif -> code (cree apres codes : references croisees).
alter table public.student_proofs
  drop constraint if exists student_proofs_code_fk;
alter table public.student_proofs
  add constraint student_proofs_code_fk
  foreign key (code_id) references public.codes (id);

-- 4. Commandes : prix catalogue, remise, code utilise.
alter table public.orders
  add column if not exists list_amount_mad numeric(10,2),
  add column if not exists discount_mad    numeric(10,2) not null default 0,
  add column if not exists code_id         uuid
    constraint orders_code_fk references public.codes (id);

-- Commandes existantes (test) : prix catalogue = montant debite, sans remise.
update public.orders
set list_amount_mad = amount_mad
where list_amount_mad is null;

-- list_amount_mad reste nullable : le backend 0fd76ca ne le renseigne pas.
alter table public.orders
  drop constraint if exists orders_amount_consistency;
alter table public.orders
  add constraint orders_amount_consistency check (
    discount_mad >= 0
    and (list_amount_mad is null or amount_mad = list_amount_mad - discount_mad)
  );

-- Expiration des commandes PENDING (> 45 min) : balayage par date.
create index if not exists orders_pending_created_at_idx
  on public.orders (created_at)
  where status = 'PENDING';

-- 5. Flux d'activite admin : nouvelles entites et nouveaux evenements.
--    Meme methode que 20261109000000 : suppression de TOUTE contrainte CHECK
--    portant sur la colonne (dont admin_activity_log_entity_type_check, nom
--    automatique d'origine, et admin_activity_log_event_type_check, cree par
--    20261109000000), puis recreation d'une contrainte nommee.
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
  check (entity_type in ('student', 'sponsor', 'student_proof', 'code'));

alter table public.admin_activity_log
  add constraint admin_activity_log_event_type_valid
  check (event_type in (
    'new_request', 'brochure_request', 'treated', 'untreated',
    'proof_submitted', 'proof_approved', 'proof_rejected',
    'code_created', 'code_revoked'
  ));

-- Depot d'un justificatif -> 'proof_submitted' (les validations, refus et
-- operations sur les codes sont journalises par le backend, avec l'admin).
create or replace function public.log_student_proof_submitted()
returns trigger as $$
begin
  insert into public.admin_activity_log (entity_type, entity_id, event_type, actor_email)
  values ('student_proof', NEW.id, 'proof_submitted', null);
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_student_proofs_submitted on public.student_proofs;
create trigger trg_student_proofs_submitted
  after insert on public.student_proofs
  for each row execute function public.log_student_proof_submitted();

-- 6. RLS activee, aucune policy : acces backend (service_role) uniquement.
alter table public.student_proofs enable row level security;
alter table public.codes enable row level security;

-- 7. Bucket Storage PRIVE pour les justificatifs (5 Mo, PDF / JPEG / PNG).
--    Aucune policy sur storage.objects : seul le service role y accede ; les
--    fichiers ne sont lus que via des URLs signees de 60 s.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'student-proofs', 'student-proofs', false, 5242880,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public             = false,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

commit;

notify pgrst, 'reload schema';

-- 8. VERIFICATIONS (lecture seule, a lancer apres la migration).
--
-- a) Le bucket est prive :
--      select id, public, file_size_limit, allowed_mime_types
--      from storage.buckets where id = 'student-proofs';
--    Attendu : public = false, 5242880, {application/pdf,image/jpeg,image/png}.
--
-- b) Aucune policy existante sur storage.objects ne donne acces a TOUS les
--    buckets (une policy sans filtre bucket_id exposerait student-proofs) :
--      select policyname, cmd, roles, qual, with_check
--      from pg_policies
--      where schemaname = 'storage' and tablename = 'objects';
--    Attendu : chaque policy filtre sur un bucket_id precis (ou aucune).
--
-- c) Produits :
--      select formation_slug, label, amount_mad, active, page_slug,
--             requires_student_code
--      from public.formation_prices order by formation_slug;
--
-- d) Contraintes creees par cette migration :
--      select conrelid::regclass as table_name, conname, contype
--      from pg_constraint
--      where conrelid in ('public.formation_prices'::regclass,
--                         'public.student_proofs'::regclass,
--                         'public.codes'::regclass,
--                         'public.orders'::regclass,
--                         'public.admin_activity_log'::regclass)
--      order by 1, 2;

-- 9. ACTIVATION DES PACKS BIM — a lancer SEULEMENT apres le deploiement du
--    nouveau backend (qui exige le code etudiant pour le Pack Etudiants) :
--
--      update public.formation_prices
--      set active = true, updated_at = now()
--      where formation_slug in ('bim-foundations-pro', 'bim-foundations-etudiant');
