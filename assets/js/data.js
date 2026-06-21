/*═══════════════════════════════════════════════════════════════════
  DATA.JS — Panneau de contrôle du portfolio
  ─────────────────────────────────────────────────────────────────
  RÔLE UNIQUE DE CE FICHIER :
  C'est ici et UNIQUEMENT ici que vous modifiez le contenu
  de votre portfolio. Aucune modification de main.js ou de
  index.html n'est nécessaire pour personnaliser le site.

  ─────────────────────────────────────────────────────────────────
  GUIDE DE LECTURE — TYPES DE VALEURS
  ─────────────────────────────────────────────────────────────────
  Chaîne de caractères  → "texte entre guillemets"
  Nombre                → 80  (sans guillemets)
  Booléen               → true ou false  (sans guillemets)
  Tableau               → [ élément1, élément2 ]  (crochets)
  Objet                 → { clé: valeur }  (accolades)
  Vide / Non renseigné  → ""  (deux guillemets collés)

  ─────────────────────────────────────────────────────────────────
  COMMENT AJOUTER UN ÉLÉMENT (ex: une expérience, un projet)
  ─────────────────────────────────────────────────────────────────
  1. Repérez le tableau concerné (ex: resumeData.experience)
  2. Copiez un bloc existant (de { jusqu'au } correspondant)
  3. Collez-le à la suite, séparé par une virgule
  4. Modifiez les valeurs du nouveau bloc

  Exemple — Ajouter une expérience :

  experience: [
    {                               ← bloc existant
      title: "Stage Entreprise A",
      date:  "2024",
      desc:  "Description A."
    },                              ← virgule OBLIGATOIRE entre deux blocs
    {                               ← nouveau bloc copié-collé
      title: "Stage Entreprise B",
      date:  "2025",
      desc:  "Description B."
    }
                                    ← pas de virgule après le DERNIER bloc
  ]

  ─────────────────────────────────────────────────────────────────
  FLUX DE LA DONNÉE (pour comprendre comment ça fonctionne)
  ─────────────────────────────────────────────────────────────────
  data.js  ──export──▶  main.js  ──innerHTML──▶  DOM (page visible)

  Vous modifiez data.js → main.js lit les nouvelles valeurs
  au prochain chargement → la page affiche le contenu mis à jour.
  Aucune autre étape.
═══════════════════════════════════════════════════════════════════*/


/*───────────────────────────────────────────────────────────────────
  PROFIL — Informations personnelles (sidebar)
  ─────────────────────────────────────────────────────────────────
  Ces données peuplent la carte de profil visible sur toutes
  les pages (sidebar gauche sur desktop, accordéon sur mobile).

  Injecté par : main.js → renderProfile()
───────────────────────────────────────────────────────────────────*/
export const profileData = {

  /*
    Votre nom complet tel qu'il apparaîtra sous l'avatar.
    Type    : Chaîne de caractères
    Exemple : "Marie Dupont"
  */
  name: "Prénom Nom",

  /*
    Votre rôle ou titre affiché sous votre nom.
    Type    : Chaîne de caractères
    Exemple : "Étudiant BTS SIO SISR" ou "Technicien Réseaux"
  */
  role: "Étudiant BTS SIO SISR",

  /*
    Chemin vers votre photo de profil.
    Type    : Chaîne de caractères (chemin relatif ou URL)
    Format  : WebP recommandé, 150×150px minimum, fond uni ou transparent.
    Action  : Remplacez le fichier assets/images/avatar.webp par le vôtre
              en conservant le même nom, OU modifiez ce chemin.
  */
  avatar: "./assets/images/avatar.webp",

  /*
    Adresse email de contact (lien cliquable dans la sidebar).
    Type    : Chaîne de caractères
    Exemple : "marie.dupont@email.com"
  */
  email: "votre.email@exemple.com",

  /*
    Liens vers vos profils sur les réseaux professionnels.
    Type  : Tableau d'objets — chaque objet = un réseau social.

    Chaque objet contient :
      icon → nom de l'icône Ionicons 5 à afficher
              Catalogue complet : https://ionicons.com/v5/
              Exemples : "logo-github", "logo-linkedin", "globe-outline"
      link → URL complète vers votre profil (avec https://)

    Pour AJOUTER un réseau : copiez un bloc { } et collez-le
    après une virgule.
    Pour SUPPRIMER un réseau : supprimez le bloc { } entier
    (et la virgule qui le précède).
  */
  socials: [
    {
      icon: "logo-github",
      link: "https://github.com/votre-pseudo"
    },
    {
      icon: "logo-linkedin",
      link: "https://linkedin.com/in/votre-profil"
    },
    {
      /*
        globe-outline : icône générique pour un lien de type
        LinkTree, site personnel, ou tout autre lien unique.
      */
      icon: "globe-outline",
      link: "https://linktr.ee/votre-profil"
    }
  ]
};


