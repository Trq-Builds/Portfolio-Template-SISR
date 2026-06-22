# `  ⚫  `︲`  ⚪  ` Portfolio-Template-SISR

<p align="center">
SPA Statique · Zéro Framework
</p>

<p align="center">
  <img src="https://img.shields.io/badge/stack-HTML5%2FCSS3%2FJS_ES6+-informational?style=for-the-badge">
  <img src="https://img.shields.io/badge/hosting-Netlify_CDN-00C7B7?style=for-the-badge&logo=netlify">
  <img src="https://img.shields.io/badge/BTS_SIO-SISR_E5-8E95E1?style=for-the-badge">
  <img src="https://img.shields.io/badge/open--source-MIT-lightgrey?style=for-the-badge">
</p>

---

`  🌐  `︲**Démo Technique :** https://portfolio-template-sisr.netlify.app

`  🟣  `︲**Fork base :** [codewithsadee/vcard-personal-portfolio](https://github.com/codewithsadee/vcard-personal-portfolio)

---

## `  ⚫  `︲Présentation Générale & Objectifs

Template de portfolio personnel pour étudiant BTS SIO option SISR (Solutions d'Infrastructure, Systèmes et Réseaux), développé entièrement sans framework. Le projet sert trois objectifs distincts :

- **Vitrine professionnelle** : parcours, compétences, stages, certifications et productions techniques accessibles en un point unique.
- **Démonstration technique** : architecture SPA pilotée par données, rendu DOM lazy, système de thème dual-mode — le code est la preuve de compétence.
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
```

`index.html` est un shell vide. Aucun contenu statique — tous les nœuds DOM (navbar, sidebar, sections) sont injectés au `DOMContentLoaded` depuis `data.js`.

### Responsabilités des modules

| Fichier | Pattern | Responsabilité |
|---|---|---|
| `data.js` | **Model** | Source de vérité unique : profil, parcours, outils, certifications, portfolio, veille, stage |
| `main.js` | **Controller** | Rendu DOM, routage SPA, lazy rendering, filtres portfolio, sidebar toggle, thème dual-mode |

### Patron architectural : Lazy Rendering

Les sections ne sont pas rendues au chargement. `SECTION_RENDERERS` est une `Map` id → fonction. `RENDERED` est un `Set`. Au premier clic sur une nav, `renderSection(id)` vérifie le Set en O(1) avant d'injecter.

```js
// Guard O(1) — aucune re-exécution, aucune double injection
function renderSection(id) {
  if (RENDERED.has(id)) return;
  RENDERED.add(id);
  SECTION_RENDERERS[id]?.();
}
```

Résultat : seul `about` est rendu au load. Le reste est différé jusqu'au besoin.

### Infrastructure CSS

- **Custom Properties** : palette dual-mode (`--bg-body`, `--text-primary`, `--brand`, `--shadow-*`) — toutes les valeurs sémantiques sont des tokens, zéro valeur hardcodée dans les règles.
- **Dark Mode** : sélecteur `body.dark-mode` unique, swap de surface et d'ombres exclusivement. Zéro duplication de règles structurelles.
- **Animations** : `@keyframes fade` (opacity + translateY) et `scaleUp` (transform + opacity) — exclusivement GPU-safe. Zéro `reflow`.
- **Typographie fluide** : `clamp(min, vw, max)` sur les titres — responsive sans media query dédiée.
- **Responsive** : Mobile-first, breakpoints consolidés à `480px / 580px / 720px / 1024px / 1250px` dans un bloc unique en fin de fichier.
- **Sidebar sticky** : `position: sticky; top: 60px` en wide (≥1250px) — zéro JavaScript impliqué.

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
                              └── URL : https://votre-pseudo.netlify.app
```

**Protocole de déploiement actuel** : manuel via drag & drop Netlify après validation locale. Zéro CI/CD automatisé — déploiement déclenché intentionnellement.

---

## `  ⚪  `︲Fonctionnalités Phares

### Routage SPA sans framework

Navigation entre 8 sections (`À propos`, `Parcours`, `Stage`, `Certifications`, `Veille`, `Outils`, `Matériel`, `Portfolio`) sans rechargement de page. Historique non géré (pas de `history.pushState`) — choix délibéré pour un portfolio statique sans backend.

### Système de thème dual-mode

Persistance via `localStorage`. Basculement de la classe `dark-mode` sur `<body>` via un script inline dans `index.html`. Transition CSS sur `background-color` et `color` à `0.35s ease` — zéro flash au rechargement.

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

Aucun `getBoundingClientRect`, aucun `reflow` JS. Délégation d'événement unique sur le container parent — O(1) peu importe le nombre de cartes.

### Filtres Portfolio

Filtrage par catégorie (`Windows`, `Linux`, `Réseau`…) via `data-filter` attributes. Animation `scaleUp` à l'apparition des items — `transform + opacity` uniquement.

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
git clone https://github.com/votre-pseudo/portfolio-template-sisr.git
cd portfolio-template-sisr
```

### 2. Lancer en local

```bash
# Option A — Node.js disponible
npx serve .
# → http://localhost:3000

# Option B — Python disponible
python -m http.server 8080
# → http://localhost:8080

# Option C — Extension VS Code
# Installer "Live Server" → clic droit sur index.html → "Open with Live Server"
```

### 3. Personnaliser le contenu

Tout le contenu est centralisé dans **`assets/js/data.js`**. Aucune modification de `main.js` ou du HTML n'est nécessaire pour adapter le portfolio.

```text
data.js
├── profileData        → Nom, rôle, avatar, email, liens sociaux
├── aboutData          → Texte de présentation (HTML inline autorisé)
├── resumeData         → Formation, expériences, barres de compétences
├── stageData          → Cartes de stage avec missions
├── outilsData         → Catégories d'outils avec descriptions et liens
├── certificationsData → Certifications obtenues / en cours
├── materielData       → Setup hardware par catégorie
├── veilleData         → Sources de veille informatique par thème
└── portfolioData      → Projets avec image, catégorie et lien
```

### 4. Remplacer les assets

```text
assets/
└── images/
    ├── avatar.webp     ← Photo de profil (WebP, 150×150px minimum)
    └── favicon.ico     ← Icône de l'onglet navigateur (.ico - 32×32px)
```

Format recommandé pour l'avatar : `.webp`, 150×150px minimum, fond transparent ou uni.

### 5. Déployer sur Netlify

**Méthode manuelle (drag & drop)**

1. Se connecter sur [app.netlify.com](https://app.netlify.com)
2. Aller dans "Sites" → "Add new site" → "Deploy manually"
3. Glisser-déposer le dossier racine du projet
4. URL générée automatiquement — personnalisable dans les paramètres du site

---

## `  ⚫  `︲Stack & Outils

```
Frontend    : HTML5 · CSS3 Custom Properties · JS ES6+ Modules (import/export natif)
Animations  : CSS @keyframes (transform + opacity — GPU-safe uniquement)
Icons       : Ionicons 5.5.2 (ESM, chargé via unpkg CDN)
Fonts       : Google Fonts — Poppins (300/400/500/600)
Hosting     : Netlify (Manual Deploy — HTTPS — CDN Edge)
Versioning  : GitHub
```

---
