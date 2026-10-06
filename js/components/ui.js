"use strict";

/*
 * js/components/ui.js
 * Petits composants réutilisés sur plusieurs pages.
 */

/*
 * ============================================================
 * COMPOSANTS
 * ============================================================
 */

function ingredientChips(item, extraClass = "") {
  const chips = (item.ingredients || [])
    .map(
      (ingredient) =>
        `<span class="ingredient ${extraClass}" style="${getIngredientStyle(ingredient)}">${escapeHtml(ingredient)}</span>`,
    )
    .join("");
  return chips ? `<div class="ingredient-list">${chips}</div>` : "";
}

function statusButtons(item, withLabels = false) {
  const progress = getProgress(item.id);
  const id = escapeHtml(item.id);
  return `
    <div class="status-buttons ${withLabels ? "labeled" : ""}">
      <button class="status-btn ko ${progress === "review" ? "on" : ""}" data-status="review" data-id="${id}" aria-pressed="${progress === "review"}" aria-label="Non maîtrisé" title="Non maîtrisé">
        <span aria-hidden="true">✕</span>${withLabels ? "<b>Non maîtrisé</b>" : ""}
      </button>
      <button class="status-btn ok ${progress === "known" ? "on" : ""}" data-status="known" data-id="${id}" aria-pressed="${progress === "known"}" aria-label="Maîtrisé" title="Maîtrisé">
        <span aria-hidden="true">✓</span>${withLabels ? "<b>Maîtrisé</b>" : ""}
      </button>
    </div>
  `;
}

function statusClass(item) {
  const progress = getProgress(item.id);
  if (progress === "known") return "is-known";
  if (progress === "review") return "is-review";
  return "";
}

// Carte compacte : nom + composition + boutons ✕ / ✓. Rien d'autre.
function renderCard(item) {
  return `
    <article class="card ${statusClass(item)}" data-open="${escapeHtml(item.id)}" tabindex="0" role="link" aria-label="${escapeHtml(item.name)}" style="${categoryVars(item.sectionKey, item.categoryKey)}">
      <h3 class="card-title">${escapeHtml(item.name)}</h3>
      ${ingredientChips(item, "small")}
      <div class="card-foot">${statusButtons(item)}</div>
    </article>
  `;
}

// Carte compacte : emoji de la famille, nom, boutons ✕ / ✓.
// La composition s'affiche au clic, dans la fiche détaillée.
function renderMiniCard(item) {
  const sections = getSections();
  const category = sections[item.sectionKey] && sections[item.sectionKey].categories[item.categoryKey];
  return `
    <article class="mini-card ${statusClass(item)}" data-open="${escapeHtml(item.id)}" tabindex="0" role="link" aria-label="${escapeHtml(item.name)}" style="${categoryVars(item.sectionKey, item.categoryKey)}">
      <span class="mini-card-emoji" aria-hidden="true">${escapeHtml((category && category.emoji) || "🍽️")}</span>
      <span class="mini-card-title">${escapeHtml(item.name)}</span>
      ${statusButtons(item)}
    </article>
  `;
}

function renderMiniCards(list) {
  return `<div class="mini-cards">${list.map(renderMiniCard).join("")}</div>`;
}

function renderCards(list) {
  return `<div class="cards">${list.map(renderCard).join("")}</div>`;
}

function progressBar(value, total) {
  return `<div class="bar"><div class="bar-fill" style="width:${percent(value, total)}%"></div></div>`;
}

function backLink(href, label) {
  return `<a class="back-link" href="${href}"><span aria-hidden="true">←</span> ${escapeHtml(label)}</a>`;
}

function renderEmpty(title, message) {
  return `
    <div class="empty">
      <div class="empty-emoji">🍋</div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/*
 * En-tête commun : titre et, si utile, une phrase. Pas de sur-titre :
 * le bouton retour indique déjà où l'on se trouve.
 */
function renderPageHead({ vars, title, lead = "", extra = "" }) {
  return `
    <section class="page-head" style="${vars}">
      <h1 class="page-title">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ""}
      ${extra}
    </section>
  `;
}


// Cercle de score réutilisable (accueil, quizz).
function scoreRing(value, label, vars, href) {
  const inner = `
    <span class="score-ring" style="--p:${value}"><b>${value}%</b></span>
    <span class="score-ring-label">${escapeHtml(label)}</span>`;
  return href
    ? `<a class="score-ring-item" href="${href}" style="${vars}" aria-label="${escapeHtml(label)} : ${value} %">${inner}</a>`
    : `<div class="score-ring-item" style="${vars}">${inner}</div>`;
}
