"use strict";

/*
 * js/pages/progress.js
 * Page Ma progression.
 */

/*
 * Ma progression : deux onglets (non maîtrisées / maîtrisées), et les cartes
 * rangées par famille, dans l'ordre du menu. Accordéon : une famille ouverte
 * à la fois, pour éviter une liste de 180 cartes.
 */
function renderReviewPage(items) {
  const tab = state.reviewTab === "known" ? "known" : "review";
  const counts = {
    review: items.filter((item) => getProgress(item.id) === "review").length,
    known: items.filter((item) => getProgress(item.id) === "known").length,
  };
  const list = items.filter((item) => getProgress(item.id) === tab);
  const sections = getSections();

  // Accordéon : une seule famille ouverte à la fois (évite les pages sans fin).
  const groups = [];
  Object.keys(sections).forEach((sectionKey) => {
    Object.keys(sections[sectionKey].categories || {}).forEach((categoryKey) => {
      const cards = list.filter(
        (item) => item.sectionKey === sectionKey && item.categoryKey === categoryKey,
      );
      if (!cards.length) return;
      const key = `${tab}:${sectionKey}.${categoryKey}`;
      groups.push({ sectionKey, categoryKey, cards, key, open: state.reviewOpenKey === key });
    });
  });

  // Une seule famille dans la liste : on l'ouvre directement.
  if (groups.length === 1) groups[0].open = true;

  const groupHtml = groups
    .map(
      (group) => `
      <div class="review-group ${group.open ? "open" : ""}" data-group-key="${escapeHtml(group.key)}" style="${categoryVars(group.sectionKey, group.categoryKey)}">
        <button class="review-head" data-review-group="${escapeHtml(group.key)}" aria-expanded="${group.open}">
          <span class="nav-dot"></span>
          <span class="review-name">${escapeHtml(categoryLabel(group.sectionKey, group.categoryKey))}<small>${escapeHtml(sectionLabel(group.sectionKey))}</small></span>
          <span class="review-count">${group.cards.length}</span>
          <svg class="review-chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        ${group.open ? `<div class="review-body">${renderMiniCards(group.cards)}</div>` : ""}
      </div>`,
    )
    .join("");

  return `
    ${renderPageHead({
      vars: paletteVars(paletteFromHue(352)),
      title: `<span class="t">Ma progression</span>`,
      lead: "Tes cartes rangées par famille. Touche ✕ ou ✓ pour changer leur statut, touche une carte pour le détail.",
    })}

    <div class="review-toolbar">
      <div class="segmented" role="tablist">
        <button class="seg ko ${tab === "review" ? "active" : ""}" data-review-tab="review" role="tab" aria-selected="${tab === "review"}">✕ Non maîtrisées <b>${counts.review}</b></button>
        <button class="seg ok ${tab === "known" ? "active" : ""}" data-review-tab="known" role="tab" aria-selected="${tab === "known"}">✓ Maîtrisées <b>${counts.known}</b></button>
      </div>
    </div>

    ${
      groups.length
        ? `<div class="review-groups">${groupHtml}</div>`
        : tab === "review"
          ? renderEmpty("Rien à revoir", "Marque une carte avec ✕ pour la retrouver ici.")
          : renderEmpty("Aucune carte maîtrisée", "Marque une carte avec ✓ quand tu la connais.")
    }
  `;
}
