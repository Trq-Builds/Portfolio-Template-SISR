/*═══════════════════════════════════════════════════════════════════
  MAIN.JS — v3.0 (template open-source)
  ─────────────────────────────────────────────────────────────────
  RÔLE : Contrôleur central de l'application.
         Il orchestre deux responsabilités distinctes :

  1. RENDU INITIAL (au chargement de la page)
     → Navbar, profil (sidebar), section "À propos"
     Seul le contenu visible immédiatement est injecté.

  2. LAZY RENDERING (au clic de navigation)
     → Les autres sections ne sont construites en HTML que
       lorsque l'utilisateur les visite pour la première fois.
     → Gain : zéro travail inutile au chargement, DOM allégé.

  ARCHITECTURE DES FICHIERS :
  ┌─────────────┐     ┌──────────┐     ┌──────────┐
  │   data.js   │────▶│  main.js │────▶│   DOM    │
  │  (données)  │     │(logique) │     │ (rendu)  │
  └─────────────┘     └──────────┘     └──────────┘

  POUR PERSONNALISER LE CONTENU : modifier uniquement data.js.
  POUR MODIFIER UN RENDU : modifier la fonction renderXxx() concernée.
  POUR MODIFIER LE STYLE : modifier style.css (variables :root en tête).
═══════════════════════════════════════════════════════════════════*/

/*───────────────────────────────────────────────────────────────────
  IMPORT DES DONNÉES
  ─────────────────────────────────────────────────────────────────
  Toutes les données du site vivent dans data.js.
  Ce fichier main.js ne contient AUCUNE donnée en dur —
  il se contente de lire ces exports et de les transformer en HTML.

  Si vous ajoutez une nouvelle section, deux étapes :
  1. Exporter une nouvelle constante depuis data.js
  2. L'importer ici et créer la fonction renderXxx() correspondante
───────────────────────────────────────────────────────────────────*/
import {
  profileData,       // Nom, rôle, avatar, email, liens sociaux
  aboutData,         // Texte de présentation (HTML inline autorisé)
  resumeData,        // Formation, expériences, barres de compétences
  outilsData,        // Catégories d'outils avec descriptions et liens
  certificationsData,// Certifications obtenues / en cours
  materielData,      // Setup hardware par catégorie
  portfolioData,     // Projets avec image, catégorie et lien
  stageData,         // Cartes de stage avec missions
  veilleData         // Sources de veille informatique par thème
} from './data.js';


/*═══════════════════════════════════════════════════════════════════
  BLOC 1 — UTILITAIRES DOM
  ─────────────────────────────────────────────────────────────────
  Ce bloc regroupe des fonctions courtes réutilisées partout.
  Pensez-y comme à une "boîte à outils" interne.
═══════════════════════════════════════════════════════════════════*/

/*───────────────────────────────────────────────────────────────────
  $ / $$ — Raccourcis de sélection DOM
  ─────────────────────────────────────────────────────────────────
  Au lieu d'écrire document.querySelector('.ma-classe') partout,
  on utilise $('  .ma-classe') — c'est identique, juste plus court.

  $  → retourne UN seul élément (le premier trouvé), ou null.
  $$ → retourne TOUS les éléments correspondants (NodeList).
───────────────────────────────────────────────────────────────────*/
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/*───────────────────────────────────────────────────────────────────
  _imgHTML — Générateur de balise <img> sécurisée
  ─────────────────────────────────────────────────────────────────
  PROBLÈME RÉSOLU : une <img> sans src ou sans dimensions provoque
  un "flash" visuel et un CLS (Cumulative Layout Shift) qui dégrade
  le score de performance Lighthouse.

  PARAMÈTRE : un objet "spec" avec les propriétés suivantes :
    - src    (obligatoire) : chemin ou URL de l'image
    - alt    (optionnel)   : texte alternatif pour l'accessibilité
    - width  (optionnel)   : largeur en px (défaut : 600)
    - height (optionnel)   : hauteur en px (défaut : 400)
    - cls    (optionnel)   : classe CSS supplémentaire

  FALLBACK : si l'image est introuvable (erreur 404), l'attribut
  onerror remplace automatiquement la src par un placeholder neutre.
  → Pratique en développement pour ne pas bloquer sur des images
    manquantes.

  PERSONNALISATION : modifier les valeurs width/height par défaut
  selon les ratios de votre design.
───────────────────────────────────────────────────────────────────*/
const _imgHTML = (spec) => {
  if (!spec?.src) return '';
  const { src, alt = '', width = 600, height = 400, cls = '' } = spec;
  return `<img
    src="${src}"
    alt="${alt}"
    width="${width}"
    height="${height}"
    loading="lazy"
    ${cls ? `class="${cls}"` : ''}
    onerror="this.src='https://placehold.co/${width}x${height}?text=N%2FA'"
  >`;
};