/*───────────────────────────────────────────────────────────────────
  À PROPOS — Texte de présentation
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "À propos de moi" (page d'accueil).

  Injecté par : main.js → renderAbout()
───────────────────────────────────────────────────────────────────*/
export const aboutData = {

  /*
    Votre texte de présentation. Le HTML est autorisé ici :
    vous pouvez utiliser <p>, <strong>, <br>…
    Type    : Chaîne de caractères (HTML inline accepté)

    Conseil : 2 à 4 paragraphes <p>. Décrivez qui vous êtes,
    votre formation, vos centres d'intérêt techniques et
    ce que ce portfolio démontre.
  */
  text: `
    <p>
      Décrivez ici votre parcours, votre formation et votre
      spécialité en quelques phrases. Soyez concret et direct.
    </p>
    <p>
      Ajoutez un second paragraphe sur vos centres d'intérêt
      techniques, vos projets personnels ou votre vision
      professionnelle.
    </p>
  `
};


/*───────────────────────────────────────────────────────────────────
  PARCOURS — Formation, Expériences et Compétences
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "Parcours" (timeline + barres de compétences).

  Injecté par : main.js → renderResume()
───────────────────────────────────────────────────────────────────*/
export const resumeData = {

  /*
    Liste de vos formations (ordre chronologique inverse conseillé :
    la plus récente en premier).
    Type  : Tableau d'objets

    Chaque objet contient :
      school → Nom du diplôme et de l'établissement
      date   → Période (ex: "2023 — 2025")
      desc   → Description courte de la formation
  */
  education: [
    {
      school: "BTS SIO option SISR — Lycée [Nom de l'établissement]",
      date:   "2023 — 2025",
      desc:   "Formation aux systèmes d'information et réseaux : administration, sécurité, infrastructure."
    },
    {
      school: "Baccalauréat [Série] — Lycée [Nom de l'établissement]",
      date:   "2020 — 2023",
      desc:   "Description courte de votre bac et de votre spécialité."
    }
  ],

  /*
    Liste de vos expériences professionnelles (stages, alternance…).
    Type  : Tableau d'objets

    Chaque objet contient :
      title → Intitulé du poste ou type de stage
      date  → Année ou période
      desc  → Description courte des missions principales
  */
  experience: [
    {
      title: "Stage Technicien Informatique — [Nom de l'entreprise]",
      date:  "2025",
      desc:  "Décrivez vos missions principales en une ou deux phrases."
    },
    {
      title: "Stage Maintenance Informatique — [Nom de l'entreprise]",
      date:  "2023",
      desc:  "Décrivez vos missions principales en une ou deux phrases."
    }
  ],

  /*
    Barres de compétences techniques affichées en bas de la section.
    Type  : Tableau d'objets

    Chaque objet contient :
      name    → Intitulé de la compétence (Chaîne de caractères)
      percent → Niveau entre 0 et 100 (Nombre entier)
                Contrôle la largeur de la barre de progression.
                Soyez honnête — un recruteur peut vous poser
                des questions sur ces niveaux.

    Conseil : 4 à 6 compétences max pour garder la lisibilité.
  */
  skills: [
    { name: "Administration Systèmes & Réseaux", percent: 70 },
    { name: "Hardware & Dépannage",              percent: 85 },
    { name: "Documentation Technique",           percent: 75 },
    { name: "Gestion d'Infrastructure",          percent: 55 }
  ]
};


