"use strict";

/*
 * js/app.js
 * Point d'entrée : rendu global, événements, démarrage.
 */

// Après ouverture d'un accordéon, on ramène son titre en haut de l'écran.
function revealGroup(key) {
  const element = document.querySelector(`[data-group-key="${key}"]`);
  if (element && element.classList.contains("open"))
    element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function render() {
  const root = $("#root");
  const sections = getSections();

  if (!root) return;
  if (!sections) {
    root.innerHTML = `
      <div class="app-error">
        <strong>Données introuvables.</strong>
        <div>Le fichier <b>data/menu.js</b> n'a pas chargé ou ne contient pas <code>window.SECTIONS</code>.</div>
        <div style="margin-top:12px">Vérifie que le dossier <b>data</b> est à côté de <b>index.html</b>.</div>
      </div>
    `;
    return;
  }

  const items = flattenItems();
  const route = parseRoute();
  state.route = route;

  let page = "";
  if (route.view === "accueil") page = renderHome(items);
  if (route.view === "section") page = renderSectionPage(items, route.sectionKey);
  if (route.view === "categorie")
    page = renderCategoryPage(items, route.sectionKey, route.categoryKey);
  if (route.view === "fiche") page = renderItemPage(items, route.itemId);
  if (route.view === "revoir") page = renderReviewPage(items);
  if (route.view === "quiz") page = renderQuizView(items);
  if (route.view === "entrainement") page = renderSituationsView(items);

  const back = backFor(route, items);
  const searchWasFocused =
    document.activeElement && document.activeElement.id === "searchInput";

  root.innerHTML = `
    ${renderTopbar()}
    ${renderDrawer(items, route)}
    ${renderFilterModal()}
    <main class="app view-${route.view}" style="${pageVars(route, items)}">
      <div class="back-row" ${back ? `style="${back.vars}"` : ""}>${back ? backLink(back.href, back.label) : ""}</div>
      <div class="content">${page}</div>
    </main>
  `;
  document.body.classList.toggle("menu-open", state.menuOpen || state.filtersOpen);

  // On ne redonne le focus au champ que s'il l'avait déjà :
  // évite d'ouvrir le clavier sur mobile quand on touche un filtre.
  const search = $("#searchInput", root);
  if (search && searchWasFocused) {
    search.focus({ preventScroll: true });
    const length = search.value.length;
    try {
      search.setSelectionRange(length, length);
    } catch (_) {}
  }
}

function bindEvents() {
  const root = $("#root");
  if (!root) return;

  root.addEventListener("click", (event) => {
    const target = event.target;
    const menuOpen = target.closest("[data-menu-open]");
    const menuClose = target.closest("[data-menu-close]");
    const groupBtn = target.closest("[data-group]");
    const statusBtn = target.closest("[data-status]");
    const card = target.closest("[data-open]");
    const searchBtn = target.closest("[data-search]");
    const quizBtn = target.closest("[data-quiz]");
    const quizMenuBtn = target.closest("[data-quiz-menu]");
    const choiceBtn = target.closest("[data-choice]");
    const continueBtn = target.closest("[data-quiz-continue]");

    const filtersOpenBtn = target.closest("[data-filters-open]");
    const filtersApply = target.closest("[data-filters-apply]");
    const filtersCancel = target.closest("[data-filters-cancel]");
    const draftFilter = target.closest("[data-draft-filter]");
    const draftExclude = target.closest("[data-draft-exclude]");
    const draftClear = target.closest("[data-draft-clear]");
    const searchClear = target.closest("[data-search-clear]");
    const reviewTabBtn = target.closest("[data-review-tab]");
    const reviewGroupBtn = target.closest("[data-review-group]");
    const scenarioBtn = target.closest("[data-scenario]");

    if (filtersOpenBtn) return openFilters();
    if (filtersApply) return closeFilters(true);
    if (filtersCancel) return closeFilters(false);

    if (draftFilter && state.filterDraft) {
      const group = draftFilter.dataset.draftFilter;
      const value = draftFilter.dataset.value;
      const filters = state.filterDraft.filters;
      filters[group] = filters[group] === value ? "" : value;
      return render();
    }

    if (draftExclude && state.filterDraft) {
      const id = draftExclude.dataset.draftExclude;
      const list = state.filterDraft.exclude;
      state.filterDraft.exclude = list.includes(id)
        ? list.filter((value) => value !== id)
        : [...list, id];
      return render();
    }

    if (draftClear && state.filterDraft) {
      state.filterDraft = { filters: { section: "", type: "" }, exclude: [], memo: false };
      return render();
    }

    if (searchClear) {
      state.query = "";
      render();
      const input = $("#searchInput");
      if (input) input.focus();
      return;
    }

    if (reviewTabBtn) {
      state.reviewTab = reviewTabBtn.dataset.reviewTab;
      return render();
    }

    // Accordéons (Ma progression, Entraînement) : une seule partie ouverte.
    if (reviewGroupBtn) {
      const key = reviewGroupBtn.dataset.reviewGroup;
      state.reviewOpenKey = state.reviewOpenKey === key ? null : key;
      render();
      revealGroup(key);
      return;
    }

    if (scenarioBtn) {
      const index = Number(scenarioBtn.dataset.scenario);
      state.openScenario = state.openScenario === index ? null : index;
      render();
      revealGroup(`scenario-${index}`);
      return;
    }

    if (menuOpen) return setMenu(true);
    if (menuClose) return setMenu(false);

    if (groupBtn) {
      const key = groupBtn.dataset.group;
      const box = root.querySelector(`[data-group-box="${key}"]`);
      const open = !(box && box.classList.contains("open"));
      state.expanded[key] = open;
      if (box) box.classList.toggle("open", open);
      groupBtn.setAttribute("aria-expanded", String(open));
      return;
    }

    // Liens internes : on empêche le navigateur de garder le scroll de la page précédente.
    const hashLink = target.closest("a[href^='#']");
    if (hashLink) {
      const href = hashLink.getAttribute("href") || "#/";
      event.preventDefault();
      if (href === (location.hash || "#/")) return setMenu(false);
      location.hash = href;
      return;
    }

    // ✕ / ✓ : un 2e appui sur le même bouton remet la fiche à « nouvelle ».
    if (statusBtn) {
      event.stopPropagation();
      const id = statusBtn.dataset.id;
      const value = statusBtn.dataset.status;
      setProgress(id, getProgress(id) === value ? "new" : value);
      return;
    }

    if (card) {
      location.hash = `#/f/${encodeURIComponent(card.dataset.open)}`;
      return;
    }

    if (searchBtn) {
      state.query = searchBtn.dataset.search || "";
      render();
      return;
    }

    if (quizMenuBtn) {
      state.quiz = null;
      saveJson(QUIZ_KEY, null);
      render();
      scrollPageTo(0);
      return;
    }

    if (quizBtn) {
      startQuiz(quizBtn.dataset.quiz, flattenItems());
      return;
    }

    if (choiceBtn) {
      answerQuiz(Number(choiceBtn.dataset.choice));
      return;
    }

    if (continueBtn) {
      nextQuiz();
    }
  });

  root.addEventListener("keydown", (event) => {
    const card = event.target.closest && event.target.closest("[data-open]");
    if (card && event.target === card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      location.hash = `#/f/${encodeURIComponent(card.dataset.open)}`;
    }
  });

  root.addEventListener("change", (event) => {
    if (event.target && event.target.matches("[data-draft-memo]") && state.filterDraft) {
      state.filterDraft.memo = event.target.checked;
      render();
    }
  });

  root.addEventListener("input", (event) => {
    if (event.target && event.target.id === "searchInput") {
      state.query = event.target.value;
      render();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.filtersOpen) closeFilters(false);
    else if (event.key === "Escape" && state.menuOpen) setMenu(false);
  });

  window.addEventListener("hashchange", onRouteChange);
}

window.addEventListener("error", (event) => {
  const root = $("#root");
  if (!root) return;
  root.innerHTML = `
    <div class="app-error">
      <strong>Erreur JavaScript.</strong>
      <div>Le navigateur a bloqué le lancement de l'application.</div>
      <code>${escapeHtml(event.message || "Erreur inconnue")}</code>
    </div>
  `;
});

document.addEventListener("DOMContentLoaded", () => {
  if (getSections()) {
    validateAllergenData(flattenItems());
    validateQuizData(flattenItems());
  }
  bindEvents();
  onRouteChange();
});
