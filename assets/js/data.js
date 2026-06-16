/*-----------------------------------*\
  #DATA.JS - Contenu du Portfolio
\*-----------------------------------*/

export const profileData = {
  name: "PRENOM - NOM",
  role: "Étudiant",
  avatar: "./assets/images/user.webp",
  email: "exemple@mail.com",
  socials: [
    { icon: "logo-github", link: "https://github.com" }, // Lien vers ton Profil GitHub
    { icon: "globe-outline", link: "https://linktr.ee/" } // Ajouter votre LinkTree
  ]
};

export const aboutData = {
  text: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Structuré et cohérent, cursus euismod nisi porta lorem mollis aliquam ut porttitor.</p>
         <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>`,
};

export const resumeData = {
  education: [
    {
      school: "Lorem ipsum - SISR (Lycée Lorem Ipsum)",
      date: "2023 — 2025",
      desc: "Consectetur adipiscing elit, option de systèmes et infrastructures réseau."
    },
    {
      school: "Bac Pro Lorem Numérique (Lycée Ipsum Dolor)",
      date: "2021 — 2024",
      desc: "Lorem ipsum dolor sit amet, systèmes numériques et technologies associées."
    }
  ],
  experience: [
    {
      title: "Stage Lorem Socan",
      date: "2025",
      desc: "Assistance utilisateur, maintenance matérielle et logicielle, support opérationnel."
    },
    {
      title: "Stage Lorem Multimedia",
      date: "2023",
      desc: "Réparation de systèmes, intervention hardware de base et support technique client."
    }
  ],
  skills: [
    { name: "Documentation Technique", percent: 80 },
    { name: "Hardware & Dépannage", percent: 90 },
    { name: "Admin Sys & Réseaux", percent: 60 },
    { name: "Gestion Infrastructure", percent: 50 } //Si tu veut ajouter un autre skill, ajoute-le en dessous
  ]
};


export const outilsData = [
  {
    title: "Intelligence Artificielle",
    icon: "ellipse-outline",
    items: [
      {
        name: "AI",
        image: {
          src: "",
          alt: "",
          width: 500,
          height: 500,
        },
        description: "",
        link: ""
      },
      {
        name: "AI",
        image: {
          src: "",
          alt: "1",
          width: 500,
          height: 500,
        },
        description: "",
        link: ""
      },
      {
        name: "AI",
        description: "",
        image: {
          src: "", // Ajouter votre image
          alt: "  ",
          width: 500,
          height: 500,
        },
        link: ""
      },
    ]
  },
  {
    // Outils de Dev.
    title: "Développement & Outils",
    icon: "code-slash-outline",
    items: [
      {
        name: "Exemple d'outil",
        image: {
          src: "",
          alt: "",
          width: 480,
          height: 240
        },
        description: "",
        link: ""
      },
      {
        name: "Exemple d'outil",
        description: "",
        image: {
          src: "",
          alt: "",
          width: 480,
          height: 240
        },
        link: ""
      },
      {
        name: "Exemple d'outil",
        image: {
          src: "",
          alt: "",
          width: 480,
          height: 240
        },
        description: "",
        link: ""
      },
    ]
  },


  {
    title: "Documentation & Organisation",
    icon: "document-text-outline",
    items: [
      {
        name: "Exemple d'outil",
        image: {
          src: "", // Ajouter votre image
          alt: "",
          width: 500,
          height: 500,
        },

        description: "",
        link: ""
      },
      {
        name: "Exemple d'outil",
        image: {
          src: "", // Ajouter votre image
          alt: "",
          width: 500,
          height: 500,
        },
        description: "",
        link: ""
      },
    ]
  }
];


// ========== CERTIFICATIONS ==========
export const certificationsData = [
  {
    title: "Certifications obtenues",
    icon: "ribbon-outline",
    items: [
      {
        name: "Certification-1-OK",
        image: {
          src: "",
          alt: "",
          width: 500,
          height: 500,
        },
        issuer: "RGPD",
        date: "2026",
        description: "Certification Obtenue",
        link: "", // Lien vers ton certificat
      }
    ]
  },
  {
    title: "En cours / Préparées",
    icon: "time-outline",
    items: [
      {
        name: "Certification-1",
        image: {
          src: "",
          alt: "",
          width: 500,
          height: 500,
        },
        issuer: "Provider-1",
        date: "2025",
        description: "Certification en cours de préparation.",
        link: ""
      },
    ]
  }
];

export const materielData = [
  {
    title: "PC",
    icon: "desktop-outline",
    items: [
      {
        name: "AMD Ryzen 7 9950X",
        description: "",
        link: "" // Lien vers ton produit
      },
      {
        name: "RTX 5090",
        description: "",
        link: "" // Lien vers ton produit
      },
      {
        name: "1TB DDR5",
        description: "",
        link: "" // Lien vers ton produit
      },
    ]
  },
  {
    title: "Périphériques & Affichage",
    icon: "hardware-chip-outline",
    items: [
      {
        name: "Screen-1",
        description: "",
        link: ""
      },
      {
        name: "Keyboard-1",
        description: "",
        link: ""
      },
      {
        name: "Mouse-1",
        description: "",
        link: ""
      },
    ]
  },
  {
    title: "Réseau",
    icon: "globe-outline",
    items: [
      {
        name: "Box-1",
        description: "",
        link: ""
      }
    ]
  }
];


export const portfolioData = [

 // ===== WINDOWS / ACTIVE DIRECTORY =====

  {
    title: "Lorem ipsum - Exemple de projet.",
    category: "Windows",
    image: "./assets/images/logo_GitHub.webp",
    link: "https://github.com" // Lien vers ton projet
  },

  // ===== INFRA / RÉSEAU (haut de vitrine) =====

  {
    title: "Lorem ipsum - Exemple de projet.",
    category: "Linux",
    image: "./assets/images/logo_GitHub.webp",
    link: "https://github.com" // Lien vers ton projet
  },
 
  // ===== AUTRES PROJETS / SYSTÈMES =====

  {
    title: "Lorem ipsum - Exemple de projet.",
    category: "Autre",
    image: "./assets/images/logo_GitHub.webp",
    link: "https://github.com"
  },

];

export const stageData = [
  {
    company: "Lorem Ipsum",
    date: "2025",
    role: "Technicien informatique",
    image: {
      src: "",
      alt: "",
      width: 240,
      height: 240
    },

    expandable: true,
    missions: [
      "Lorem ipsum dolor sit amet — diagnostic et analyse des systèmes matériels et logiciels",
      "Consectetur adipiscing elit — intervention sur composants, réinstallation et récupération de données",
      "Sed do eiusmod tempor — gestion logistique du matériel et suivi des flux",
      "Ut labore et dolore magna aliqua — rédaction de rapports techniques et documentation d’intervention",
      "Audit Lorem ipsum — analyse de parc informatique en préparation de migration",
      "Tests système continus — validation des composants matériels et contrôle qualité"
    ]
  },
  {
    company: "Lorem Multimédia",
    date: "2023",
    role: "Technicien maintenance",
    missions: [
      "Maintenance préventive et corrective des systèmes informatiques",
      "Réparation de composants électroniques et interventions de base",
      "Support utilisateur et assistance technique",
      "Nettoyage, reconditionnement et préparation des machines avant redistribution"
    ]
  }
];

// ========== VEILLE INFORMATIQUE ==========
export const veilleData = [
  {
    title: "CPU — Architectures Hybrides",
    icon: "hardware-chip-outline",
    items: [
      {
        name: "New-1",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      },
      {
        name: "New-2",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      }
    ]
  },
  {
    title: "GPU — Rendu Neuronal",
    icon: "layers-outline",
    items: [
      {
        name: "New-1",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      },
      {
        name: "New-2",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      }
    ]
  },
  {
    title: "IA embarquée — NPU",
    icon: "flash-outline",
    items: [
      {
        name: "New-1",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      }
    ]
  },
  {
    title: "Chaines Youtube",
    icon: "logo-youtube",
    items: [
      {
        name: "Mr X",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      },
      {
        name: "Mr X",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      }
    ]
  },
  {
    title: "Hardware",
    icon: "hardware-chip-outline",
    items: [
      {
        name: "Site-1",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      },
      {
        name: "Site-2",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      },
    ]
  },
  {
    title: "Open Source",
    icon: "code-slash-outline",
    items: [
      {
        name: "Repo-1",
        description: "Lorem ipsum dolor sit amet.",
        link: ""
      },
    ]
  }
];