/*───────────────────────────────────────────────────────────────────
  STAGE — Cartes d'expérience détaillées
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "Stage" : cartes avec missions détaillées.
  Plus complètes que les expériences du Parcours — elles affichent
  l'ensemble des missions réalisées sous forme de liste.

  Injecté par : main.js → renderStage()
───────────────────────────────────────────────────────────────────*/
export const stageData = [

  /*
    Chaque objet = une carte de stage.

    Propriétés :
      company  → Nom de l'entreprise (Chaîne de caractères)
      date     → Année ou période (Chaîne de caractères)
      role     → Intitulé de votre poste (Chaîne de caractères)
      missions → Liste de vos missions (Tableau de chaînes)
                 Chaque chaîne = une puce dans la carte.
                 Soyez précis et utilisez des verbes d'action.
      image    → Objet optionnel pour afficher un logo d'entreprise.
                 Laissez src à "" si vous n'avez pas d'image.
                   src    : chemin vers l'image (Chaîne)
                   alt    : description de l'image (Chaîne)
                   width  : largeur en pixels (Nombre)
                   height : hauteur en pixels (Nombre)
  */
  {
    company: "Nom de l'entreprise 1",
    date:    "2025",
    role:    "Technicien informatique",
    image: {
      src:    "",
      alt:    "Logo de l'entreprise 1",
      width:  240,
      height: 240
    },
    missions: [
      "Mission 1 — décrivez une action concrète réalisée",
      "Mission 2 — décrivez une action concrète réalisée",
      "Mission 3 — décrivez une action concrète réalisée",
      "Mission 4 — décrivez une action concrète réalisée"
    ]
  },

  {
    company: "Nom de l'entreprise 2",
    date:    "2023",
    role:    "Technicien maintenance",
    /*
      Pas d'image pour cette carte : supprimez l'objet image
      entièrement OU laissez src à "" — les deux fonctionnent.
    */
    image: {
      src:    "",
      alt:    "",
      width:  240,
      height: 240
    },
    missions: [
      "Mission 1 — décrivez une action concrète réalisée",
      "Mission 2 — décrivez une action concrète réalisée",
      "Mission 3 — décrivez une action concrète réalisée"
    ]
  }

];


/*───────────────────────────────────────────────────────────────────
  OUTILS — Logiciels et services utilisés
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "Outils" : grille bento par catégorie.
  Chaque carte dispose d'un accordéon +/− pour révéler une image
  (capture d'écran, logo…) si vous en renseignez une.

  Injecté par : main.js → renderOutils() → renderBento()

  ─────────────────────────────────────────────────────────────────
  STRUCTURE D'UNE CATÉGORIE :
  {
    title : "Nom de la catégorie"  ← affiché en titre de section
    icon  : "nom-ionicon"         ← icône à gauche du titre
    items : [ ... ]               ← tableau des outils de la catégorie
  }

  STRUCTURE D'UN ITEM (outil) :
  {
    name        : "Nom de l'outil"
    description : "Description courte"
    link        : "https://..."   ← "" si pas de lien
    image       : {               ← optionnel : révélé dans l'accordéon
      src    : "./assets/images/captures/mon-outil.webp"
      alt    : "Capture de Mon Outil"
      width  : 800   ← largeur recommandée pour les captures
      height : 450   ← ratio 16/9 conseillé pour les captures
    }
  }

  Si vous ne souhaitez pas d'image dans l'accordéon d'un outil :
  → Laissez image.src à "" : un placeholder visuel s'affiche.
  → Ou supprimez l'objet image entièrement.
───────────────────────────────────────────────────────────────────*/
export const outilsData = [

  {
    title: "Intelligence Artificielle",
    icon:  "sparkles-outline",
    items: [
      {
        name:        "Nom de l'IA (ex: Claude)",
        description: "Décrivez en une phrase comment vous utilisez cet outil au quotidien.",
        link:        "https://claude.ai",
        image: {
          src:    "",
          alt:    "Capture de Claude",
          width:  800,
          height: 450
        }
      },
      {
        name:        "Nom de l'IA 2",
        description: "Décrivez en une phrase comment vous utilisez cet outil au quotidien.",
        link:        "",
        image: {
          src:    "",
          alt:    "",
          width:  800,
          height: 450
        }
      }
    ]
  },

  {
    title: "Développement & Outils",
    icon:  "code-slash-outline",
    items: [
      {
        name:        "Nom de l'outil (ex: VSCodium)",
        description: "Décrivez en une phrase comment vous utilisez cet outil.",
        link:        "https://vscodium.com",
        image: {
          src:    "",
          alt:    "Capture de VSCodium",
          width:  800,
          height: 450
        }
      },
      {
        name:        "Nom de l'outil 2",
        description: "Décrivez en une phrase comment vous utilisez cet outil.",
        link:        "",
        image: {
          src:    "",
          alt:    "",
          width:  800,
          height: 450
        }
      }
    ]
  },

  {
    title: "Documentation & Organisation",
    icon:  "document-text-outline",
    items: [
      {
        name:        "Nom de l'outil (ex: Notion)",
        description: "Décrivez en une phrase comment vous utilisez cet outil.",
        link:        "https://notion.so",
        image: {
          src:    "",
          alt:    "",
          width:  800,
          height: 450
        }
      }
    ]
  }

];


