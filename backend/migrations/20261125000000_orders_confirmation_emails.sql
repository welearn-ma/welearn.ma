-- Paiement CMI : e-mails de confirmation des commandes payees.
-- Run in the Supabase SQL editor for the welearn.ma project.
--
-- * orders.confirmation_email_sent_at : envoi reussi de l'e-mail de
--   confirmation au client (orders.customer_email).
-- * orders.team_notified_at           : envoi reussi de la notification
--   interne (CONTACT_RECIPIENT).
--   Les deux restent NULL tant que l'envoi n'a pas reussi. Le backend les
--   renseigne apres sa reponse au callback CMI, uniquement pour la commande
--   que ce callback vient de faire passer PENDING -> PAID.
--
-- Aucune autre modification : aucune contrainte, aucun backfill (les
-- commandes deja payees restent NULL : aucun e-mail ne leur a ete envoye).
--
-- PREREQUIS : 20261120000000_cmi_payments.sql applique (table orders).
--
-- ORDRE DE DEPLOIEMENT : appliquer AVANT le backend qui envoie ces e-mails.
-- Sans cette migration, les e-mails partent quand meme mais l'horodatage
-- echoue (erreur journalisee cote serveur, sans donnee client).
--
-- Idempotente : add column if not exists.

begin;

alter table public.orders
  add column if not exists confirmation_email_sent_at timestamptz,
  add column if not exists team_notified_at           timestamptz;

commit;

notify pgrst, 'reload schema';

-- VERIFICATION (lecture seule) :
--   select column_name, data_type, is_nullable, column_default
--   from information_schema.columns
--   where table_schema = 'public' and table_name = 'orders'
--     and column_name in ('confirmation_email_sent_at', 'team_notified_at')
--   order by column_name;
-- Attendu : 2 lignes, timestamp with time zone, is_nullable = YES,
-- column_default NULL.