/*───────────────────────────────────────────────────────────────────
  setHTML — Injection HTML sécurisée avec garde d'existence
  ─────────────────────────────────────────────────────────────────
  POURQUOI : si on fait directement element.innerHTML = '...' sans
  vérifier que l'élément existe, JavaScript lève une TypeError et
  plante toute la suite de l'initialisation.

  Cette fonction ajoute un garde : si l'élément ciblé n'existe pas
  dans le DOM, elle affiche un avertissement dans la console au lieu
  de planter — le reste de la page continue de fonctionner.

  PARAMÈTRES :
    - sel  : sélecteur CSS (ex: '.navbar-list', '#mon-id')
    - html : chaîne HTML à injecter

  PERSONNALISATION : si vous renommez un élément HTML dans index.html,
  pensez à mettre à jour le sélecteur dans l'appel setHTML()
  correspondant.
───────────────────────────────────────────────────────────────────*/
const setHTML = (sel, html) => {
  const el = $(sel);
  if (el) {
    el.innerHTML = html;
  } else {
    console.warn(`[main.js] setHTML — sélecteur introuvable : "${sel}"`);
  }
};


/*═══════════════════════════════════════════════════════════════════
  BLOC 2 — RENDERERS CRITIQUES (exécutés au chargement)
  ─────────────────────────────────────────────────────────────────
  Ces deux fonctions s'exécutent immédiatement au DOMContentLoaded.
  Elles construisent le "squelette" visible dès l'ouverture de la page :
  la barre de navigation et la sidebar avec le profil.

  RÈGLE : ne jamais déplacer du contenu "secondaire" ici.
  Tout ce qui n'est pas visible au premier regard reste dans le
  BLOC 3 (lazy renderers).
═══════════════════════════════════════════════════════════════════*/