/*───────────────────────────────────────────────────────────────────
  CERTIFICATIONS — Obtenues et en cours
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "Certifications" : grille bento avec
  accordéon +/− pour afficher l'image du certificat.

  Injecté par : main.js → renderCertifications() → renderBento()

  STRUCTURE D'UN ITEM :
    name        → Intitulé de la certification
    issuer      → Organisme émetteur (ex: "Cisco", "Microsoft")
    date        → Année d'obtention ou de préparation
    description → Courte description ou statut
    link        → Lien vers la page officielle de la certification
    image       → Objet pour afficher le certificat dans l'accordéon
                    src : chemin vers l'image du certificat
                    Format recommandé : WebP, 800×566px (ratio A4 paysage)
───────────────────────────────────────────────────────────────────*/
export const certificationsData = [

  {
    title: "Certifications obtenues",
    icon:  "ribbon-outline",
    items: [
      {
        name:        "Nom de la certification obtenue",
        issuer:      "Organisme émetteur",
        date:        "2025",
        description: "Description courte de ce que certifie ce badge.",
        link:        "",
        image: {
          src:    "",
          alt:    "Certificat [Nom de la certification]",
          width:  800,
          height: 566
        }
      }
    ]
  },

  {
    title: "En cours de préparation",
    icon:  "time-outline",
    items: [
      {
        name:        "Nom de la certification en cours",
        issuer:      "Organisme émetteur",
        date:        "2025",
        description: "En cours de préparation — examen prévu en [mois/année].",
        link:        "",
        image: {
          /*
            Laissez src à "" tant que vous n'avez pas le certificat.
            L'accordéon affichera un placeholder visuel à la place.
          */
          src:    "",
          alt:    "",
          width:  800,
          height: 566
        }
      }
    ]
  }

];


/*───────────────────────────────────────────────────────────────────
  MATÉRIEL — Configuration hardware
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "Matériel" : grille bento sans accordéon
  (cartes standard, plus légères que les sections précédentes).

  Injecté par : main.js → renderMateriel() → renderBento()

  STRUCTURE D'UN ITEM :
    name        → Nom du composant ou périphérique
    description → Précision courte (usage, modèle exact, specs…)
    link        → Lien produit (fiche technique, boutique…) ou ""
───────────────────────────────────────────────────────────────────*/
export const materielData = [

  {
    title: "Poste de travail",
    icon:  "desktop-outline",
    items: [
      {
        name:        "Processeur (ex: Intel Core i5-12400)",
        description: "Précisez le modèle exact et son usage.",
        link:        ""
      },
      {
        name:        "RAM (ex: 16 Go DDR4 3200 MHz)",
        description: "Précisez la capacité et la fréquence.",
        link:        ""
      },
      {
        name:        "Stockage (ex: SSD NVMe 512 Go)",
        description: "Précisez le type et la capacité.",
        link:        ""
      }
    ]
  },

  {
    title: "Périphériques & Affichage",
    icon:  "hardware-chip-outline",
    items: [
      {
        name:        "Écran (ex: 24 pouces 1080p 75 Hz)",
        description: "Précisez la résolution et la taille.",
        link:        ""
      },
      {
        name:        "Clavier (ex: Clavier mécanique)",
        description: "Précisez le modèle ou le type de switches.",
        link:        ""
      },
      {
        name:        "Souris",
        description: "Précisez le modèle.",
        link:        ""
      }
    ]
  },

  {
    title: "Réseau",
    icon:  "wifi-outline",
    items: [
      {
        name:        "Box / Routeur",
        description: "Précisez le modèle et le type de connexion.",
        link:        ""
      }
    ]
  }

];


