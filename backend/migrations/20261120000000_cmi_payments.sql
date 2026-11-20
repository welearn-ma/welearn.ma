-- Paiement en ligne CMI (3D Pay Hosting, Damane Cash) : grille de prix,
-- commandes et journal brut des retours CMI.
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- * formation_prices : prix de reference en MAD, lus par POST /api/payments/cmi/init.
--   Le montant envoye au CMI vient TOUJOURS de cette table, jamais de la requete.
--   Une seule ligne de test est inseree ; les vrais prix viendront du Commercial.
-- * orders : une ligne par tentative de commande (oid unique envoye au CMI).
--   access_available_at reste NULL jusqu'au passage en PAID : le backend le
--   renseigne dans la meme mise a jour conditionnelle (PENDING -> PAID),
--   = paid_at (immediate) ou paid_at + 7 jours (after_withdrawal), CGV art. 8.
-- * payment_events : chaque requete recue du CMI (callback serveur-a-serveur
--   et retour navigateur okUrl/failUrl), payload complet en jsonb.
--
-- Note archi : le backend Express ecrit via la SERVICE ROLE KEY
-- (backend/src/lib/supabaseClient.ts), qui contourne la RLS. On active donc
-- la RLS SANS aucune policy (anon / authenticated : acces refuse), comme
-- registration_requests, sponsors et admin_activity_log.
--
-- Migration ADDITIVE uniquement : aucune table ou ligne existante n'est
-- modifiee. Idempotente (if not exists / on conflict do nothing).
--
-- ORDRE DE DEPLOIEMENT : appliquer cette migration AVANT de deployer le
-- backend qui expose /api/payments (il lit formation_prices et ecrit orders /
-- payment_events).

begin;

-- 1. Grille de prix.
create table if not exists public.formation_prices (
  formation_slug text primary key,
  amount_mad     numeric(10,2) not null check (amount_mad > 0),
  active         boolean not null default true,
  updated_at     timestamptz not null default now()
);

-- Ligne de test uniquement (formation fictive, 10.00 MAD). Aucun autre prix.
insert into public.formation_prices (formation_slug, amount_mad, active)
values ('test-paiement-cmi', 10.00, true)
on conflict (formation_slug) do nothing;

-- 2. Commandes.
create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  oid                  text unique not null,
  formation_slug       text not null references public.formation_prices (formation_slug),
  amount_mad           numeric(10,2) not null,
  currency             text not null default '504',
  status               text not null default 'PENDING'
                         check (status in ('PENDING', 'PAID', 'FAILED', 'CANCELLED')),
  customer_name        text not null,
  customer_email       text not null,
  customer_phone       text,
  cgv_accepted_at      timestamptz not null,
  cgv_version          text not null,
  access_choice        text not null
                         check (access_choice in ('immediate', 'after_withdrawal')),
  access_available_at  timestamptz,
  cmi_trans_id         text,
  cmi_auth_code        text,
  cmi_proc_return_code text,
  paid_at              timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- 3. Journal brut des requetes recues du CMI.
create table if not exists public.payment_events (
  id               bigserial primary key,
  oid              text,
  source           text not null check (source in ('callback', 'return')),
  hash_valid       boolean,
  proc_return_code text,
  response         text,
  trans_id         text,
  reply            text,
  payload          jsonb not null,
  received_at      timestamptz not null default now()
);

create index if not exists payment_events_oid_idx
  on public.payment_events (oid);

-- 4. RLS activee, aucune policy : acces backend (service_role) uniquement.
alter table public.formation_prices enable row level security;
alter table public.orders enable row level security;
alter table public.payment_events enable row level security;

commit;

notify pgrst, 'reload schema';
