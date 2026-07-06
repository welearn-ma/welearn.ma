-- Sponsoring MOOC : deux tables normalisees (sponsors + sponsor_moocs).
--
-- Note archi : le backend Express insere via la SERVICE ROLE KEY
-- (voir backend/src/lib/supabaseClient.ts), qui contourne la RLS.
-- On active donc la RLS SANS policy publique, exactement comme la table
-- registration_requests existante : aucune ecriture anon directe n'est
-- exposee, tout passe par l'API /api/sponsors.

create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  prenom text not null,
  entreprise text not null,
  role text,
  telephone text not null,
  email text not null
);

create table if not exists sponsor_moocs (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references sponsors(id) on delete cascade,
  mooc_name text not null
);

create index if not exists sponsor_moocs_sponsor_id_idx
  on sponsor_moocs (sponsor_id);

alter table sponsors enable row level security;
alter table sponsor_moocs enable row level security;