/*───────────────────────────────────────────────────────────────────
  PORTFOLIO — Projets réalisés
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "Portfolio" : grille de projets filtrables.
  Les boutons de filtre sont générés AUTOMATIQUEMENT depuis les
  valeurs de "category" trouvées dans ce tableau.
  Pas besoin de les déclarer ailleurs.

  Injecté par : main.js → renderPortfolio()

  STRUCTURE D'UN PROJET :
    title    → Titre du projet affiché sous l'image
    category → Catégorie pour le filtre (Chaîne EXACTE, casse comprise)
               Exemple : "Windows", "Linux", "Réseau", "Web"
               Utilisez la même valeur pour regrouper des projets.
    image    → Chemin vers l'image de prévisualisation du projet
               Format recommandé : WebP, 600×400px (ratio 3:2)
               Stockez vos images dans assets/images/projets/
    link     → URL vers le projet (GitHub, PDF, site…)

  ASTUCE FILTRES :
  Si vous avez 3 projets avec category: "Linux" et 2 avec "Windows",
  les boutons "Linux" et "Windows" apparaîtront automatiquement.
  Nommez vos catégories de façon cohérente — "linux" et "Linux"
  créeraient deux boutons distincts (la casse est significative).
───────────────────────────────────────────────────────────────────*/
export const portfolioData = [

  /*
    Projet Windows / Active Directory
    Dupliquez ce bloc pour ajouter un projet de la même catégorie.
  */
  {
    title:    "Titre du projet Windows (ex: Déploiement Active Directory)",
    category: "Windows",
    image:    "./assets/images/logo_GitHub.webp",
    link:     "https://github.com/votre-pseudo/nom-du-projet"
  },

  /*
    Projet Linux
  */
  {
    title:    "Titre du projet Linux (ex: Configuration serveur Debian)",
    category: "Linux",
    image:    "./assets/images/logo_GitHub.webp",
    link:     "https://github.com/votre-pseudo/nom-du-projet"
  },

  /*
    Autre projet (réseau, sécurité, web…)
    Changez "Autre" par la catégorie qui vous convient.
  */
  {
    title:    "Titre du projet (ex: Analyse Wireshark)",
    category: "Réseau",
    image:    "./assets/images/logo_GitHub.webp",
    link:     "https://github.com/votre-pseudo/nom-du-projet"
  }

];


/*───────────────────────────────────────────────────────────────────
  VEILLE INFORMATIQUE — Sources et actualités
  ─────────────────────────────────────────────────────────────────
  Contenu de la section "Veille" : liste de sources organisées
  par thèmes (une catégorie = un thème de veille).

  Injecté par : main.js → renderVeille()

  STRUCTURE D'UN ITEM :
    name        → Nom de la source (site, chaîne, compte…)
    description → Ce que vous y trouvez / pourquoi vous la suivez
    link        → URL directe vers la source ou ""
───────────────────────────────────────────────────────────────────*/
export const veilleData = [

  {
    title: "Sécurité & Cybersécurité",
    icon:  "shield-outline",
    items: [
      {
        name:        "Nom de la source (ex: ANSSI)",
        description: "Décrivez en une phrase pourquoi vous suivez cette source.",
        link:        "https://www.ssi.gouv.fr"
      },
      {
        name:        "Nom de la source 2",
        description: "Décrivez en une phrase pourquoi vous suivez cette source.",
        link:        ""
      }
    ]
  },

  {
    title: "Systèmes & Réseaux",
    icon:  "server-outline",
    items: [
      {
        name:        "Nom de la source",
        description: "Décrivez en une phrase pourquoi vous suivez cette source.",
        link:        ""
      }
    ]
  },

  {
    title: "Chaînes YouTube",
    icon:  "logo-youtube",
    items: [
      {
        name:        "Nom de la chaîne",
        description: "Décrivez les sujets traités par cette chaîne.",
        link:        "https://youtube.com/@nom-de-la-chaine"
      }
    ]
  },

  {
    title: "Open Source & Outils",
    icon:  "code-slash-outline",
    items: [
      {
        name:        "Nom du projet ou dépôt",
        description: "Décrivez pourquoi vous suivez ce projet.",
        link:        "https://github.com/organisation/projet"
      }
    ]
  }

];