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
```

`index.html` est un shell vide. Aucun contenu statique  tous les nœuds DOM (navbar, sidebar, sections) sont injectés au `DOMContentLoaded` depuis `data.js`.

### Responsabilités des modules

| Fichier | Pattern | Responsabilité |
|---|---|---|
| `data.js` | **Model** | Source de vérité unique : profil, parcours, outils, certifications, portfolio, veille, stage |
| `main.js` | **Controller** | Rendu DOM, routage SPA, lazy rendering, filtres portfolio, sidebar toggle, thème dual-mode |

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
├── Prévisualisation : extension Live Server (méthode recommandée)
│     ⚠ Note : les modules ES6 (import/export) nécessitent un serveur HTTP local
│               pour contourner la restriction CORS sur file://
│               → utiliser : Live Server (VSCodium) ou npx serve .
│
└── Git Push ──► GitHub (dépôt source, versioning)
                    │
                    └──► Netlify (déploiement manuel par drag & drop ou CLI)
                              │
                              ├── CDN global (Edge Nodes distribués)
                              ├── HTTPS automatique (Let's Encrypt)
                              └── URL : https://votre-pseudo.netlify.app
```

**Protocole de déploiement actuel** : manuel via drag & drop Netlify après validation locale. Zéro CI/CD automatisé  déploiement déclenché intentionnellement.

---

## `  ⚪  `︲Fonctionnalités Phares

### Routage SPA sans framework

Navigation entre 8 sections (`À propos`, `Parcours`, `Stage`, `Certifications`, `Veille`, `Outils`, `Matériel`, `Portfolio`) sans rechargement de page. Historique non géré (pas de `history.pushState`)  choix délibéré pour un portfolio statique sans backend.

### Système de thème dual-mode

Persistance via `localStorage`. Basculement de la classe `dark-mode` sur `<body>` via un script inline dans `index.html`. Transition CSS sur `background-color` et `color` à `0.35s ease`  zéro flash au rechargement.

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

Filtrage par catégorie (`Windows`, `Linux`, `Réseau`…) via `data-filter` attributes. Animation `scaleUp` à l'apparition des items  `transform + opacity` uniquement.

---

## `  ⚫  `︲Guide de Déploiement et Configuration

### Prérequis

| Outil | Rôle | Requis |
|---|---|---|
| Navigateur moderne | Prévisualisation locale | Oui |
| Git | Versioning et push GitHub | Oui |
| Node.js (optionnel) | Serveur local HTTP alternatif pour modules ES6 | Optionnel |
| Compte GitHub | Hébergement du code source | Oui |
| Compte Netlify (gratuit) | Déploiement CDN HTTPS | Oui |

> **Note SISR** : Git n'est pas obligatoire pour démarrer. Le code source est directement téléchargeable depuis la page **Releases** du projet (voir section suivante). Git devient nécessaire uniquement si vous souhaitez versionner vos modifications et publier via GitHub.

### 1. Récupérer le code source

**Méthode A  Téléchargement direct depuis les Releases (recommandée, sans Git)**

Aucun terminal requis. Rendez-vous sur la page **Releases** du dépôt GitHub, téléchargez l'archive au format de votre choix, puis extrayez-la dans le dossier de votre choix :

| Format | Commande d'extraction (optionnelle) |
|---|---|
| `.zip` | Extraction native Windows / macOS / Linux |
| `.tar.gz` | `tar -xzf portfolio-template-sisr.tar.gz` |
| `.7z` | 7-Zip (Windows) ou `7z x portfolio-template-sisr.7z` |

**Méthode B  Clone Git**

```bash
git clone https://github.com/votre-pseudo/portfolio-template-sisr.git
cd portfolio-template-sisr
```

### 2. Visualiser en local

> **Méthode la plus simple : extension Live Server sur VSCodium.**
> Ouvrir le dossier du projet dans VSCodium → clic droit sur `index.html` → **"Open with Live Server"**. Le navigateur s'ouvre automatiquement et se rafraîchit à chaque sauvegarde de fichier. Aucune commande terminal, aucune configuration supplémentaire.

> **Pourquoi Live Server est obligatoire** : les modules ES6 natifs (`import/export`) sont bloqués par la politique CORS des navigateurs lorsque les fichiers sont ouverts en `file://`. Un serveur HTTP local contourne cette restriction. Live Server en est un.

```bash
# Alternative A  Node.js disponible
npx serve .
# → http://localhost:3000

# Alternative B  Python disponible
python -m http.server 8080
# → http://localhost:8080
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
    └── favicon.ico     ← Icône de l'onglet navigateur (.ico 32x32px)
```

Format recommandé pour l'avatar : `.webp`, 150×150px minimum, fond transparent ou uni.

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

## `  ⚪  `︲Workflow OpenCode  Modifications sans terminal

> OpenCode est un agent de développement IA qui opère directement sur les fichiers du projet. Il permet de modifier, d'étendre et de déboguer le portfolio en langage naturel, sans manipuler le code manuellement.

### Setup minimal

**1. Télécharger OpenCode**

Se rendre sur le site officiel d'OpenCode et télécharger l'installeur graphique correspondant au système d'exploitation (Windows, macOS ou Linux).

**2. Installer et ouvrir le projet**