/*───────────────────────────────────────────────────────────────────
  renderNavbar — Construction de la barre de navigation
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Elle génère dynamiquement les boutons <button> de la navbar
  à partir d'un tableau de configuration statique défini ici.

  POURQUOI statique et pas dans data.js ?
  La liste des pages est une décision d'architecture (quelles sections
  existent), pas une donnée de contenu. Elle est intentionnellement
  séparée du contenu éditorial de data.js.

  PERSONNALISATION :
  → Pour ajouter une page : ajouter un objet { label, id } au tableau.
    L'id DOIT correspondre exactement à l'attribut data-page de
    l'article HTML dans index.html, ET à une clé de SECTION_RENDERERS.
  → Le premier item (index 0) reçoit la classe "active" par défaut —
    c'est la page affichée à l'ouverture du site.
───────────────────────────────────────────────────────────────────*/
function renderNavbar() {
  /*
    Configuration des pages de navigation.
    Chaque objet définit :
      - label : texte affiché dans le bouton
      - id    : identifiant technique lié au data-page et au renderer
  */
  const pages = [
    { label: 'À propos', id: 'about' },
    { label: 'Parcours', id: 'resume' },
    { label: 'Stage', id: 'stage' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Veille', id: 'veille' },
    { label: 'Outils', id: 'outils' },
    { label: 'Matériel', id: 'materiel' },
    { label: 'Portfolio', id: 'portfolio' },
  ];

  /*
    .map() parcourt chaque page et retourne un string HTML.
    .join('') fusionne tous ces strings en un seul bloc HTML.
    data-nav-link="${p.id}" est l'attribut lu par setupNavigation()
    pour savoir quelle section afficher au clic.
  */
  setHTML('.navbar-list', pages.map((p, i) => `
    <li class="navbar-item">
      <button
        class="navbar-link ${i === 0 ? 'active' : ''}"
        data-nav-link="${p.id}"
      >
        ${p.label}
      </button>
    </li>
  `).join(''));
}

/*───────────────────────────────────────────────────────────────────
  renderProfile — Injection du profil dans la sidebar
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Elle lit profileData (depuis data.js) et peuple la sidebar avec :
    - L'avatar (image de profil)
    - Le nom et le rôle
    - L'adresse email (lien mailto:)
    - Les liens sociaux (icônes cliquables)

  DONNÉES SOURCE : profileData dans data.js
  → C'est ici que vous modifiez nom, email, liens sociaux et avatar.

  NOTE TECHNIQUE — pourquoi on vérifie !img.getAttribute('src') :
  Dans index.html, la balise <img> de l'avatar a src="" (vide).
  getAttribute('src') retourne la chaîne vide "", qui est falsy
  en JavaScript. La garde `if (img && !img.getAttribute('src'))`
  est donc toujours vraie au premier chargement — son effet réel
  est uniquement de protéger contre une absence de l'élément img
  dans le DOM (cas où index.html aurait été modifié).

  PERSONNALISATION :
  → Avatar        : modifier profileData.avatar dans data.js
  → Nom / Rôle   : modifier profileData.name et profileData.role
  → Email         : modifier profileData.email
  → Liens sociaux : modifier le tableau profileData.socials
                    (icon = nom d'une icône Ionicons 5)
───────────────────────────────────────────────────────────────────*/
function renderProfile() {
  /*
    Injection de l'avatar.
    On vérifie d'abord que la balise <img> existe dans le DOM
    avant de modifier son attribut src — protection contre une
    éventuelle suppression accidentelle de la balise dans index.html.
  */
  const img = $('.avatar-box img');
  if (img) {
    img.src = profileData.avatar;
  }

  /*
    Injection du nom et du rôle.
    Optional chaining (?.) : si l'élément n'existe pas, on passe
    silencieusement — pas de TypeError, pas de crash.
  */
  const nameEl = $('.info-content .name');
  const roleEl = $('.info-content .title');
  if (nameEl) nameEl.textContent = profileData.name;
  if (roleEl) roleEl.textContent = profileData.role;

  /*
    Injection du lien email dans la liste de contacts.
    mailto: ouvre le client mail par défaut de l'utilisateur.
  */
  setHTML('.contacts-list', `
    <li class="contact-item">
      <div class="icon-box">
        <ion-icon name="mail-outline"></ion-icon>
      </div>
      <div class="contact-info">
        <p class="contact-title">Email</p>
        <a href="mailto:${profileData.email}" class="contact-link">
          ${profileData.email}
        </a>
      </div>
    </li>
  `);

  /*
    Injection des liens sociaux.
    profileData.socials est un tableau d'objets { icon, link }.
    .map() génère un <li> par réseau social.
    rel="noopener noreferrer" : sécurité obligatoire sur tout lien
    target="_blank" pour éviter l'accès à window.opener.
  */
  setHTML('.social-list', profileData.socials.map(s => `
    <li class="social-item">
      <a
        href="${s.link}"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${s.icon}"
      >
        <ion-icon name="${s.icon}"></ion-icon>
      </a>
    </li>
  `).join(''));

} // ← ACCCOLADE FERMANTE AJOUTÉE ICI (manquante auparavant)

/*═══════════════════════════════════════════════════════════════════
  BLOC 3 — LAZY RENDERERS (exécutés au premier clic de navigation)
  ─────────────────────────────────────────────────────────────────
  Ces fonctions construisent le HTML de chaque section à la demande.
  Elles ne sont JAMAIS appelées au chargement initial de la page.

  MÉCANISME :
  renderSection(id) → vérifie si déjà rendu → appelle renderXxx()
  (voir BLOC 4 pour le dispatcher)

  RÈGLE D'EXTENSION : pour ajouter une section,
  1. Créer une fonction renderMaSection() ici
  2. L'enregistrer dans SECTION_RENDERERS (BLOC 4)
═══════════════════════════════════════════════════════════════════*/

/*───────────────────────────────────────────────────────────────────
  renderAbout — Section "À propos"
  ─────────────────────────────────────────────────────────────────
  Injecte le texte de présentation depuis aboutData.text.
  Le HTML inline est autorisé dans aboutData.text (balises <p>, <b>…).

  DONNÉES SOURCE : aboutData.text dans data.js
───────────────────────────────────────────────────────────────────*/
function renderAbout() {
  setHTML('.about-text', aboutData.text);
}

/*───────────────────────────────────────────────────────────────────
  renderResume — Section "Parcours"
  ─────────────────────────────────────────────────────────────────
  Construit trois blocs distincts depuis resumeData :
    1. Liste des formations   → .education-list
    2. Liste des expériences  → .experience-list
    3. Barres de compétences  → .skills-list

  DONNÉES SOURCE : resumeData dans data.js
  PERSONNALISATION :
  → Ajouter une formation    : ajouter un objet dans resumeData.education
  → Ajouter une compétence   : ajouter { name, percent } dans resumeData.skills
    (percent = valeur entre 0 et 100, contrôle la largeur de la barre)
───────────────────────────────────────────────────────────────────*/
function renderResume() {
  /*
    Formation : chaque item devient un <li> dans la timeline.
    item.school → nom de l'établissement
    item.date   → période (ex: "2023 — 2025")
    item.desc   → description courte
  */
  setHTML('.education-list', resumeData.education.map(item => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${item.school}</h4>
      <span>${item.date}</span>
      <p class="timeline-text">${item.desc}</p>
    </li>
  `).join(''));

  /*
    Expériences : même structure que la formation.
    item.title → intitulé du poste ou du stage
  */
  setHTML('.experience-list', resumeData.experience.map(item => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${item.title}</h4>
      <span>${item.date}</span>
      <p class="timeline-text">${item.desc}</p>
    </li>
  `).join(''));

  /*
    Compétences : la largeur de .skill-progress-fill est pilotée
    par style="width: X%" calculé depuis s.percent.
    La balise <data value="X"> encode la valeur numérique pour
    les outils de scraping et d'accessibilité (sémantique HTML5).
  */
  setHTML('.skills-list', resumeData.skills.map(s => `
    <li class="skills-item">
      <div class="title-wrapper">
        <h5 class="h5">${s.name}</h5>
        <data value="${s.percent}">${s.percent}%</data>
      </div>
      <div class="skill-progress-bg">
        <div class="skill-progress-fill" style="width: ${s.percent}%;"></div>
      </div>
    </li>
  `).join(''));
}

/*───────────────────────────────────────────────────────────────────
  renderStage — Section "Stage"
  ─────────────────────────────────────────────────────────────────
  Construit les cartes de stage depuis stageData.
  Chaque carte affiche : entreprise, date, rôle, liste de missions.
  Si une image est fournie (s.image.src non vide), elle est affichée.

  DONNÉES SOURCE : stageData dans data.js
  PERSONNALISATION :
  → Ajouter un stage  : ajouter un objet dans le tableau stageData
  → Missions          : tableau de strings dans s.missions
  → Image optionnelle : renseigner s.image.src (laisser vide sinon)

  NOTE : le champ s.expandable présent dans data.js est réservé
  pour une implémentation future de l'accordéon par carte.
  Il n'est pas encore lu ici — toutes les cartes ont le même rendu.
───────────────────────────────────────────────────────────────────*/
function renderStage() {
  setHTML('.stage-list', stageData.map(s => `
    <li class="stage-card">

      ${s.image?.src
        ? `<figure class="stage-card-img">${_imgHTML(s.image)}</figure>`
        : ''
      }

      <div class="stage-card-header">
        <span class="stage-company">${s.company}</span>
        <span class="stage-date">${s.date}</span>
      </div>

      <p class="stage-role">${s.role}</p>

      <ul class="stage-missions">
        ${s.missions.map(m => `<li>${m}</li>`).join('')}
      </ul>

    </li>
  `).join(''));
}

/*───────────────────────────────────────────────────────────────────
  renderVeille — Section "Veille informatique"
  ─────────────────────────────────────────────────────────────────
  Construit les catégories de veille depuis veilleData.
  Chaque catégorie contient un titre, une icône, et des items.
  Chaque item : nom, description courte, lien optionnel.

  DONNÉES SOURCE : veilleData dans data.js
  PERSONNALISATION :
  → Nouvelle catégorie : ajouter un objet { title, icon, items }
  → Icône              : nom d'une icône Ionicons 5
                         (catalogue : https://ionicons.com/v5/)
───────────────────────────────────────────────────────────────────*/
function renderVeille() {
  setHTML('.veille-list', veilleData.map(cat => `
    <li class="tools-category">

      <div class="title-wrapper">
        <div class="icon-box">
          <ion-icon name="${cat.icon}"></ion-icon>
        </div>
        <h3 class="h3">${cat.title}</h3>
        <span class="category-count">${cat.items.length}</span>
      </div>

      <ul class="tools-items">
        ${cat.items.map(item => `
          <li class="tool-item">
            <div class="tool-content">
              <h4>${item.name}</h4>
              <p class="tool-description">${item.description}</p>
              ${item.link
                ? `
                  <a href="${item.link}"
                     class="tool-link"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                    Voir la source
                    <ion-icon name="open-outline"></ion-icon>
                  </a>`
                : ''
              }
            </div>
          </li>
        `).join('')}
      </ul>

    </li>
  `).join(''));
}


/*═══════════════════════════════════════════════════════════════════
  BLOC 3b — RENDERERS BENTO (Outils / Certifications / Matériel)
  ─────────────────────────────────────────────────────────────────
  Ces trois sections partagent la même structure visuelle "bento grid"
  (grille de cartes). Un renderer générique renderBento() est utilisé
  pour les trois, avec des options différentes selon la section.

  ARCHITECTURE DU BENTO :
  ┌─ Section (bento-section) ───────────────────────────────────┐
  │  Titre + icône + compteur                                   │
  │  ┌─ Grille (bento-grid) ──────────────────────────────────┐ │
  │  │  [Carte 1]  [Carte 2]  [Carte 3]  ...                 │ │
  │  └────────────────────────────────────────────────────────┘ │
  └─────────────────────────────────────────────────────────────┘

  DIFFÉRENCE ENTRE LES DEUX TEMPLATES DE CARTE :
  → _bentoCardHTML          : carte standard (Matériel)
  → _expandableBentoCardHTML: carte avec accordéon (Outils, Certifications)
    L'accordéon permet d'afficher une image ou du contenu caché
    sous un bouton +/−.
═══════════════════════════════════════════════════════════════════*/

/*───────────────────────────────────────────────────────────────────
  _bentoCardHTML — Template HTML d'une carte bento standard
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Retourne le HTML d'une carte sans accordéon.
  Utilisée par renderMateriel via renderBento({ expandable: false }).

  PARAMÈTRES :
    - item      : un objet item depuis data.js
                  (name, description, issuer?, date?, link?)
    - linkLabel : texte du lien externe (ex: "Voir le produit")

  CHAMPS OPTIONNELS :
  → item.issuer : si présent, affiche l'émetteur (ex: fabricant)
  → item.date   : si présent avec issuer, affiche la date
  → item.link   : si présent, affiche un lien externe

  PERSONNALISATION :
  → Ajouter un champ visuellement : copier le bloc conditionnel
    item.issuer et adapter pour votre nouveau champ dans data.js.
───────────────────────────────────────────────────────────────────*/
function _bentoCardHTML(item, linkLabel) {
  return `
    <li class="bento-card">

      <h4>${item.name}</h4>

      ${item.issuer
        ? `<p class="bento-meta">
             <ion-icon name="business-outline"></ion-icon>
             ${item.issuer}${item.date ? ` — ${item.date}` : ''}
           </p>`
        : ''
      }

      <p class="bento-desc">${item.description}</p>

      ${item.link
        ? `
          <a href="${item.link}"
             class="tool-link"
             target="_blank"
             rel="noopener noreferrer"
          >
            ${linkLabel}
            <ion-icon name="open-outline"></ion-icon>
          </a>`
        : ''
      }

    </li>`;
}

/*───────────────────────────────────────────────────────────────────
  _expandableBentoCardHTML — Template HTML d'une carte avec accordéon
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Retourne le HTML d'une carte avec un bouton +/− qui révèle
  du contenu caché (image de certificat, capture d'écran d'outil…).

  MÉCANISME DE L'ACCORDÉON (CSS Grid Trick) :
  → Fermé : .expandable-body { grid-template-rows: 0fr }
  → Ouvert : .expandable-body { grid-template-rows: 1fr }
  La transition CSS anime la hauteur sans JavaScript et sans
  getBoundingClientRect (zéro reflow, GPU-safe).

  AFFICHAGE DE L'IMAGE :
  → Si item.image.src est renseigné dans data.js : affiche l'image.
  → Sinon : affiche un placeholder visuel avec un message guide.

  PERSONNALISATION :
  → Pour ajouter l'image d'un outil ou d'une certification :
    renseigner item.image.src dans data.js avec le chemin de l'image.
    Format recommandé : WebP, 800×566px, fond blanc ou transparent.

  ACCESSIBILITÉ :
  → aria-expanded="false/true" est mis à jour par setupExpandableCards()
  → aria-hidden="true/false"   est mis à jour sur .expandable-body
───────────────────────────────────────────────────────────────────*/
function _expandableBentoCardHTML(item, linkLabel) {
  return `
    <li class="bento-card" data-expandable>

      <div class="bento-card-header">
        <h4>${item.name}</h4>
        <button
          class="expand-btn"
          data-expand-btn
          aria-expanded="false"
          aria-label="Déplier — ${item.name}"
        >
          <span class="expand-icon"></span>
        </button>
      </div>

      ${item.issuer
        ? `<p class="bento-meta">
             <ion-icon name="business-outline"></ion-icon>
             ${item.issuer}${item.date ? ` — ${item.date}` : ''}
           </p>`
        : ''
      }

      <p class="bento-desc">${item.description}</p>

      ${item.link
        ? `
          <a href="${item.link}"
             class="tool-link"
             target="_blank"
             rel="noopener noreferrer"
          >
            ${linkLabel}
            <ion-icon name="open-outline"></ion-icon>
          </a>`
        : ''
      }

      <div class="expandable-separator"></div>

      <div class="expandable-body" aria-hidden="true">
        <div class="expandable-inner">
          ${item.image?.src
            ? _imgHTML(item.image)
            : `<div class="expandable-placeholder">
                 <ion-icon name="image-outline"></ion-icon>
                 <span>
                   Ajoutez une image dans data.js → item.image.src
                 </span>
               </div>`
          }
        </div>
      </div>

    </li>`;
}

/*───────────────────────────────────────────────────────────────────
  renderBento — Renderer générique pour les sections bento
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Factorisation des renderers Outils, Certifications et Matériel.
  Ces trois sections ont la même structure HTML — seuls changent :
    - la source de données (outilsData / certificationsData / materielData)
    - le conteneur cible dans le DOM (.outils-target, etc.)
    - le libellé du lien externe ("Voir le site", "Voir le produit"…)
    - le mode de carte (standard vs accordéon)

  COMMENT LES DONNÉES SONT INJECTÉES :
  data (tableau de catégories)
    └── cat (une catégorie)
          └── cat.items (tableau d'items)
                └── item → _bentoCardHTML(item) ou _expandableBentoCardHTML(item)

  PARAMÈTRES :
    - data           : tableau exporté depuis data.js
    - targetSelector : sélecteur du conteneur cible dans index.html
    - linkLabel      : texte du lien externe de chaque carte
    - options.expandable : true → cartes avec accordéon et setupExpandableCards()
                           false → cartes standard (défaut)

  PERSONNALISATION :
  → Pour changer le libellé du lien dans Outils :
    modifier le 3e argument de renderBento dans renderOutils()
  → Pour désactiver l'accordéon sur les certifications :
    passer { expandable: false } dans renderCertifications()
───────────────────────────────────────────────────────────────────*/
function renderBento(data, targetSelector, linkLabel = 'Voir le site', { expandable = false } = {}) {
  /*
    Construction du HTML complet :
    data.map() → une <section> par catégorie
    cat.items.map() → une <li> par item dans la grille bento
  */
  setHTML(targetSelector, data.map(cat => `
    <section class="bento-section">

      <h3 class="bento-heading">
        <div class="icon-box">
          <ion-icon name="${cat.icon}"></ion-icon>
        </div>
        ${cat.title}
        <span class="bento-count">${cat.items.length}</span>
      </h3>

      <ul class="bento-grid">
        ${cat.items.map(item =>
          expandable
            ? _expandableBentoCardHTML(item, linkLabel)
            : _bentoCardHTML(item, linkLabel)
        ).join('')}
      </ul>

    </section>
  `).join(''));

  /*
    Si le mode accordéon est activé, on attache le listener
    après l'injection du HTML (le DOM doit exister avant).
    On passe le conteneur cible pour limiter la portée du listener.
  */
  if (expandable) {
    setupExpandableCards($(targetSelector));
  }
}

/*───────────────────────────────────────────────────────────────────
  Entrées de renderBento pour chaque section
  ─────────────────────────────────────────────────────────────────
  Ces trois constantes sont les "points d'entrée" enregistrés
  dans SECTION_RENDERERS. Elles appellent renderBento avec les
  paramètres propres à chaque section.

  PERSONNALISATION PAR SECTION :
  → renderOutils         : accordéon actif, lien "Voir le site"
  → renderCertifications : accordéon actif, lien "Voir la certification"
  → renderMateriel       : sans accordéon, lien "Voir le produit"
───────────────────────────────────────────────────────────────────*/
const renderOutils = () =>
  renderBento(outilsData, '.outils-target', 'Voir le site', { expandable: true });

const renderCertifications = () =>
  renderBento(certificationsData, '.certifications-target', 'Voir la certification', { expandable: true });

const renderMateriel = () =>
  renderBento(materielData, '.materiel-target', 'Voir le produit');


/*───────────────────────────────────────────────────────────────────
  renderPortfolio — Section "Portfolio"
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  1. Génère les boutons de filtre depuis les catégories de portfolioData
  2. Génère la grille de projets
  3. Attache le système de filtrage (setupFilters)

  DÉDUPLICATION DES CATÉGORIES :
  new Set() élimine les doublons — si 5 projets ont la catégorie
  "Linux", elle n'apparaîtra qu'une fois dans les boutons de filtre.
  "Tout" est ajouté manuellement en premier.

  DONNÉES SOURCE : portfolioData dans data.js
  PERSONNALISATION :
  → Ajouter un projet : ajouter { title, category, image, link }
    dans portfolioData. La catégorie doit être une string cohérente
    avec les autres projets (la casse est significative : "Linux"
    ≠ "linux").
  → Modifier les dimensions des images : changer width/height
    sur la balise <img> ci-dessous et dans _imgHTML si nécessaire.
───────────────────────────────────────────────────────────────────*/
function renderPortfolio() {
  /*
    Extraction et déduplication des catégories depuis les données.
    Array.from(new Set(...)) : convertit le Set en tableau itérable.
    "Tout" est préfixé pour toujours apparaître en premier bouton.
  */
  const categories = ['Tout', ...new Set(portfolioData.map(p => p.category))];

  /*
    Rendu des boutons de filtre.
    data-filter="${cat}" : attribut lu par setupFilters() au clic.
    Le premier bouton (index 0 = "Tout") est actif par défaut.
  */
  setHTML('.filter-list', categories.map((cat, i) => `
    <li class="filter-item">
      <button
        class="${i === 0 ? 'active' : ''}"
        data-filter="${cat}"
      >
        ${cat}
      </button>
    </li>
  `).join(''));

  /*
    Rendu de la grille de projets.
    Tous les projets ont la classe "active" par défaut
    (filtre "Tout" actif à l'ouverture).
    width/height explicites sur <img> → prévient le CLS.
    onerror → fallback si l'image est manquante.
  */
  setHTML('.project-list', portfolioData.map(p => `
    <li class="project-item active" data-category="${p.category}">
      <a href="${p.link}" target="_blank" rel="noopener noreferrer">

        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img
            src="${p.image}"
            alt="${p.title}"
            loading="lazy"
            width="600"
            height="400"
            onerror="this.src='https://placehold.co/600x400?text=Projet'"
          >
        </figure>

        <h3 class="project-title">${p.title}</h3>
        <p class="project-category">${p.category}</p>

      </a>
    </li>
  `).join(''));

  /*
    Les filtres doivent être attachés APRÈS l'injection du HTML
    (les boutons et les items doivent exister dans le DOM).
  */
  setupFilters();
}


/*═══════════════════════════════════════════════════════════════════
  BLOC 4 — DISPATCHER LAZY RENDERING
  ─────────────────────────────────────────────────────────────────
  Ce bloc est le "chef d'orchestre" du lazy rendering.

  FONCTIONNEMENT :
  1. SECTION_RENDERERS associe chaque id de page à sa fonction.
  2. RENDERED est un Set qui mémorise les sections déjà construites.
  3. renderSection(id) vérifie le Set avant d'appeler le renderer.
     → Si déjà rendu : return immédiat (O(1), zéro travail).
     → Si non rendu  : appel du renderer + ajout de l'id au Set.

  AVANTAGE PERFORMANCE :
  La vérification dans un Set est en O(1) constant — même avec
  100 sections, la vérification est instantanée.
  Sans ce mécanisme, chaque clic sur la nav re-injecterait le HTML
  entier de la section (inutile et coûteux).
═══════════════════════════════════════════════════════════════════*/

/*───────────────────────────────────────────────────────────────────
  SECTION_RENDERERS — Registre des fonctions de rendu
  ─────────────────────────────────────────────────────────────────
  Chaque clé correspond exactement à :
    1. L'attribut data-nav-link d'un bouton de navbar
    2. L'attribut data-page d'un article dans index.html

  PERSONNALISATION :
  → Pour ajouter une section : créer renderMaSection() dans le BLOC 3,
    puis ajouter l'entrée ici : maSection: renderMaSection
───────────────────────────────────────────────────────────────────*/
const SECTION_RENDERERS = {
  about: renderAbout,
  resume: renderResume,
  stage: renderStage,
  outils: renderOutils,
  certifications: renderCertifications,
  materiel: renderMateriel,
  veille: renderVeille,
  portfolio: renderPortfolio,
};

/*
  RENDERED — Mémoire des sections déjà injectées dans le DOM.
  Un Set est utilisé (pas un tableau) pour la vérification en O(1).
*/
const RENDERED = new Set();

/*───────────────────────────────────────────────────────────────────
  renderSection — Point d'entrée du lazy rendering
  ─────────────────────────────────────────────────────────────────
  PARAMÈTRE : id (string) — identifiant de la section (ex: 'about')

  FLUX :
  renderSection('resume')
    → RENDERED.has('resume') ? true → return (déjà fait)
                             : false → renderResume() → RENDERED.add('resume')

  L'opérateur ?. (optional chaining) sur SECTION_RENDERERS[id]?.()
  garantit qu'aucune erreur n'est levée si l'id n'est pas enregistré.
───────────────────────────────────────────────────────────────────*/
function renderSection(id) {
  if (RENDERED.has(id)) return;
  RENDERED.add(id);
  SECTION_RENDERERS[id]?.();
}


/*═══════════════════════════════════════════════════════════════════
  BLOC 5 — INTERACTIONS (Event Listeners)
  ─────────────────────────────────────────────────────────────────
  Ce bloc attache tous les comportements interactifs de la page.
  Il est exécuté APRÈS les renderers critiques dans l'init finale.

  PRINCIPE DE DÉLÉGATION D'ÉVÉNEMENT :
  Quand c'est possible, on attache UN SEUL listener sur un parent
  plutôt qu'un listener par enfant. Cela :
  → Consomme moins de mémoire
  → Fonctionne automatiquement sur les éléments ajoutés dynamiquement
  → Est plus simple à déboguer
═══════════════════════════════════════════════════════════════════*/

/*───────────────────────────────────────────────────────────────────
  setupNavigation — Navigation SPA (Single Page Application)
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Gère la navigation entre les sections sans rechargement de page.
  Au clic sur un bouton de navbar :
  1. Retire la classe "active" de tous les boutons → ajoute-la au cliqué
  2. Masque tous les articles → affiche celui qui correspond à la cible
  3. Déclenche le lazy rendering de la section si premier affichage
  4. Scroll en haut de page (UX : on repart du haut à chaque section)

  COMMENT ÇA MARCHE :
  Le bouton cliqué porte data-nav-link="resume".
  L'article cible porte data-page="resume".
  classList.toggle('active', condition) : ajoute si true, retire si false.

  PERSONNALISATION :
  → Pour supprimer le scroll automatique : retirer window.scrollTo(0, 0)
───────────────────────────────────────────────────────────────────*/
function setupNavigation() {
  const navLinks = $$('[data-nav-link]');
  const pages = $$('[data-page]');

  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      /*
        this.dataset.navLink lit l'attribut data-nav-link du bouton cliqué.
        Ex : <button data-nav-link="resume"> → target = "resume"
      */
      const target = this.dataset.navLink;

      /* Désactivation de tous les liens, activation du cliqué */
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      /*
        Pour chaque article :
        → active si son data-page correspond à la cible cliquée
        → inactif sinon
        classList.toggle(class, bool) est plus propre qu'un if/else.
      */
      pages.forEach(page => {
        page.classList.toggle('active', page.dataset.page === target);
      });

      /* Rendu lazy de la section si c'est la première visite */
      renderSection(target);

      /* Retour en haut de page pour une expérience cohérente */
      window.scrollTo(0, 0);
    });
  });
}

