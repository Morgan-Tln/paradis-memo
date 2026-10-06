"use strict";

/*
 * js/core/state.js
 * État de l'application (ce qui est affiché, progression, quizz en cours).
 */

const state = {
  route: { view: "accueil" },
  menuOpen: false,
  expanded: {}, // sous-menus ouverts dans le menu hamburger
  query: "",
  filters: { section: "", type: "" },
  filterDraft: null, // brouillon des filtres pendant que la modale est ouverte
  filtersOpen: false,
  searchMemo: false,
  reviewTab: "review",
  reviewOpenKey: null, // famille ouverte dans Ma progression
  openScenario: null, // situation ouverte dans Entraînement
  progress: loadProgress(),
  quiz: loadJson(QUIZ_KEY, null),
  quizScores: loadJson(QUIZ_SCORES_KEY, {}),
  excludeAllergens: [],
};

function getProgress(id) {
  return state.progress[id] || "new";
}

function setProgress(id, value) {
  if (value === "new") delete state.progress[id];
  else state.progress[id] = value;
  saveJson(STORAGE_KEY, state.progress);
  render();
}
