"use strict";

/*
 * js/features/allergens.js
 * Allergènes officiels (data/allergens.js) : lecture, affichage, contrôle.
 */

/*
 * ============================================================
 * ALLERGÈNES OFFICIELS
 * ============================================================
 *
 * Source unique : data/allergens.js (window.ALLERGEN_LIST + window.ITEM_ALLERGENS).
 * Aucune déduction à partir des ingrédients.
 *
 * getItemAllergens(item) renvoie :
 *   { status: "officiel", contient: [ids], traces: [ids] }
 *   { status: "selon",    note: "..." }           → dépend du choix client
 *   { status: "inconnu" }                         → fiche non renseignée
 * ============================================================
 */

const ALLERGENS = Array.isArray(window.ALLERGEN_LIST)
  ? window.ALLERGEN_LIST
  : [];

const ALLERGEN_BY_ID = Object.fromEntries(
  ALLERGENS.map((allergen) => [allergen.id, allergen]),
);

// Ignore un éventuel numéro en tête ("15. Demi avocat" = "Demi avocat").
function allergenNameKey(name) {
  return normalizeText(name).replace(/^\d+\s+/, "");
}

function allergenLookupKey(sectionKey, categoryKey, name) {
  return `${sectionKey}__${categoryKey}__${allergenNameKey(name)}`;
}

let allergenIndex = null;

function getAllergenIndex() {
  if (allergenIndex) return allergenIndex;
  allergenIndex = new Map();
  const source = window.ITEM_ALLERGENS || {};

  Object.entries(source).forEach(([sectionKey, categories]) => {
    Object.entries(categories || {}).forEach(([categoryKey, entries]) => {
      Object.entries(entries || {}).forEach(([name, raw]) => {
        allergenIndex.set(allergenLookupKey(sectionKey, categoryKey, name), {
          name,
          sectionKey,
          categoryKey,
          raw,
        });
      });
    });
  });

  return allergenIndex;
}

function sortAllergenIds(ids) {
  const order = ALLERGENS.map((allergen) => allergen.id);
  return unique(ids).sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

function getItemAllergens(item) {
  const entry = getAllergenIndex().get(
    allergenLookupKey(item.sectionKey, item.categoryKey, item.name),
  );
  if (!entry) return { status: "inconnu", contient: [], traces: [] };

  const raw = entry.raw;
  if (Array.isArray(raw))
    return { status: "officiel", contient: sortAllergenIds(raw), traces: [] };

  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.contient) || Array.isArray(raw.traces)) {
      return {
        status: "officiel",
        contient: sortAllergenIds(raw.contient || []),
        traces: sortAllergenIds(raw.traces || []),
        note: raw.note || "",
      };
    }
    if (raw.note)
      return { status: "selon", contient: [], traces: [], note: raw.note };
  }

  return { status: "inconnu", contient: [], traces: [] };
}

function allergenLabel(id) {
  return (ALLERGEN_BY_ID[id] && ALLERGEN_BY_ID[id].label) || id;
}

function allergenLabels(ids) {
  return ids.map(allergenLabel);
}

// true si la fiche est officiellement renseignée et ne contient (ni en traces)
// aucun des allergènes demandés. Une fiche non renseignée renvoie false.
function withoutAllergens(item, allergenIds) {
  const info = getItemAllergens(item);
  if (info.status !== "officiel") return false;
  return allergenIds.every(
    (id) => !info.contient.includes(id) && !info.traces.includes(id),
  );
}

function allergenChip(id, extraClass = "") {
  const allergen = ALLERGEN_BY_ID[id];
  const color = (allergen && allergen.color) || {
    bg: "#eee",
    text: "#333",
    border: "#ccc",
  };
  return `<span class="allergen-chip ${extraClass}" style="background:${escapeHtml(color.bg)};color:${escapeHtml(color.text)};border-color:${escapeHtml(color.border)}">${escapeHtml(allergenLabel(id))}</span>`;
}

function renderAllergenBox(item) {
  const info = getItemAllergens(item);

  if (info.status === "inconnu") {
    return `<div class="allergen-missing">Allergènes non renseignés · demander en cuisine</div>`;
  }

  if (info.status === "selon") {
    return `<div class="info-box allergens"><div class="box-title">Allergènes</div><div class="box-text">${escapeHtml(info.note)}</div></div>`;
  }

  const contient = info.contient.length
    ? `<div class="allergen-chips">${info.contient.map((id) => allergenChip(id)).join("")}</div>`
    : `<div class="box-text">Aucun allergène déclaré sur la fiche officielle.</div>`;
  const traces = info.traces.length
    ? `<div class="allergen-traces"><span class="allergen-traces-label">Traces possibles</span><div class="allergen-chips">${info.traces.map((id) => allergenChip(id, "trace")).join("")}</div></div>`
    : "";
  const note = info.note
    ? `<div class="box-text" style="margin-top:6px">${escapeHtml(info.note)}</div>`
    : "";

  return `<div class="info-box allergens"><div class="box-title">Allergènes · fiche officielle</div>${contient}${traces}${note}</div>`;
}

/*
 * Contrôle de cohérence affiché dans la console (F12) au chargement.
 * Sert à repérer une faute de frappe dans data/allergens.js.
 */
function validateAllergenData(items) {
  const index = getAllergenIndex();
  const itemKeys = new Set(
    items.map((item) =>
      allergenLookupKey(item.sectionKey, item.categoryKey, item.name),
    ),
  );
  const unknownIds = [];
  const unmatched = [];

  index.forEach((entry, key) => {
    if (!itemKeys.has(key))
      unmatched.push(`${entry.sectionKey} › ${entry.categoryKey} › "${entry.name}"`);

    const raw = entry.raw;
    const ids = Array.isArray(raw)
      ? raw
      : [...((raw && raw.contient) || []), ...((raw && raw.traces) || [])];
    ids.forEach((id) => {
      if (!ALLERGEN_BY_ID[id]) unknownIds.push(`"${id}" dans "${entry.name}"`);
    });
  });

  const counts = { officiel: 0, selon: 0, inconnu: 0 };
  const missing = [];
  items.forEach((item) => {
    const status = getItemAllergens(item).status;
    counts[status] += 1;
    if (status === "inconnu")
      missing.push(`${item.sectionKey} › ${item.categoryKey} › ${item.name}`);
  });

  console.groupCollapsed(
    `🧾 Allergènes : ${counts.officiel} fiche(s) officielle(s), ${counts.selon} « selon choix », ${counts.inconnu} non renseignée(s) sur ${items.length}`,
  );
  if (unknownIds.length)
    console.warn("Ids d'allergènes inconnus :", unknownIds);
  if (unmatched.length)
    console.warn(
      "Noms dans data/allergens.js qui ne correspondent à aucune fiche de data/menu.js :",
      unmatched,
    );
  if (missing.length) console.info("Fiches non renseignées :", missing);
  console.groupEnd();

  if (!ALLERGENS.length)
    console.error("data/allergens.js n'est pas chargé. Vérifie index.html.");
}