Lancer l'exécutable téléchargé et suivre les étapes d'installation. Une fois l'application ouverte, pointer vers le dossier du projet extrait depuis l'archive téléchargée dans les **Releases** (`.zip`, `.7z` ou `.tar.gz`). Aucune commande terminal, aucun clone Git requis.

OpenCode indexe automatiquement les fichiers du dossier ouvert. Aucune configuration supplémentaire n'est requise pour ce projet.

### Exemples de requêtes

```text
# Ajouter un projet au portfolio
"Ajoute un projet dans portfolioData avec le titre 'Mise en place VLAN',
 la catégorie 'Réseau', l'image assets/images/projets/vlan.webp
 et le lien https://github.com/votre-pseudo/vlan-project"

# Modifier le profil
"Remplace le nom dans profileData par 'Jean Dupont' et l'email
 par jean.dupont@exemple.com"

# Ajouter une certification
"Ajoute une certification obtenue dans certificationsData :
 nom 'Cisco CCNA', émetteur 'Cisco', date '2025',
 description 'Certification réseau niveau associé'"

# Ajouter une section de veille
"Ajoute une nouvelle catégorie dans veilleData avec le titre
 'Virtualisation', l'icône 'cube-outline', et un premier item
 nommé 'Proxmox VE' pointant vers https://www.proxmox.com"
```

### Règles à transmettre à OpenCode pour ce projet

Coller ces contraintes en début de session pour aligner OpenCode avec l'architecture du projet :

```text
Règles du projet :
- Toute donnée va exclusivement dans assets/js/data.js. Ne jamais hardcoder
  de contenu dans main.js ou index.html.
- Ne jamais utiliser de valeurs CSS en dur pour les couleurs, espacements
  ou rayons. Utiliser uniquement les variables --* définies dans :root.
- Toute animation doit n'affecter que transform et/ou opacity.
- Tout accès DOM doit être gardé par optional chaining (?.) ou un guard if.
```

---

## `  ⚪  `︲Workflow Claude  Modifications et nouvelles fonctionnalités

> Claude peut être utilisé directement depuis [claude.ai](https://claude.ai) pour modifier le portfolio, intégrer de nouveaux projets ou implémenter de nouvelles fonctionnalités. La fonctionnalité **Projets** permet de connecter le dépôt GitHub directement à Claude, lui fournissant automatiquement tout le contexte technique nécessaire.

### Méthode : Claude Projects + connexion GitHub

**1. Créer un Projet dans Claude**

Sur [claude.ai](https://claude.ai), aller dans "Projets" → "Nouveau projet". Nommer le projet (ex : `Portfolio-Dev`).

**2. Connecter le dépôt GitHub**

Dans le panneau latéral du projet, ouvrir la section **Project Knowledge** → cliquer sur "+" → sélectionner **GitHub**. Authentifier le compte GitHub via le flux OAuth si ce n'est pas déjà fait, puis rechercher et connecter le dépôt du portfolio.

Cette connexion donne à Claude les droits de **lecture** sur l'ensemble des fichiers du projet  `data.js`, `main.js`, `style.css`, `index.html`. Claude dispose ainsi automatiquement de tout le contexte architectural nécessaire pour répondre avec précision, sans qu'il soit nécessaire de coller le contenu des fichiers dans chaque message.

> **Limitation technique  lecture seule** : Claude ne peut pas écrire directement dans les fichiers ni pousser (`push`) de modifications sur le dépôt. Les suggestions de code retournées par Claude doivent être copiées manuellement et appliquées dans l'éditeur (VSCodium), puis sauvegardées  Live Server rafraîchit automatiquement.

### Cas d'usage typiques

| Objectif | Instruction type |
|---|---|
| Ajouter un projet portfolio | "Ajoute un projet dans portfolioData : titre 'Mise en place VLAN', catégorie 'Réseau', image assets/images/projets/vlan.webp, lien https://github.com/votre-pseudo/vlan" |
| Ajouter une certification | "Ajoute une certification obtenue dans certificationsData : nom 'Cisco CCNA', émetteur 'Cisco', date '2025'" |
| Modifier le texte À propos | "Réécris aboutData.text avec ces informations : …" |
| Ajouter une compétence | "Ajoute la compétence 'Virtualisation' à 65% dans resumeData.skills" |
| Implémenter une nouvelle fonctionnalité | Décrire le comportement attendu  Claude lit les fichiers concernés via la connexion GitHub et retourne le delta à appliquer |

### Règles à transmettre à Claude pour ce projet

Coller ce bloc en début de conversation pour aligner Claude avec l'architecture du projet :

```text
Règles du projet :
- Toute donnée va exclusivement dans assets/js/data.js. Ne jamais hardcoder
  de contenu dans main.js ou index.html.
- Ne jamais utiliser de valeurs CSS en dur pour les couleurs, espacements
  ou rayons. Utiliser uniquement les variables --* définies dans :root.
- Toute animation doit n'affecter que transform et/ou opacity (GPU-safe).
- Tout accès DOM doit être gardé par optional chaining (?.) ou un guard if.
- Tout nouveau listener sur un NodeList doit utiliser la délégation
  d'événement sur le parent, pas une boucle d'attachement.
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
```
---