/*───────────────────────────────────────────────────────────────────
  setupFilters — Filtrage du portfolio par catégorie
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Au clic sur un bouton de filtre, affiche uniquement les projets
  dont data-category correspond au data-filter du bouton cliqué.
  Le filtre "Tout" affiche tous les projets.

  APPELÉE PAR : renderPortfolio() après l'injection du HTML,
  car les boutons et les items doivent exister dans le DOM.

  MÉCANISME :
  Bouton cliqué : data-filter="Linux"
  Projet affiché si : p.dataset.category === "Linux" OU filtre = "Tout"
  classList.toggle('active', bool) : ajoute/retire la classe "active"
  qui contrôle display via CSS (.project-item.active { display: block })
───────────────────────────────────────────────────────────────────*/
function setupFilters() {
  const filterBtns = $$('[data-filter]');
  const projects = $$('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      /* Désactivation de tous les boutons, activation du cliqué */
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const cat = this.dataset.filter;

      /*
        Pour chaque projet : actif si la catégorie correspond
        ou si le filtre est "Tout".
      */
      projects.forEach(p => {
        p.classList.toggle('active', cat === 'Tout' || p.dataset.category === cat);
      });
    });
  });
}

/*───────────────────────────────────────────────────────────────────
  setupSidebar — Toggle de la sidebar sur mobile
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Sur mobile, la sidebar est repliée par défaut (max-height: 112px).
  Le bouton [data-sidebar-btn] ajoute/retire la classe "active"
  sur la sidebar, ce qui déclenche l'animation CSS max-height.

  Le toggle est entièrement géré par CSS :
  .sidebar          { max-height: 112px }
  .sidebar.active   { max-height: 500px }

  Optional chaining (?.) : si le bouton ou la sidebar est absent
  du DOM, aucune erreur n'est levée.
───────────────────────────────────────────────────────────────────*/
function setupSidebar() {
  const sidebar = $('.sidebar');
  const btn = $('[data-sidebar-btn]');
  btn?.addEventListener('click', () => sidebar?.classList.toggle('active'));
}

