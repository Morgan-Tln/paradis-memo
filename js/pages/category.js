"use strict";

/*
 * js/pages/category.js
 * Page d'une famille (cartes deux par deux).
 */

function renderCategoryPage(items, sectionKey, categoryKey) {
  const list = itemsOf(items, sectionKey, categoryKey);
  const short = categoryLabel(sectionKey, categoryKey);
  const done = countKnown(list);

  return `
    ${renderPageHead({
      vars: categoryVars(sectionKey, categoryKey),
      back: { href: sectionHref(sectionKey), label: sectionLabel(sectionKey) },
      title: `<span class="title-count">${list.length}</span> <span class="t">${escapeHtml(short)}</span>`,
      extra: `<div class="head-progress"><span>${done}/${list.length} maîtrisée${done > 1 ? "s" : ""}</span>${progressBar(done, list.length)}</div>`,
    })}
    ${list.length ? renderCards(list) : renderEmpty("Aucune fiche", "Cette famille est vide dans data/menu.js.")}
  `;
}
