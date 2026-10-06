"use strict";

/*
 * js/pages/item.js
 * Page détail d'une fiche.
 */

function renderItemPage(items, itemId) {
  const item = items.find((entry) => entry.id === itemId);
  if (!item)
    return `${renderEmpty("Fiche introuvable", "Elle a peut-être été renommée dans data/menu.js.")}`;

  const siblings = itemsOf(items, item.sectionKey, item.categoryKey);
  const index = siblings.findIndex((entry) => entry.id === item.id);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];
  const short = categoryLabel(item.sectionKey, item.categoryKey);

  return `
    <div class="detail" style="${categoryVars(item.sectionKey, item.categoryKey)}">
      <section class="detail-hero ${statusClass(item)}">
        <h1 class="detail-title">${escapeHtml(item.name)}</h1>
        ${statusButtons(item, true)}
      </section>

      ${
        (item.ingredients || []).length
          ? `<section class="detail-block"><h2 class="detail-label">Composition</h2>${ingredientChips(item)}</section>`
          : ""
      }
      ${
        item.memo
          ? `<section class="detail-block memo"><h2 class="detail-label">Mémo</h2><p>${escapeHtml(item.memo)}</p></section>`
          : ""
      }
      <section class="detail-block allergens-block"><h2 class="detail-label">Allergènes</h2>${renderAllergenBox(item)}</section>

      <nav class="pager">
        ${prev ? `<a class="pager-link" href="${itemHref(prev)}"><small>‹ Précédent</small><span>${escapeHtml(prev.name)}</span></a>` : `<span></span>`}
        ${next ? `<a class="pager-link next" href="${itemHref(next)}"><small>Suivant ›</small><span>${escapeHtml(next.name)}</span></a>` : `<span></span>`}
      </nav>
    </div>
  `;
}
