# WeLearn.ma - Site institutionnel (version actuelle)

Plateforme EdTech orientee formation professionnelle continue pour le BTP, le BIM, l'ingenierie de formation et le digital learning au Maroc et en Afrique.

Derniere mise a jour de cette documentation: Mars 2026.

## Etat de la version

Cette version du projet est basee sur Next.js App Router avec une architecture modulaire par section.

Fonctionnalites majeures actuellement en place:

- Navigation sticky desktop/mobile avec mega-menu et CTA LMS
- Breadcrumb global injecte depuis le layout
- Pages marketing et catalogues de formation structurees par domaines
- Formulaire de contact enrichi (type de demande + upload de fichiers)
- Bandeau de consentement cookies (RGPD) avec sauvegarde locale
- Composants reutilisables pour filtres de catalogue et telechargements PDF
- Tracking Vercel Analytics integre au layout global

## Stack technique

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Radix UI (primitives UI)
- Lucide React (icons)
- Vercel Analytics

## Arborescence principale

- app/: routes de pages
- components/: sections metier et composants partages
- components/ui/: primitives UI
- data/: donnees statiques (ex: catalogue formations)
- lib/: utilitaires
- public/: assets statiques
- docs/: guides d'implementation et changelog

## Routes actuellement disponibles

- / (Accueil)
- /about
- /formations
- /formations/certifiantes
- /formations/certifiantes/bim-foundations
- /formations/certifiantes/catalogue
- /formations/certifiantes/sur-mesure
- /formations/diplomantes
- /formations/diplomantes/executive-masters
- /formations/diplomantes/licences-pro
- /ingenierie
- /ingenierie/academie
- /ingenierie/accompagnement
- /digital-learning
- /digital-learning/lms
- /digital-learning/contenus-elearning
- /digital-learning/bibliotheque
- /conseil
- /evenements
- /contact

## Composants metier notables

- components/navbar.tsx: navigation principale + mega-menu
- components/breadcrumb.tsx: fil d'Ariane global
- components/cookie-consent.tsx: gestion du consentement cookies
- components/contact/contact-form-section.tsx: formulaire contact enrichi
- components/catalogue-filters.tsx: filtrage de catalogue
- components/pdf-download.tsx: bloc de telechargement de documents

## Demarrage local

1. Installer les dependances:

```bash
pnpm install
```

2. Lancer le serveur de developpement:

```bash
pnpm dev
```

3. Ouvrir l'application:

http://localhost:3000

## Scripts utiles

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Deploiement

Le projet est prepare pour un deploiement Vercel.

Pipeline standard:

1. pnpm install
2. pnpm build
3. pnpm start

## Notes importantes

- Le formulaire de contact est pret cote front mais le routage email/API reste a brancher selon l'infrastructure cible.
- Consulter docs/implementation-guide.md pour les conventions d'architecture et docs/changelog.md pour l'historique des evolutions.

## Mainteneur

- @wa1ead
