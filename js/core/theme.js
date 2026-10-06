"use strict";

/*
 * js/core/theme.js
 * Menu de navigation (ordre, libellés courts) et couleurs de chaque famille.
 */

/*
 * ============================================================
 * NAVIGATION ET COULEURS
 * ============================================================
 *
 * NAV définit l'ordre et les libellés courts du menu hamburger.
 * Les catégories absentes de NAV s'affichent quand même (libellé de data/menu.js),
 * mais seulement dans la page de la section, pas dans le menu.
 *
 * Chaque section a une teinte de base (hue). Ses catégories reçoivent
 * des teintes voisines : chaque famille a sa couleur, sans casser l'ensemble.
 * ============================================================
 */

const NAV = [
  {
    key: "plats",
    label: "Les plats",
    emoji: "🍽️",
    hue: 18,
    categories: {
      pitas: "Pitas Toastées",
      avocado: "Avocado Toast Party",
      salades: "La vie est belle en Salade",
      chaud_toast: "Chaud le Toast !",
      street_paradis: "Street Paradis",
      marmites: "Les Marmites Magiques !",
      brunch: "Brunch & Formules",
    },
  },
  {
    key: "saveurs",
    label: "Les saveurs",
    emoji: "🥢",
    hue: 140,
    categories: {
      assiettes: "23 Saveurs pour Assiettes",
      accompagnements: "Accompagnements",
      formules: "Formules",
    },
    // La catégorie des 23 saveurs est accessible depuis la page « Les saveurs ».
    hiddenInMenu: ["assiettes"],
  },
  {
    key: "boissons",
    label: "Boissons",
    emoji: "🍹",
    hue: 192,
    categories: {
      presses: "Pressés Minute & Détox",
      cocktails_stars: "Cocktails Stars",
      cocktails_composer: "Cocktails à Composer",
      bulles: "Dans ta Bulle XXL",
      granites: "Granités Paradis",
      elixirs: "Elixirs XXL du Paradis",
      spritz: "Spritz Paradis",
      margaritas_daiquiris: "Margaritas & Daïquiris",
      mojitos: "Mojitos Paradis",
      pina_coladas: "Pina Coladas",
      mixologie_fine: "Mixologie Fine",
      eaux_bieres_vins: "Eaux, Bières, Cidre & Vins",
      chaudes: "Coffee Shop & Thés Bio",
    },
  },
  {
    key: "desserts",
    label: "Desserts",
    emoji: "🍨",
    hue: 335,
    categories: {
      creations: "Desserts Créations",
      gaufres: "Gaufres Très Gourmandes",
      trop_choux: "Trop Choux !",
      pancakes: "Pancakes du Paradis",
      gros_desserts: "Gros Desserts & Gourmands",
      yolita: "Yolita d'Amour",
      coupes_glacees: "Coupes Glacées du Paradis",
      glaces_sorbets: "Glaces & Sorbets",
    },
  },
];

function navSection(sectionKey) {
  return NAV.find((entry) => entry.key === sectionKey) || null;
}

function sectionLabel(sectionKey) {
  const nav = navSection(sectionKey);
  const section = getSections()[sectionKey];
  return (nav && nav.label) || (section && section.label) || sectionKey;
}

function sectionEmoji(sectionKey) {
  const nav = navSection(sectionKey);
  return (nav && nav.emoji) || "🍽️";
}

function categoryLabel(sectionKey, categoryKey) {
  const nav = navSection(sectionKey);
  const section = getSections()[sectionKey];
  const category = section && section.categories[categoryKey];
  return (
    (nav && nav.categories[categoryKey]) ||
    (category && category.label) ||
    categoryKey
  );
}

function hsl(h, s, l) {
  const hue = Math.round(((h % 360) + 360) % 360);
  return `hsl(${hue} ${s}% ${l}%)`;
}

/*
 * Palette d'une teinte. Les tons chauds (orange, jaune) sont un peu plus
 * saturés et plus clairs : sinon ils virent au marron.
 */
function paletteFromHue(h) {
  const hue = ((h % 360) + 360) % 360;
  const warm = hue >= 15 && hue <= 70;
  const sat = warm ? 74 : 60;
  return {
    main: hsl(h, sat, warm ? 50 : 46),
    strong: hsl(h, sat, warm ? 38 : 34),
    soft: hsl(h, 85, 97),
    soft2: hsl(h, 75, 91),
    ink: hsl(h, 55, 22),
    // Deuxième teinte, décalée, pour les dégradés (titres, tuiles).
    alt: hsl(h + 26, warm ? 74 : 64, 52),
    // Fond des tuiles : coloré mais mat (entre vif et doux).
    tile1: hsl(h, warm ? 66 : 54, 52),
    tile2: hsl(h + 22, warm ? 66 : 56, 54),
  };
}

function sectionHue(sectionKey) {
  const nav = navSection(sectionKey);
  return nav ? nav.hue : 150;
}

function categoryHue(sectionKey, categoryKey) {
  const section = getSections()[sectionKey];
  const keys = Object.keys((section && section.categories) || {});
  const index = Math.max(0, keys.indexOf(categoryKey));
  const count = keys.length;
  // Écart de teinte entre familles : assez grand pour bien les distinguer.
  const spread = Math.min(110, 18 * (count - 1));
  const offset = count > 1 ? (index / (count - 1) - 0.5) * spread : 0;
  return sectionHue(sectionKey) + offset;
}

function paletteVars(palette) {
  return `--c:${palette.main};--c-strong:${palette.strong};--c-soft:${palette.soft};--c-soft2:${palette.soft2};--c-ink:${palette.ink};--c2:${palette.alt};--tile1:${palette.tile1};--tile2:${palette.tile2}`;
}

function sectionVars(sectionKey) {
  return paletteVars(paletteFromHue(sectionHue(sectionKey)));
}

function categoryVars(sectionKey, categoryKey) {
  return paletteVars(paletteFromHue(categoryHue(sectionKey, categoryKey)));
}
