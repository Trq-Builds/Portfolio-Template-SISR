# `  ⚫  `︲`  ⚪  ` Portfolio-Template-SISR

<p align="center">
Achromatique ︲ Lavande ︲ SPA Statique · Zéro Framework
</p>

<p align="center">
  <img src="https://img.shields.io/website?url=https://tariq-laab.netlify.app&label=deploy&style=for-the-badge">
  <img src="https://img.shields.io/badge/stack-HTML5%2FCSS3%2FJS_ES6+-informational?style=for-the-badge">
  <img src="https://img.shields.io/badge/hosting-Netlify_CDN-00C7B7?style=for-the-badge&logo=netlify">
  <img src="https://img.shields.io/badge/BTS_SIO-SISR_E5_2026-8E95E1?style=for-the-badge">
  <img src="https://img.shields.io/badge/open--source-MIT-lightgrey?style=for-the-badge">
</p>

---

`  🌐  `︲**Démo Technique :** portfolio-template-sisr.netlify.app

`  🌐  `︲**Démo Technique concrète :** https://tariq-laab.netlify.app

`  🟣  `︲**Fork base :** [codewithsadee/vcard-personal-portfolio](https://github.com/codewithsadee/vcard-personal-portfolio)

---

## `  ⚫  `︲Présentation Générale & Objectifs

Portfolio personnel d'un étudiant BTS SIO option SISR (Solutions d'Infrastructure, Systèmes et Réseaux), développé entièrement sans framework. Le projet sert trois objectifs distincts :

- **Vitrine professionnelle** : parcours, compétences, stages, certifications et productions techniques accessibles en un point unique.
- **Démonstration technique** : architecture SPA pilotée par données, rendu DOM lazy, système de thème dual-mode  le code est la preuve de compétence.
- **Ressource pédagogique open-source** : chaque décision d'architecture est documentée pour qu'un étudiant SISR puisse reproduire, forker et adapter le projet dans le cadre de ses activités E4/E5.

Le projet n'embarque aucune dépendance runtime. Aucun `npm install` requis pour faire tourner le site. Un navigateur suffit.

---

## `  ⚫  `︲Architecture & Stack Technique

### Vue d'ensemble

```text
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ data.js  │ ───► │ main.js  │ ───► │   DOM    │ ◄─── │ style.css│
│  Model   │      │Controller│      │   View   │      │ (Design) │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                       │
                       ▼
              ┌────────────────┐
              │   script.js    │
              │ Event Handling │
              └────────────────┘
```

`index.html` est un shell vide. Aucun contenu statique  tous les nœuds DOM (navbar, sidebar, sections) sont injectés au `DOMContentLoaded` depuis `data.js`.

### Responsabilités des modules

| Fichier | Pattern | Responsabilité |
|---|---|---|
| `data.js` | **Model** | Source de vérité unique : profil, parcours, outils, certifications, portfolio, veille, stage |
| `main.js` | **Controller** | Rendu DOM, routage SPA, lazy rendering, filtres portfolio, easter egg avatar |
| `script.js` | **Event Handler** | Sidebar toggle, filtres mobile, navigation liens |
| `theme-toggle.js` | **State Manager** | Persistance `localStorage`, swap favicon et avatar selon le thème |

### Patron architectural : Lazy Rendering

Les sections ne sont pas rendues au chargement. `SECTION_RENDERERS` est une `Map` id → fonction. `RENDERED` est un `Set`. Au premier clic sur une nav, `renderSection(id)` vérifie le Set en O(1) avant d'injecter.

```js
// Guard O(1)  aucune re-exécution, aucune double injection
function renderSection(id) {
  if (RENDERED.has(id)) return;
  RENDERED.add(id);
  SECTION_RENDERERS[id]?.();
}
```

Résultat : seul `about` est rendu au load. Le reste est différé jusqu'au besoin.

### Infrastructure CSS

- **Custom Properties** : palette dual-mode (`--bg-body`, `--text-primary`, `--brand`, `--shadow-*`)  toutes les valeurs sémantiques sont des tokens, zéro valeur hardcodée dans les règles.
- **Dark Mode** : sélecteur `body.dark-mode` unique, swap de surface et d'ombres exclusivement. Zéro duplication de règles structurelles.
- **Animations** : `@keyframes fade` (opacity + translateY) et `scaleUp` (transform + opacity)  exclusivement GPU-safe. Zéro `reflow`.
- **Typographie fluide** : `clamp(min, vw, max)` sur les titres  responsive sans media query dédiée.
- **Responsive** : Mobile-first, breakpoints consolidés à `480px / 580px / 720px / 1024px / 1250px` dans un bloc unique en fin de fichier.
- **Sidebar sticky** : `position: sticky; top: 60px` en wide (≥1250px)  zéro JavaScript impliqué.

