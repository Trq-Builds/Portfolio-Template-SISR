/*-----------------------------------*\
  #THEME TOGGLE
\*-----------------------------------*/

// Sélection du bouton
const themeToggle = document.getElementById('themeToggle');

// Vérifier le thème sauvegardé dans le localStorage
const currentTheme = localStorage.getItem('theme');

// Appliquer le thème sauvegardé au chargement
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

// Toggle au clic
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  // Sauvegarder la préférence
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Animation du bouton
themeToggle.addEventListener('mouseenter', () => {
  themeToggle.style.transform = 'scale(1.15) rotate(10deg)';
});

themeToggle.addEventListener('mouseleave', () => {
  themeToggle.style.transform = 'scale(1) rotate(0deg)';
});