-- Paiement CMI : suppression du choix d'acces, ETAPE 2 / 2.
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- Supprime orders.access_choice (et sa contrainte check, supprimee avec la
-- colonne). Le choix d'acces n'existe plus (CGV art. 8 du 27/11/2026 : acces
-- immediat pour toute commande) ; le backend ne lit ni n'ecrit plus cette
-- colonne. orders.access_available_at est conserve (= paid_at).
--
-- PREREQUIS :
--   * 20261127000000_orders_access_choice_default.sql applique ;
--   * le NOUVEAU backend en ligne (celui qui ne lit plus access_choice).
--
-- ORDRE DE DEPLOIEMENT : appliquer APRES la mise en ligne du nouveau
-- backend. L'ancien backend lit access_choice a chaque init et a chaque
-- callback CMI : applique trop tot, il ne pourrait plus ni creer de commande
-- ni marquer une commande payee.
--
-- DONNEES : la valeur de chaque commande existante est perdue. Pour la
-- consulter ou l'exporter avant (lecture seule) :
--   select oid, status, access_choice, paid_at, access_available_at
--   from public.orders
--   where access_choice = 'after_withdrawal'
--   order by created_at;
--
-- Pas de CASCADE : si un objet dependait encore de la colonne, la
-- migration echouerait au lieu de le supprimer.
--
-- Idempotente : drop column if exists.

begin;

alter table public.orders
  drop column if exists access_choice;

commit;

notify pgrst, 'reload schema';

-- VERIFICATION (lecture seule) :
--   select column_name
--   from information_schema.columns
--   where table_schema = 'public' and table_name = 'orders'
--     and column_name = 'access_choice';
-- Attendu : 0 ligne.