/*───────────────────────────────────────────────────────────────────
  setupExpandableCards — Accordéon générique via délégation
  ─────────────────────────────────────────────────────────────────
  CE QUE FAIT CETTE FONCTION :
  Gère le comportement +/− des cartes bento (Outils, Certifications).
  Un seul listener est attaché sur le conteneur parent — c'est la
  délégation d'événement. Tous les boutons [data-expand-btn] à
  l'intérieur sont gérés par ce unique listener.

  FLUX AU CLIC :
  1. e.target.closest('[data-expand-btn]') remonte l'arbre DOM
     jusqu'au bouton — fonctionne même si on clique sur l'icône
     à l'intérieur du bouton.
  2. On cherche la carte parente [data-expandable].
  3. On inverse son état is-open.
  4. On synchronise aria-expanded et aria-hidden pour l'accessibilité.

  PARAMÈTRE : container — l'élément parent des cartes.
  Si container est null (section non rendue), return immédiat.

  PERSONNALISATION :
  → Ce système est générique. Pour l'utiliser ailleurs, appeler
    setupExpandableCards(monConteneur) après injection du HTML.
───────────────────────────────────────────────────────────────────*/
function setupExpandableCards(container) {
  if (!container) return;

  container.addEventListener('click', (e) => {
    /* Remonte l'arbre DOM jusqu'au bouton expand (ou null si absent) */
    const btn = e.target.closest('[data-expand-btn]');
    if (!btn) return;

    /* Remonte jusqu'à la carte parente */
    const card = btn.closest('[data-expandable]');
    if (!card) return;

    /* Calcul du nouvel état (inverse de l'état actuel) */
    const isNowOpen = !card.classList.contains('is-open');

    /* Application de l'état sur la carte */
    card.classList.toggle('is-open', isNowOpen);

    /* Synchronisation ARIA pour les lecteurs d'écran */
    btn.setAttribute('aria-expanded', String(isNowOpen));

    const body = card.querySelector('.expandable-body');
    if (body) body.setAttribute('aria-hidden', String(!isNowOpen));
  });
}


/*═══════════════════════════════════════════════════════════════════
  BLOC 6 — INITIALISATION
  ─────────────────────────────────────────────────────────────────
  Point d'entrée unique de l'application.
  DOMContentLoaded garantit que le HTML est entièrement parsé
  avant toute manipulation du DOM.

  ORDRE D'EXÉCUTION INTENTIONNEL :
  1. renderNavbar()        → structure de nav (requise par setupNavigation)
  2. renderProfile()       → sidebar visible dès le chargement
  3. renderSection('about')→ contenu de la page par défaut
  4. setupNavigation()     → doit suivre renderNavbar (boutons requis)
  5. setupSidebar()        → indépendant, peut être en dernier

  RÈGLE : les setup* doivent toujours être appelés APRÈS les render*
  correspondants, car ils attachent des listeners sur des éléments
  qui doivent déjà exister dans le DOM.
═══════════════════════════════════════════════════════════════════*/
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();           // Construit les boutons de navigation
  renderProfile();          // Peuple la sidebar (above-fold, prioritaire)
  renderSection('about');   // Injecte le contenu de la page d'accueil

  setupNavigation();        // Active la navigation entre sections
  setupSidebar();           // Active le toggle mobile de la sidebar
});