### Infrastructure de déploiement (pertinent SISR)

```text
Poste local
│
├── Édition VSCodium
├── Prévisualisation : fichier ouvert directement dans navigateur (file://)
│     ⚠ Note : les modules ES6 (import/export) nécessitent un serveur HTTP local
│               pour contourner la restriction CORS sur file:// 
│               → utiliser : npx serve . ou l'extension Live Server
│
└── Git Push ──► GitHub (dépôt source, versioning)
                    │
                    └──► Netlify (déploiement manuel par drag & drop ou CLI)
                              │
                              ├── CDN global (Edge Nodes distribués)
                              ├── HTTPS automatique (Let's Encrypt)
                              ├── Headers de sécurité configurables (netlify.toml)
                              └── URL : https://tariq-laab.netlify.app
```

**Protocole de déploiement actuel** : manuel via drag & drop Netlify après validation locale. Zéro CI/CD automatisé  déploiement déclenché intentionnellement.

---

## `  ⚪  `︲Fonctionnalités Phares

### Routage SPA sans framework

Navigation entre 8 sections (`À propos`, `Parcours`, `Stage`, `Certifications`, `Veille`, `Outils`, `Matériel`, `Portfolio`) sans rechargement de page. Historique non géré (pas de `history.pushState`)  choix délibéré pour un portfolio statique sans backend.

### Système de thème dual-mode

Persistance via `localStorage`. Swap simultané : couleurs CSS, avatar (`avatar-light.webp` ↔ `avatar-dark.webp`), favicon (`.ico` dark/light). Transition CSS sur `background-color` et `color` à `0.35s ease`  zéro flash au rechargement.

### Accordéon expandable (CSS Grid Trick)

Révélation de contenu sans hauteur hardcodée :

```css
.expandable-body {
  display: grid;
  grid-template-rows: 0fr; /* fermé */
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
[data-expandable].is-open .expandable-body {
  grid-template-rows: 1fr; /* ouvert */
}
```

Aucun `getBoundingClientRect`, aucun `reflow` JS. Délégation d'événement unique sur le container parent  O(1) peu importe le nombre de cartes.

### Filtres Portfolio

Filtrage par catégorie (`Windows`, `Linux`, `Autre`) via `data-filter` attributes. Animation `scaleUp` à l'apparition des items  `transform + opacity` uniquement.

---

## `  ⚫  `︲Guide de Déploiement et Configuration

### Prérequis

| Outil | Rôle | Requis |
|---|---|---|
| Navigateur moderne | Prévisualisation locale | Oui |
| Git | Versioning et push GitHub | Oui |
| Node.js (optionnel) | Serveur local HTTP pour modules ES6 | Recommandé |
| Compte GitHub | Hébergement du code source | Oui |
| Compte Netlify (gratuit) | Déploiement CDN HTTPS | Oui |

> **Note SISR** : Node.js n'est pas une dépendance d'exécution du site. Il sert uniquement à lancer un serveur HTTP local (`npx serve .`) pour contourner la restriction CORS du protocole `file://` lors du dev avec modules ES6.

### 1. Cloner le dépôt

```bash
git clone https://github.com/Trq-Builds/2025-Portfolio-V1.8.git
cd 2025-Portfolio-V1.8
```

### 2. Lancer en local

```bash
# Option A  Node.js disponible
npx serve .
# → http://localhost:3000

# Option B  Python disponible
python -m http.server 8080
# → http://localhost:8080

# Option C  Extension VS Code
# Installer "Live Server" → clic droit sur index.html → "Open with Live Server"
```

### 3. Personnaliser le contenu

Tout le contenu est centralisé dans **`assets/js/data.js`**. Aucune modification de `main.js` ou du HTML n'est nécessaire pour adapter le portfolio.

```text
data.js
├── profileData       → Nom, rôle, avatar, email, liens sociaux
├── aboutData         → Texte de présentation (HTML inline autorisé)
├── resumeData        → Formation, expériences, barres de compétences
├── stageData         → Cartes de stage avec missions
├── outilsData        → Catégories d'outils avec descriptions et liens
├── certificationsData→ Certifications obtenues / en cours
├── materielData      → Setup hardware par catégorie
├── veilleData        → Sources de veille informatique par thème
└── portfolioData     → Projets avec image, catégorie et lien
```

### 4. Remplacer les assets

