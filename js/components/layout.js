"use strict";

/*
 * js/components/layout.js
 * Barre du haut et menu hamburger.
 */

/*
 * ============================================================
 * EN-TÊTE ET MENU HAMBURGER
 * ============================================================
 */

// Barre du haut réduite au bouton du menu, pour une page immersive.
function renderTopbar() {
  return `
    <header class="topbar">
      <button class="burger" data-menu-open aria-label="Ouvrir le menu" aria-expanded="${state.menuOpen}">
        <span></span><span></span><span></span>
      </button>
    </header>
  `;
}

function navIsActive(route, check) {
  return check(route) ? "active" : "";
}

function renderDrawer(items, route) {
  const sections = getSections();
  const known = countKnown(items);
  const review = items.filter((item) => getProgress(item.id) === "review").length;
  const currentItem =
    route.view === "fiche" ? items.find((item) => item.id === route.itemId) : null;
  const currentSection = route.sectionKey || (currentItem && currentItem.sectionKey);
  const currentCategory = route.categoryKey || (currentItem && currentItem.categoryKey);

  const groups = NAV.filter((nav) => sections[nav.key])
    .map((nav) => {
      const section = sections[nav.key];
      const expanded =
        state.expanded[nav.key] !== undefined
          ? state.expanded[nav.key]
          : currentSection === nav.key;
      const categoryKeys = Object.keys(section.categories || {}).filter(
        (categoryKey) => !(nav.hiddenInMenu || []).includes(categoryKey),
      );
      const subs = categoryKeys
        .map((categoryKey) => {
          const count = (section.categories[categoryKey].items || []).length;
          const active =
            (route.view === "categorie" || route.view === "fiche") &&
            currentSection === nav.key &&
            currentCategory === categoryKey;
          return `
            <a class="nav-sublink ${active ? "active" : ""}" href="${categoryHref(nav.key, categoryKey)}" style="${categoryVars(nav.key, categoryKey)}">
              <span class="nav-dot"></span>
              <span class="nav-text">${escapeHtml(categoryLabel(nav.key, categoryKey))}</span>
              <span class="nav-count">${count}</span>
            </a>`;
        })
        .join("");

      return `
        <div class="nav-group ${expanded ? "open" : ""}" data-group-box="${escapeHtml(nav.key)}" style="${sectionVars(nav.key)}">
          <div class="nav-group-head">
            <a class="nav-link ${navIsActive(route, (r) => r.view === "section" && r.sectionKey === nav.key)}" href="${sectionHref(nav.key)}">
              <span class="nav-ico">${nav.emoji}</span>
              <span class="nav-text">${escapeHtml(nav.label)}<small>${Object.keys(section.categories || {}).length} familles</small></span>
            </a>
            <button class="nav-toggle" data-group="${escapeHtml(nav.key)}" aria-expanded="${expanded}" aria-label="${expanded ? "Masquer" : "Afficher"} les familles : ${escapeHtml(nav.label)}" title="${expanded ? "Masquer" : "Afficher"} les familles">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <div class="nav-sub">${subs}</div>
        </div>`;
    })
    .join("");

  return `
    <div class="backdrop ${state.menuOpen ? "show" : ""}" data-menu-close></div>
    <aside class="drawer ${state.menuOpen ? "open" : ""}" aria-label="Menu principal" aria-hidden="${!state.menuOpen}">
      <div class="drawer-head">
        <div class="drawer-brand">Paradis du Fruit</div>
        <button class="icon-btn" data-menu-close aria-label="Fermer le menu">✕</button>
      </div>
      <nav class="drawer-nav">
        <a class="nav-link solo ${navIsActive(route, (r) => r.view === "accueil")}" href="#/"><span class="nav-ico">🏠</span><span class="nav-text">Accueil</span></a>
        ${groups}
        <div class="nav-sep"></div>
        <a class="nav-link solo ${navIsActive(route, (r) => r.view === "revoir")}" href="#/revoir"><span class="nav-ico">📈</span><span class="nav-text">Ma progression</span>${review ? `<span class="nav-pill">${review}</span>` : ""}</a>
        <a class="nav-link solo ${navIsActive(route, (r) => r.view === "quiz")}" href="#/quiz"><span class="nav-ico">🎯</span><span class="nav-text">Quizz</span></a>
        <a class="nav-link solo ${navIsActive(route, (r) => r.view === "entrainement")}" href="#/entrainement"><span class="nav-ico">🧑‍🍳</span><span class="nav-text">Entraînement</span></a>
      </nav>
      <div class="drawer-foot">
        <div class="drawer-foot-row"><span>Progression</span><b>${known}/${items.length} (${percent(known, items.length)} %)</b></div>
        ${progressBar(known, items.length)}
      </div>
    </aside>
  `;
}

function setMenu(open) {
  state.menuOpen = open;
  const drawer = $(".drawer");
  const backdrop = $(".backdrop");
  const burger = $(".burger");
  if (drawer) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
  }
  if (backdrop) backdrop.classList.toggle("show", open);
  if (burger) burger.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}
