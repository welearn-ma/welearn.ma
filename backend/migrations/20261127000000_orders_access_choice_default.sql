-- Paiement CMI : suppression du choix d'acces, ETAPE 1 / 2.
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- Contexte : le formulaire de paiement ne propose plus de choix d'acces
-- (CGV art. 8 du 27/11/2026 : acces immediat pour toute commande, le clic
-- sur « Payer » vaut renonciation au droit de retractation). Le nouveau
-- backend n'ecrit plus orders.access_choice ; la colonne sera supprimee par
-- 20261127010000_orders_drop_access_choice.sql.
--
-- Cette etape donne seulement une valeur par defaut a la colonne, pour que
-- les insertions du nouveau backend (sans access_choice) respectent le
-- NOT NULL existant. Sans effet sur l'ancien backend, qui envoie toujours
-- la valeur : la migration peut donc etre appliquee a tout moment.
--
-- PREREQUIS : 20261120000000_cmi_payments.sql applique (table orders).
--
-- ORDRE DE DEPLOIEMENT : appliquer AVANT le nouveau backend. Sans elle, le
-- nouveau backend ne peut plus creer de commande (violation du NOT NULL ->
-- page /paiement/echec/?reason=error).
--
-- Idempotente : set default peut etre rejoue.

begin;

alter table public.orders
  alter column access_choice set default 'immediate';

commit;

notify pgrst, 'reload schema';

-- VERIFICATION (lecture seule) :
--   select column_name, is_nullable, column_default
--   from information_schema.columns
--   where table_schema = 'public' and table_name = 'orders'
--     and column_name = 'access_choice';
-- Attendu : 1 ligne, is_nullable = NO, column_default = 'immediate'::text.