```text
assets/
└── images/
    ├── avatar-light.webp   ← Avatar thème clair
    ├── avatar-dark.webp    ← Avatar thème sombre
    ├── logo-light.ico      ← Favicon thème clair
    └── logo-dark.ico       ← Favicon thème sombre
```

Format recommandé pour les avatars : `.webp`, 150×150px minimum, fond transparent ou uni.

### 5. Déployer sur Netlify

**Méthode manuelle (drag & drop)**

1. Se connecter sur [app.netlify.com](https://app.netlify.com)
2. Aller dans "Sites" → "Add new site" → "Deploy manually"
3. Glisser-déposer le dossier racine du projet
4. URL générée automatiquement  personnalisable dans les paramètres du site

**Méthode CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

### 6. Sécurité et en-têtes HTTP (netlify.toml)

Pour ajouter des en-têtes de sécurité HTTP (pertinent pour les étudiants SISR  notions de hardening web), créer un fichier `netlify.toml` à la racine :

```toml
[[headers]]
  for = "/*"
  [headers.values]
    # Empêche le chargement dans une iframe (clickjacking)
    X-Frame-Options = "DENY"
    # Désactive la détection automatique du type MIME par le navigateur
    X-Content-Type-Options = "nosniff"
    # Force HTTPS pendant 1 an, sous-domaines inclus
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    # Contrôle les informations envoyées dans le header Referer
    Referrer-Policy = "strict-origin-when-cross-origin"
    # Politique de permissions (caméra, micro, géolocalisation désactivés)
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    # Content Security Policy : restreint les origines des ressources chargées
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'"
```

> **Point SISR** : Ces en-têtes sont vérifiables via `curl -I https://tariq-laab.netlify.app` ou via l'onglet Réseau des DevTools. Ils correspondent aux bonnes pratiques ANSSI pour les sites web exposés.

### 7. Variables d'environnement

Ce projet n'utilise **aucune variable d'environnement** côté client  par conception. Un portfolio statique ne doit embarquer aucun secret dans le bundle JS (clé API, token) : tout secret dans un fichier `.js` servi publiquement est lisible par n'importe qui via les DevTools.

Si une fonctionnalité future nécessite une API (formulaire de contact, analytics), la logique doit passer par une **Netlify Function** (lambda serverless) qui seule détient les variables d'environnement configurées dans le dashboard Netlify  jamais côté client.

---

## `  ⚪  `︲Contribution

Le projet est ouvert aux contributions. Quelques règles non négociables avant de soumettre une PR :

**P0  Architecture**
- Toute donnée nouvelle va dans `data.js`. Zéro contenu hardcodé dans `main.js` ou le HTML.
- Zéro dépendance externe ajoutée sans justification documentée dans la PR.

**P1  CSS**
- Zéro valeur hardcodée pour les couleurs, espacements ou rayons. Utiliser les tokens `:root` existants.
- Toute animation doit n'utiliser que `transform` et/ou `opacity`. Un `reflow` introduit = PR rejetée.

**P2  JS**
- Accès DOM toujours gardé (optional chaining ou guard `if`).
- Tout nouveau listener sur un `NodeList` doit utiliser la délégation d'événement sur le parent, pas une boucle d'attachement.

**Workflow**

```bash
# 1. Fork → Clone
git clone https://github.com/<ton-pseudo>/2025-Portfolio-V1.8.git

# 2. Branche dédiée
git checkout -b feature/nom-explicite

# 3. Commit conventionnel
git commit -m "feat(data): ajout section projets personnels"
git commit -m "fix(css): correction overflow sidebar mobile 580px"
git commit -m "perf(main): lazy render section veille"

# 4. Pull Request sur main avec description du delta
```

---

## `  ⚫  `︲Stack & Outils

```
Frontend    : HTML5 · CSS3 Custom Properties · JS ES6+ Modules (import/export natif)
Animations  : CSS @keyframes (transform + opacity  GPU-safe uniquement)
Icons       : Ionicons 5.5.2 (ESM, chargé via unpkg CDN)
Fonts       : Google Fonts  Poppins (300/400/500/600)
Hosting     : Netlify (Manual Deploy  HTTPS  CDN Edge)
Versioning  : GitHub
IDE         : VSCodium (thème : Monochromator Dark Plain)
Live Server : Extension VSCodium · Serveur local de développement (Hot Reload synchrone)
XnConvert   : Traitement par lots · Encodage WebP (Lossy 75 / Lossless) · Purge des métadonnées (EXIF/ICC)
IAs         : Claude Sonnet · GPT-5.1 · Gemini 3.0 Pro
```

---
