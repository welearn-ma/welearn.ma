# Guide d'intégration - Composants Welearn

## 📚 Table des matières

1. [Cookie Consent](#cookie-consent)
2. [Contact Form Amélioré](#contact-form-amélioré)
3. [Catalogue Filters](#catalogue-filters)
4. [PDF Download](#pdf-download)
5. [Breadcrumb](#breadcrumb)
6. [Vidéos Pédagogiques](#vidéos-pédagogiques)

---

## Cookie Consent

### Description

Banneau RGPD pour collecter le consentement utilisateur sur les cookies.

### Intégration

✅ **Déjà intégré dans:** `app/layout.tsx`

### Fonctionnalités

- Sauvegarde automatique des préférences dans `localStorage`
- 3 niveaux: Nécessaires, Analytiques, Marketing
- Design responsive
- Apparaît après 1 seconde

### Code

```tsx
import { CookieConsent } from "@/components/cookie-consent";

// Dans votre layout
<CookieConsent />;
```

### Configuration localStorage

```typescript
// Format sauvegardé
{
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: "2025-03-02T10:30:00Z"
}
```

### Prochaines étapes

Connecter les préférences au backend:

- Utiliser les données de cookies pour les outils d'analytics
- Implémenter le suivi par pixel marketing si analytics=true

---

## Contact Form Amélioré

### Description

Formulaire de contact avec détection intelligente du type de demande et upload de fichiers.

### Localisation

- **Page:** `/contact`
- **Composant:** `components/contact/contact-form-section.tsx`

### Nouveautés

1. **Sélecteur de type de demande**
   - Formation individuelle
   - Projet entreprise (B2B)
   - Partenariat
   - Autre demande

2. **Upload de pièces jointes**
   - Formats supportés: PDF, DOC, DOCX, XLS, XLSX
   - Limite: 10 Mo par fichier
   - Affichage des fichiers avec option de suppression

3. **Messages personnalisés**
   - Confirmation différente selon le type

### Intégration Backend Requise

#### Route API

```typescript
// pages/api/contact/submit.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    subject,
    message,
    requestType,
    files,
  } = req.body;

  try {
    // Définir le destinataire selon le type
    const emailRouting: Record<string, string> = {
      formation: "formations@welearn.ma",
      entreprise: "entreprise@welearn.ma",
      partenariat: "partenariats@welearn.ma",
      autre: "contact@welearn.ma",
    };

    const toEmail = emailRouting[requestType] || "contact@welearn.ma";

    // Envoyer l'email
    // await sendEmail({
    //   to: toEmail,
    //   subject,
    //   html: generateEmailTemplate({...})
    // });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
}
```

#### Format du formulaire

```typescript
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  requestType: "formation" | "entreprise" | "partenariat" | "autre";
  files?: File[];
}
```

---

## Catalogue Filters

### Description

Système de filtrage pour les catalogues de formations avec recherche, tri par thème, format, niveau et durée.

### Localisation

`components/catalogue-filters.tsx`

### Utilisation basique

```tsx
"use client";

import {
  CatalogueFilters,
  FormationFilter,
} from "@/components/catalogue-filters";
import { useState } from "react";

export function Formations() {
  const [activeFilters, setActiveFilters] = useState<FormationFilter>({});

  const handleFilterChange = (filters: FormationFilter) => {
    setActiveFilters(filters);
    // Appliquer les filtres à votre liste
    filterFormations(formations, filters);
  };

  return (
    <CatalogueFilters
      onFilterChange={handleFilterChange}
      themes={["BIM", "Management", "Technique"]}
      levels={["Débutant", "Intermédiaire", "Avancé"]}
      durations={[
        "Moins d'une journée",
        "1-3 jours",
        "1 semaine",
        "Plus d'une semaine",
      ]}
    />
  );
}
```

### Interface FormationFilter

```typescript
interface FormationFilter {
  theme?: string;
  format?: "presentiel" | "digital" | "blended";
  level?: string;
  duration?: string;
  search?: string;
}
```

### Fonction de filtrage suggérée

```typescript
function filterFormations(formations, filters: FormationFilter) {
  return formations.filter((formation) => {
    if (
      filters.search &&
      !formation.title.toLowerCase().includes(filters.search)
    ) {
      return false;
    }
    if (filters.theme && formation.theme !== filters.theme) {
      return false;
    }
    if (filters.format && formation.format !== filters.format) {
      return false;
    }
    if (filters.level && formation.level !== filters.level) {
      return false;
    }
    if (filters.duration && formation.duration !== filters.duration) {
      return false;
    }
    return true;
  });
}
```

---

## PDF Download

### Description

Composant pour afficher et télécharger des documents PDF ou autres fichiers.

### Composants disponibles

1. **PDFDownloadComponent** - Affichage en grille
2. **DownloadCTA** - Section avec fond
3. **DownloadSuccess** - Message de succès

### Utilisation

#### 1. PDFDownloadComponent

```tsx
import { PDFDownloadComponent } from "@/components/pdf-download";

const files = [
  {
    name: "brochure-2024.pdf",
    label: "Brochure Formations 2024",
    description: "Toutes nos formations et tarifs",
  },
  {
    name: "guide-csf.pdf",
    label: "Guide CSF",
    description: "Comment optimiser votre remboursement",
  },
];

<PDFDownloadComponent
  files={files}
  title="Nos documents"
  description="Téléchargez nos ressources gratuitement"
/>;
```

#### 2. DownloadCTA

```tsx
import { DownloadCTA } from "@/components/pdf-download";

<DownloadCTA
  title="Besoin de plus d'informations ?"
  description="Téléchargez notre brochure complète"
  files={[
    {
      name: "brochure.pdf",
      label: "Brochure PDF",
      description: "12 pages détaillées",
    },
  ]}
/>;
```

### Installation des fichiers

1. Créer le dossier: `public/documents/`
2. Placer les PDF à télécharger:
   ```
   public/
   └── documents/
       ├── brochure-formations.pdf
       ├── guide-csf.pdf
       └── ... autres documents
   ```

### Configuration backend (optionnel)

Si vous voulez tracker les téléchargements:

```typescript
// Ajouter à la fonction handleDownload
fetch("/api/analytics/download", {
  method: "POST",
  body: JSON.stringify({
    filename,
    timestamp: new Date(),
    userAgent: navigator.userAgent,
  }),
});
```

---

## Breadcrumb

### Description

Navigation structurée affichant le chemin parcouru sur le site.

### Localisation

`components/breadcrumb.tsx`

### Intégration

✅ **Déjà intégré dans:** `app/layout.tsx`

Pages où le breadcrumb s'affiche:

- `/about` et sous-pages
- `/formations` et sous-pages
- `/ingenierie` et sous-pages
- `/digital-learning` et sous-pages
- `/conseil` et sous-pages
- `/ressources` et sous-pages
- `/evenements`
- `/contact`

### Personnalisation

Modifier l'objet `routeLabels` pour personnaliser les libellés:

```typescript
const routeLabels: Record<string, string> = {
  about: "À propos",
  formations: "Formations",
  // Ajouter vos routes custom
  "ma-nouvelle-page": "Ma nouvelle page",
};
```

---

## Vidéos Pédagogiques

### Description

Page showcase pour une bibliothèque de vidéos pédagogiques avec filtrage par catégorie.

### Localisation

`app/ressources/videos/page.tsx`

### Accès

URL: `/ressources/videos`

### Données par défaut

9 vidéos d'exemple avec:

- Titre, description
- Durée
- Catégorie (BIM, Pédagogie, Digital Learning, etc.)
- Vue count
- Date de publication

### Customisation

Remplacer le tableau `videos` pour ajouter vos vidéos:

```typescript
const videos = [
  {
    id: 1,
    title: "Votre titre",
    description: "Description détaillée",
    duration: "10:30",
    category: "BIM",
    thumbnail: "/images/video-thumbnails/votre-video.jpg",
    views: "1K",
    date: "2025-03-01",
  },
  // ...
];
```

### Intégration YouTube (optionnel)

Pour intégrer les vidéos YouTube:

```tsx
// Dans le composant video
<div className="relative aspect-video bg-black">
  <iframe
    width="100%"
    height="100%"
    src={`https://www.youtube.com/embed/${videoId}`}
    allowFullScreen
  />
</div>
```

---

## 🔧 Utilitaires disponibles

### Import d'icônes Lucide

```typescript
import { FileDown, Cookie, Shield, Upload, X, Play } from "lucide-react";
```

### Composants UI réutilisables

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
```

---

## 🚀 Déploiement

### Variables d'environnement requises

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://welearn.ma
NEXT_PUBLIC_ANALYTICS_ID=your-google-analytics-id

# Backend
SMTP_HOST=your-email-provider
SMTP_USER=your-email
SMTP_PASS=your-password
CONTACT_EMAIL=contact@welearn.ma
```

### Build production

```bash
pnpm run build
pnpm start
```

---

## 📈 Métriques de succès

### Formulaire de contact

- [ ] Submissions tracking
- [ ] Conversion rate monitoring
- [ ] Response time follow-up

### Filtrs de catalogue

- [ ] Filter usage analytics
- [ ] Most used filters
- [ ] Filter combination patterns

### Documents

- [ ] Download tracking
- [ ] File popularity metrics
- [ ] Conversion attribution

### Cookies

- [ ] Consent rate
- [ ] Analytics vs marketing ratio
- [ ] Consent analytics

---

## 🆘 Troubleshooting

### Cookie consent ne s'affiche pas

- Vérifier localStorage dans DevTools
- Effacer les données de stockage et recharger
- Vérifier la zIndex (z-50)

### Formulaire contact ne soumet pas

- Implémenter la route API `/api/contact/submit`
- Vérifier la CORS configuration
- Implémenter la validation backend

### Filtres ne fonctionnent pas

- S'assurer du state management côté liste
- Vérifier que `onFilterChange` est implémentée correctement
- Utiliser `"use client"` directive

### Breadcrumb mal formé

- Ajouter la route dans `routeLabels`
- Vérifier le format d'URL (kebab-case)
- Tester avec des segments spécifiques

---

**Dernière mise à jour:** 2 mars 2026
**Version:** 1.0
**Statut:** ✅ Production Ready
