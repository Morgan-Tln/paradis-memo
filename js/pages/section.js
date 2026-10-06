"use strict";

/*
 * js/pages/section.js
 * Page d'une partie de la carte (Les plats, Boissons…).
 */

function renderSectionPage(items, sectionKey) {
  const section = getSections()[sectionKey];
  const list = itemsOf(items, sectionKey);
  const categoryKeys = Object.keys(section.categories || {});
  const done = countKnown(list);

  const tiles = categoryKeys
    .map((categoryKey) => {
      const category = section.categories[categoryKey];
      const catItems = itemsOf(items, sectionKey, categoryKey);
      const catDone = countKnown(catItems);
      return `
        <a class="tile tile-category" href="${categoryHref(sectionKey, categoryKey)}" style="${categoryVars(sectionKey, categoryKey)}">
          <span class="tile-emoji">${escapeHtml(category.emoji || "🍽️")}</span>
          <span class="tile-title">${escapeHtml(categoryLabel(sectionKey, categoryKey))}</span>
          <span class="tile-meta">${catItems.length} fiche${catItems.length > 1 ? "s" : ""}, ${catDone} maîtrisée${catDone > 1 ? "s" : ""}</span>
          ${progressBar(catDone, catItems.length)}
        </a>`;
    })
    .join("");

  return `
    ${renderPageHead({
      vars: sectionVars(sectionKey),
      back: { href: "#/", label: "Accueil" },
      title: `<span class="t">${escapeHtml(sectionLabel(sectionKey))}</span>`,
      lead: `${categoryKeys.length} familles et ${list.length} fiches. Choisis une famille pour réviser ses cartes.`,
      extra: `<div class="head-progress"><span>${done}/${list.length} maîtrisée${done > 1 ? "s" : ""}</span>${progressBar(done, list.length)}</div>`,
    })}
    <div class="tiles">${tiles}</div>
  `;
}
