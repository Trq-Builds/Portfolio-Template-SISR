/**
 * BTS SIO SISR Portfolio — main.js
 * Centralised application logic: profile rendering, internship timeline,
 * and single-theme asset management.
 *
 * Depends on data.js (window.portfolioData) and DOMContentLoaded.
 * @version 1.0.0
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // ---------------------------------------------------------------------------
  // Data access
  // ---------------------------------------------------------------------------
  function getData() {
    if (typeof window.portfolioData === 'undefined') {
      console.error('main.js: window.portfolioData is not defined. Ensure data.js is loaded first.');
      return null;
    }
    return window.portfolioData;
  }

  // ---------------------------------------------------------------------------
  // Render profile section
  // ---------------------------------------------------------------------------
  function renderProfile() {
    const data = getData();
    if (!data) return;

    const container = $('#profile-container');
    if (!container) return;

    const { name, title, summary, avatar } = data.profile;

    container.innerHTML = `
      <div class="v-card v-animate-float" style="display:flex;align-items:center;gap:24px;padding:24px;">
        <img src="${avatar}" alt="Photo de ${name}" width="120" height="120"
             style="border-radius:50%;object-fit:cover;border:3px solid var(--accent,#4d6bfe);"
             onerror="this.src='assets/img/avatar.webp'">
        <div>
          <h1>${name}</h1>
          <p class="v-label">${title}</p>
          <p>${summary}</p>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Render internship timeline
  // ---------------------------------------------------------------------------
  function renderStage() {
    const data = getData();
    if (!data || !data.stages) return;

    const container = $('#stage-container');
    if (!container) return;

    const stages = data.stages
      .sort((a, b) => new Date(b.start) - new Date(a.start))
      .map(
        s => `
      <div class="v-card" style="padding:20px;margin-bottom:16px;">
        <h3>${s.company} — ${s.role}</h3>
        <p class="v-label">${s.start} → ${s.end}</p>
        <p>${s.description}</p>
      </div>`
      )
      .join('');

    container.innerHTML = stages;
  }

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
    renderStage();
  });
})();
