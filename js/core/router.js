"use strict";

/*
 * js/core/router.js
 * Navigation par adresse (#/...) : pages, liens, bouton retour, défilement.
 */

/*
 * Routage par hash : le bouton « retour » du téléphone fonctionne,
 * et chaque page a sa propre adresse (compatible GitHub Pages).
 *   #/                     Accueil
 *   #/s/plats              Page d'une section
 *   #/c/plats/pitas        Cartes d'une catégorie
 *   #/f/<id de fiche>      Détail d'une fiche
 *   #/revoir  #/quiz  #/entrainement
 */
function parseRoute() {
  const parts = location.hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch (_) {
        return part;
      }
    });
  const [type, a, b] = parts;
  const sections = getSections() || {};

  if (type === "s" && sections[a]) return { view: "section", sectionKey: a };
  if (type === "c" && sections[a] && sections[a].categories[b])
    return { view: "categorie", sectionKey: a, categoryKey: b };
  if (type === "f" && a) return { view: "fiche", itemId: a };
  if (type === "revoir" || type === "quiz" || type === "entrainement")
    return { view: type };
  return { view: "accueil" };
}

function sectionHref(sectionKey) {
  return `#/s/${encodeURIComponent(sectionKey)}`;
}

function categoryHref(sectionKey, categoryKey) {
  return `#/c/${encodeURIComponent(sectionKey)}/${encodeURIComponent(categoryKey)}`;
}

function itemHref(item) {
  return `#/f/${encodeURIComponent(item.id)}`;
}


// Position de défilement par page : en revenant d'une fiche,
// on retrouve la liste là où on l'avait laissée.
const scrollMemory = {};
let previousRoute = null;
let previousHash = null;

/*
 * Bouton retour : rendu hors du contenu centré, pour rester aligné
 * à gauche avec le bouton du menu.
 */
function backFor(route, items) {
  if (route.view === "section" || route.view === "revoir")
    return { href: "#/", label: "Accueil", vars: route.sectionKey ? sectionVars(route.sectionKey) : paletteVars(paletteFromHue(352)) };
  if (route.view === "categorie")
    return {
      href: sectionHref(route.sectionKey),
      label: sectionLabel(route.sectionKey),
      vars: categoryVars(route.sectionKey, route.categoryKey),
    };
  if (route.view === "fiche") {
    const item = items.find((entry) => entry.id === route.itemId);
    if (!item) return { href: "#/", label: "Accueil", vars: "" };
    return {
      href: categoryHref(item.sectionKey, item.categoryKey),
      label: categoryLabel(item.sectionKey, item.categoryKey),
      vars: categoryVars(item.sectionKey, item.categoryKey),
    };
  }
  return null;
}

// Couleur de la page (fond dégradé très léger), selon la page affichée.
function pageVars(route, items) {
  if (route.view === "section") return sectionVars(route.sectionKey);
  if (route.view === "categorie") return categoryVars(route.sectionKey, route.categoryKey);
  if (route.view === "fiche") {
    const item = items.find((entry) => entry.id === route.itemId);
    return item ? categoryVars(item.sectionKey, item.categoryKey) : "";
  }
  if (route.view === "revoir") return paletteVars(paletteFromHue(352));
  if (route.view === "quiz") return paletteVars(paletteFromHue(250));
  if (route.view === "entrainement") return paletteVars(paletteFromHue(205));
  return "";
}

// Le navigateur ne doit pas recaler le scroll tout seul au changement de page.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function scrollPageTo(y) {
  const top = y || 0;
  window.scrollTo(0, top);
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}

function onRouteChange() {
  const newHash = location.hash || "#/";
  const cameFromItem = previousRoute && previousRoute.view === "fiche";
  if (previousHash !== null) scrollMemory[previousHash] = window.scrollY;

  setMenu(false);
  state.filtersOpen = false;
  state.filterDraft = null;
  render();

  // En revenant d'une fiche, on retrouve la liste. Sinon, toujours en haut.
  const restore = cameFromItem && scrollMemory[newHash] !== undefined;
  const y = restore ? scrollMemory[newHash] : 0;
  scrollPageTo(y);
  requestAnimationFrame(() => scrollPageTo(y));

  previousRoute = state.route;
  previousHash = newHash;
}
