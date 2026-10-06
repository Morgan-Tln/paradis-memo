"use strict";

/*
 * js/core/menu.js
 * Accès aux fiches de la carte (data/menu.js) : liste à plat, ids stables, recherches simples.
 */

function getSections() {
  return window.SECTIONS && typeof window.SECTIONS === "object"
    ? window.SECTIONS
    : null;
}

/*
 * Id stable d'une fiche : ne dépend plus de sa position dans la liste.
 * Insérer ou déplacer un produit ne décale donc plus la progression.
 * Si deux fiches portent le même nom dans une catégorie, la 2e reçoit "-2", etc.
 */
function makeItemId(sectionKey, categoryKey, name, usedIds) {
  const base = `${sectionKey}__${categoryKey}__${slugify(name)}`;
  let id = base;
  let n = 2;
  while (usedIds.has(id)) id = `${base}-${n++}`;
  usedIds.add(id);
  return id;
}

let flatCache = null;

function flattenItems() {
  const sections = getSections();
  if (!sections) return [];
  if (flatCache && flatCache.sections === sections) return flatCache.items;
  const out = [];
  const usedIds = new Set();

  Object.entries(sections).forEach(([sectionKey, section]) => {
    Object.entries(section.categories || {}).forEach(
      ([categoryKey, category]) => {
        (category.items || []).forEach((item) => {
          const id = makeItemId(sectionKey, categoryKey, item.name, usedIds);
          out.push({
            ...item,
            id,
            sectionKey,
            sectionLabel: section.label || sectionKey,
            categoryKey,
            categoryLabel: category.label || categoryKey,
            categoryEmoji: category.emoji || "🍽️",
          });
        });
      },
    );
  });

  flatCache = { sections, items: out };
  return out;
}

function itemText(item) {
  return normalizeText(
    `${item.name || ""} ${(item.ingredients || []).join(" ")} ${item.memo || ""} ${item.trap || ""} ${item.warning || ""} ${item.categoryLabel || ""} ${item.sectionLabel || ""}`,
  );
}

function has(item, term) {
  return itemText(item).includes(normalizeText(term));
}

function containsAny(item, terms) {
  return containsAnyText(itemText(item), terms);
}

function containsNone(item, terms) {
  return !containsAny(item, terms);
}

function itemsOf(items, sectionKey, categoryKey) {
  return items.filter(
    (item) =>
      item.sectionKey === sectionKey &&
      (!categoryKey || item.categoryKey === categoryKey),
  );
}

function countKnown(items) {
  return items.filter((item) => getProgress(item.id) === "known").length;
}

function isAlcoholItem(item) {
  if (!item || item.sectionKey !== "boissons") return false;
  const alcoholicCategories = new Set([
    "spritz",
    "margaritas_daiquiris",
    "pina_coladas",
    "mixologie_fine",
  ]);
  if (alcoholicCategories.has(item.categoryKey)) return true;
  if (item.categoryKey === "mojitos")
    return !containsAnyText(item.name, ["virgin"]);
  if (item.categoryKey === "eaux_bieres_vins") {
    return containsAnyText(item.name, [
      "gallia",
      "ipa",
      "cidre",
      "vin blanc",
      "vin rouge",
      "vin rose",
      "rosé",
      "orsuro",
      "belleruche",
    ]);
  }
  return false;
}
