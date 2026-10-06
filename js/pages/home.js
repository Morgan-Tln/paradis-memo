"use strict";

/*
 * js/pages/home.js
 * Page Accueil.
 */

// Scores des 4 quizz sur l'accueil (0 % si pas encore joué).
function quizScoreRings() {
  return quizCategories()
    .map((category) => {
      const score = state.quizScores[category.key];
      const value = score && score.last ? scorePercent(score.last) : 0;
      return scoreRing(value, category.label, paletteVars(paletteFromHue(category.hue)), "#/quiz");
    })
    .join("");
}

function renderHome(items) {
  const known = countKnown(items);
  const review = items.filter((item) => getProgress(item.id) === "review").length;
  const fresh = items.length - known - review;
  const sections = getSections();

  const tiles = Object.keys(sections)
    .map((sectionKey) => {
      const list = itemsOf(items, sectionKey);
      const done = countKnown(list);
      return `
        <a class="tile tile-section" href="${sectionHref(sectionKey)}" style="${sectionVars(sectionKey)}">
          <span class="tile-emoji">${sectionEmoji(sectionKey)}</span>
          <span class="tile-title">${escapeHtml(sectionLabel(sectionKey))}</span>
          <span class="tile-meta">${list.length} fiches, ${done} maîtrisée${done > 1 ? "s" : ""}</span>
          ${progressBar(done, list.length)}
        </a>`;
    })
    .join("");

  return `
    <section class="home-hero">
      <h1 class="logo" aria-label="Paradis du Fruit">
        <span class="logo-line logo-paradis">Paradis</span>
        <span class="logo-line logo-fruit">du Fruit</span>
      </h1>
      <div class="score-rings" aria-label="Mes scores au quizz">${quizScoreRings()}</div>
      <div class="hero-stats">
        <span class="pill pill-ok">✓ ${known} maîtrisée${known > 1 ? "s" : ""}</span>
        <span class="pill pill-ko">✕ ${review} non maîtrisée${review > 1 ? "s" : ""}</span>
        <span class="pill">${fresh} à découvrir</span>
      </div>
    </section>

    ${renderSearchBox()}

    ${
      isSearching()
        ? renderSearchResults(items)
        : `
      <h2 class="block-title">La carte</h2>
      <div class="tiles tiles-sections">${tiles}</div>

      <h2 class="block-title">S'entraîner</h2>
      <div class="tiles tiles-3">
        <a class="tile tile-tool" href="#/revoir" style="${paletteVars(paletteFromHue(352))}">
          <span class="tile-emoji">📈</span><span class="tile-title">Ma progression</span><span class="tile-meta">${known} maîtrisée${known > 1 ? "s" : ""}, ${review} non maîtrisée${review > 1 ? "s" : ""}</span>${progressBar(known, items.length)}
        </a>
        <a class="tile tile-tool" href="#/quiz" style="${paletteVars(paletteFromHue(262))}">
          <span class="tile-emoji">🎯</span><span class="tile-title">Quizz</span><span class="tile-meta">Score général : ${generalScore().percent} %</span>${progressBar(generalScore().percent, 100)}
        </a>
        <a class="tile tile-tool" href="#/entrainement" style="${paletteVars(paletteFromHue(205))}">
          <span class="tile-emoji">🧑‍🍳</span><span class="tile-title">Entraînement</span><span class="tile-meta">Situations client réalistes</span>
        </a>
      </div>`
    }
  `;
}
