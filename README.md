# 🖥️ Portfolio BTS SIO — Option SISR

Template de portfolio moderne, léger et **open-source** destiné aux étudiants en
**BTS Services Informatiques aux Organisations**, spécialité **Solutions
d'Infrastructure, Systèmes et Réseaux (SISR)**.

> **Version** : 1.0.0 &nbsp;|&nbsp; **Licence** : MIT

---

## ⚡ Démarrage rapide

### Lancer en local

> ⚠️ **Attention** — Ce projet utilise des modules ES6 et charge des fichiers
> JSON (ou JS) via `fetch`. Si vous double-cliquez simplement sur `index.html`
> (protocole `file://`), vous obtiendrez une **page blanche** à cause des règles
> CORS des navigateurs. Vous **devez** obligatoirement servir le projet via un
> serveur HTTP local.

```bash
# Avec Python 3
python3 -m http.server 8080

# Avec Node (npx)
npx serve .
```

Ouvrez ensuite [http://localhost:8080](http://localhost:8080) dans votre
navigateur.

## 🧱 Architecture

```
.
├── index.html              # Point d'entrée
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css       # Feuille de styles unique
│   ├── img/
│   │   └── avatar.webp     # Photo de profil (format unique)
│   └── js/
│       ├── data.js         # Données du portfolio
│       └── main.js         # Logique applicative centralisée
└── .gitignore
```

### Responsabilités des modules

| Fichier | Responsabilité |
|---|---|
| `index.html` | Structure sémantique et points d'ancrage (conteneurs) |
| `assets/css/style.css` | Mise en forme, design system, responsive |
| `assets/js/data.js` | Définition des données (profil, stages, compétences) dans l'objet global `portfolioData` |
| `assets/js/main.js` | **Unique point d'entrée JavaScript**. Centralise et consolide l'intégralité de la logique applicative : rendu du profil, timeline des stages et gestion des assets. |

## 🎨 Personnalisation

### Remplacer les assets

- **Photo de profil** : remplacez `assets/img/avatar.webp` par votre image
(format WebP recommandé, ratio 1:1). Un seul fichier est nécessaire : `main.js`
lit le chemin défini dans `data.js` et applique un fallback automatique.
- **Favicon** : éditez le `<link rel="icon">` directement dans `index.html`.

### Modifier les données

Éditez le fichier `assets/js/data.js`. Toutes les sections (profil, stages,
compétences) sont pilotées par l'objet `portfolioData`.

## 📄 Licence

Ce projet est distribué sous licence MIT. Vous êtes libre de l'utiliser, de le
modifier et de le distribuer, y compris pour un usage commercial.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Merci de lire le guide dédié avant
de soumettre une pull request :

👉 **[CONTRIBUTING.md](https://./CONTRIBUTING.md)**

