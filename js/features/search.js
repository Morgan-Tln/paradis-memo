"use strict";

/*
 * js/features/search.js
 * Recherche et filtres (modale) de l'accueil.
 */

/*
 * Filtres de recherche. Chaque groupe est à choix unique
 * (un 2e appui sur un filtre actif le désactive), sauf les allergènes
 * qui se cumulent.
 */
const FILTER_GROUPS = [
  {
    key: "section",
    label: "Partie de la carte",
    options: [
      { value: "plats", label: "🍽️ Plats" },
      { value: "saveurs", label: "🥢 Saveurs" },
      { value: "boissons", label: "🍹 Boissons" },
      { value: "desserts", label: "🍨 Desserts" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { value: "veggie", label: "🌱 Sans viande ni poisson" },
      { value: "sans-alcool", label: "🧃 Boisson sans alcool" },
      { value: "alcool", label: "🍸 Avec alcool" },
    ],
  },
];

function activeFilterCount() {
  const f = state.filters;
  return (f.section ? 1 : 0) + (f.type ? 1 : 0) + state.excludeAllergens.length;
}

function isSearching() {
  return Boolean(normalizeText(state.query)) || activeFilterCount() > 0;
}

function renderSearchBox() {
  const count = activeFilterCount();
  return `
    <section class="search-box">
      <div class="search-row">
        <div class="search-field">
          <span aria-hidden="true">🔎</span>
          <input class="input" id="searchInput" type="search" value="${escapeHtml(state.query)}" placeholder="Nom ou ingrédient : saumon, mangue, chèvre…" autocomplete="off" enterkeyhint="search">
          ${state.query ? `<button class="search-clear" data-search-clear aria-label="Effacer la recherche">✕</button>` : ""}
        </div>
        <button class="filters-btn ${count ? "has" : ""}" data-filters-open aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
          <span>Filtres</span>${count ? `<b>${count}</b>` : ""}
        </button>
      </div>
    </section>
  `;
}

/*
 * Modale des filtres : on modifie un brouillon, appliqué seulement
 * au clic sur « Appliquer ». Fermer sans appliquer annule les changements.
 */
function openFilters() {
  state.filterDraft = {
    filters: { ...state.filters },
    exclude: [...state.excludeAllergens],
    memo: state.searchMemo,
  };
  state.filtersOpen = true;
  render();
}

function closeFilters(apply) {
  if (apply && state.filterDraft) {
    state.filters = { ...state.filterDraft.filters };
    state.excludeAllergens = [...state.filterDraft.exclude];
    state.searchMemo = state.filterDraft.memo;
  }
  state.filtersOpen = false;
  state.filterDraft = null;
  render();
}

function renderFilterModal() {
  if (!state.filtersOpen || !state.filterDraft) return "";
  const draft = state.filterDraft;
  const draftCount =
    (draft.filters.section ? 1 : 0) + (draft.filters.type ? 1 : 0) + draft.exclude.length;

  const groups = FILTER_GROUPS.map(
    (group) => `
      <div class="filter-group">
        <div class="filter-label">${escapeHtml(group.label)}</div>
        <div class="chip-row">
          ${group.options
            .map((option) => {
              const active = draft.filters[group.key] === option.value;
              return `<button class="filter-chip ${active ? "active" : ""}" data-draft-filter="${group.key}" data-value="${option.value}" aria-pressed="${active}">${escapeHtml(option.label)}</button>`;
            })
            .join("")}
        </div>
      </div>`,
  ).join("");

  return `
    <div class="modal-backdrop" data-filters-cancel></div>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="filtersTitle">
      <div class="modal-head">
        <h2 class="modal-title" id="filtersTitle">Filtres</h2>
        <button class="icon-btn" data-filters-cancel aria-label="Fermer sans appliquer">✕</button>
      </div>
      <div class="modal-body">
        ${groups}
        <div class="filter-group">
          <div class="filter-label">Sans allergène <span class="filter-hint">fiches officielles uniquement</span></div>
          <div class="chip-row">
            ${ALLERGENS.map((allergen) => {
              const active = draft.exclude.includes(allergen.id);
              return `<button class="filter-chip allergen ${active ? "active" : ""}" data-draft-exclude="${escapeHtml(allergen.id)}" aria-pressed="${active}">Sans ${escapeHtml(allergen.label.toLowerCase())}</button>`;
            }).join("")}
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" data-draft-memo ${draft.memo ? "checked" : ""}>
          <span>Chercher aussi dans les mémos</span>
        </label>
      </div>
      <div class="modal-foot">
        <button class="link-btn" data-draft-clear ${draftCount || draft.memo ? "" : "disabled"}>Tout effacer</button>
        <button class="action-btn primary" data-filters-apply>Appliquer${draftCount ? ` (${draftCount})` : ""}</button>
      </div>
    </div>
  `;
}

const MEAT_FISH_WORDS = [
  "poulet", "dinde", "pastrami", "boeuf", "jambon", "bacon", "chorizo",
  "porc", "canard", "thon", "saumon", "merlu", "limande", "crevette",
  "homard", "lobster", "poisson", "anchois", "gravlax", "fish", "crabe",
  "calmar",
];

// Indicatif, d'après la composition et les allergènes officiels.
function isMeatFree(item) {
  if (item.sectionKey !== "plats" && item.sectionKey !== "saveurs") return false;
  // Formules et brunch : composés au choix ou boissons, pas pertinents ici.
  if (item.categoryKey === "formules" || item.categoryKey === "brunch") return false;
  const text = `${item.name} ${(item.ingredients || []).join(" ")}`;
  if (containsAnyText(text, ["au choix", "liste des"])) return false;
  const words = wordsOf(text);
  if (MEAT_FISH_WORDS.some((term) => words.some((word) => word.startsWith(term))))
    return false;
  const info = getItemAllergens(item);
  if (
    info.status === "officiel" &&
    info.contient.some((id) => ["poissons", "crustaces", "mollusques"].includes(id))
  )
    return false;
  return true;
}

function searchItems(items) {
  const f = state.filters;
  let list = items;

  if (f.section) list = list.filter((item) => item.sectionKey === f.section);
  if (f.type === "veggie") list = list.filter(isMeatFree);
  if (f.type === "alcool") list = list.filter(isAlcoholItem);
  if (f.type === "sans-alcool")
    list = list.filter((item) => item.sectionKey === "boissons" && !isAlcoholItem(item));

  const q = normalizeText(state.query);
  if (!q) return list;

  // Raccourcis tapés à la main (anciens mots-clés).
  if (q === "alcool" || q === "alcoolise") return list.filter(isAlcoholItem);
  if (q === "sans alcool")
    return list.filter((item) => item.sectionKey === "boissons" && !isAlcoholItem(item));
  if (q === "veggie" || q === "vegetarien" || q === "vegetarienne")
    return list.filter(isMeatFree);

  const tokens = wordsOf(q);
  const scored = [];
  list.forEach((item) => {
    const nameWords = wordsOf(item.name);
    const fieldWords = [
      ...nameWords,
      ...wordsOf((item.ingredients || []).join(" ")),
      ...(state.searchMemo ? wordsOf(`${item.memo || ""}`) : []),
    ];
    if (!hasWordPrefix(fieldWords, tokens)) return;
    scored.push({ item, score: hasWordPrefix(nameWords, tokens) ? 2 : 1 });
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}

function renderSearchResults(items) {
  const excluded = state.excludeAllergens;
  let results = searchItems(items);
  let hiddenUnknown = 0;

  // Filtre « sans allergène » : seules les fiches officiellement renseignées
  // et sans les allergènes cochés sont gardées.
  if (excluded.length) {
    hiddenUnknown = results.filter(
      (item) => getItemAllergens(item).status !== "officiel",
    ).length;
    results = results.filter((item) => withoutAllergens(item, excluded));
  }

  const total = results.length;
  results = results.slice(0, 80);
  const notes = [];
  if (state.filters.type === "veggie")
    notes.push("« Sans viande ni poisson » est déduit de la composition : à confirmer pour un végétarien strict (sauces, bouillons).");
  if (excluded.length)
    notes.push(`Sans ${allergenLabels(excluded).join(", ").toLowerCase()}.${hiddenUnknown ? ` ${hiddenUnknown} fiche${hiddenUnknown > 1 ? "s" : ""} sans allergènes renseignés masquée${hiddenUnknown > 1 ? "s" : ""}.` : ""} Toujours confirmer avec la cuisine (contamination croisée).`);

  return `
    <div class="results-head">
      <h2 class="block-title">${total} résultat${total > 1 ? "s" : ""}</h2>
      ${total > 80 ? `<span class="muted">80 premiers affichés</span>` : ""}
    </div>
    ${notes.map((note) => `<p class="note">${escapeHtml(note)}</p>`).join("")}
    ${results.length ? renderCards(results) : renderEmpty("Aucun résultat", excluded.length ? "Aucune fiche renseignée ne correspond à ces critères pour l'instant." : state.searchMemo ? "Essaie un mot plus court ou retire un filtre." : "Essaie un mot plus court, retire un filtre, ou coche « Chercher aussi dans les mémos ».")}
  `;
}
