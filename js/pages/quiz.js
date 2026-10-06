"use strict";

/*
 * js/pages/quiz.js
 * Page Quizz : accueil du quizz, question, résultat.
 */

function renderQuizHome(items) {
  const general = generalScore();
  const allergenCount = buildAllergenQuestions(items).length;
  const remaining = general.total - general.done;
  const generalText =
    general.done === 0
      ? "Moyenne de tes 4 thèmes"
      : remaining > 0
        ? `Encore ${remaining} thème${remaining > 1 ? "s" : ""} à jouer`
        : "Les 4 thèmes sont joués";

  const cards = quizCategories()
    .map((category) => {
      const score = state.quizScores[category.key];
      const total = (category.questions || []).length;
      const last = score && score.last;
      const best = score && score.best;
      return `
        <article class="quiz-cat" style="${paletteVars(paletteFromHue(category.hue))}">
          <div class="quiz-cat-top">
            <span class="quiz-cat-emoji">${escapeHtml(category.emoji || "🎯")}</span>
            <div class="quiz-cat-score">
              ${last ? `<b>${scorePercent(last)}%</b>` : `<b>0%</b><small>à jouer</small>`}
            </div>
          </div>
          <h3 class="quiz-cat-title">${escapeHtml(category.label)}</h3>
          <p class="quiz-cat-desc">${escapeHtml(category.description || "")}</p>
          ${progressBar(last ? last.ok : 0, last ? last.total : total)}
          <div class="quiz-cat-meta">
            ${best ? `Meilleur : ${best.ok}/${best.total}` : `${total} questions`}
            ${last ? `<span>Dernier le ${escapeHtml(formatDate(last.date))}</span>` : ""}
          </div>
          <button class="action-btn primary" data-quiz="${escapeHtml(category.key)}">${last ? "Rejouer" : "Jouer"}</button>
        </article>`;
    })
    .join("");

  return `
    <section class="quiz-hero">
      <div class="quiz-hero-text">
        <h1 class="quiz-logo">Quizz</h1>
        <div class="quiz-facts">
          <span>4 thèmes</span>
          <span>40 questions chacun</span>
          <span>Améliore ton score</span>
          <span>Mémorisation</span>
        </div>
      </div>
      <div class="quiz-general">
        <div class="score-ring big" style="--p:${general.percent}"><b>${general.percent}%</b></div>
        <div class="quiz-general-label">
          <span class="score-ring-label">Score général</span>
          <small>${escapeHtml(generalText)}</small>
        </div>
      </div>
    </section>

    <div class="quiz-cats">${cards}</div>

    <h2 class="block-title">Autre entraînement</h2>
    <div class="quiz-extra">
      <button class="quiz-extra-btn" data-quiz="allergens" style="${paletteVars(paletteFromHue(40))}">
        <span class="extra-emoji">🧾</span>
        <span><b>Quiz allergènes</b><small>${allergenCount} questions, fiches officielles</small></span>
      </button>
    </div>
  `;
}

function renderQuizEnd(quiz) {
  const total = quiz.questions.length;
  const ok = quiz.ok || 0;
  const errors = total - ok;
  const percentValue = percent(ok, total);
  const message =
    percentValue >= 90
      ? "Excellent, tu maîtrises ce sujet."
      : percentValue >= 70
        ? "Très bien. Relance le quizz pour viser 90 %."
        : percentValue >= 50
          ? "C'est un bon début. Revois les fiches puis retente ta chance."
          : "Reprends les fiches de ce thème, puis relance le quizz.";

  return `
    <section class="quiz-card panel panel-pad quiz-end" style="${quizScopeVars(quiz.scope)}">
      <div class="eyebrow">${escapeHtml(quizScopeLabel(quiz.scope))} terminé</div>
      <div class="ring big" style="--p:${percentValue}">
        <div class="ring-inner"><b>${percentValue}%</b><small>${ok}/${total}</small></div>
      </div>
      ${quiz.record ? `<p class="record">Nouveau record !</p>` : ""}
      <p class="lead">${escapeHtml(message)}</p>
      <div class="end-stats">
        <span class="pill pill-ok">✓ ${ok} bonne${ok > 1 ? "s" : ""} réponse${ok > 1 ? "s" : ""}</span>
        <span class="pill pill-ko">✕ ${errors} erreur${errors > 1 ? "s" : ""}</span>
      </div>
      <div class="actions" style="margin-top:16px">
        <button class="action-btn primary" data-quiz="${escapeHtml(quiz.scope)}">Recommencer</button>
        <button class="action-btn neutral" data-quiz-menu="1">Retour aux quizz</button>
      </div>
    </section>
  `;
}

function renderQuizView(items) {
  let quiz = state.quiz;
  // Partie enregistrée dans un ancien format (avant le QCM) : on l'ignore.
  if (quiz && Array.isArray(quiz.questions) && quiz.questions.some((entry) => !Array.isArray(entry.options))) {
    state.quiz = null;
    quiz = null;
    saveJson(QUIZ_KEY, null);
  }
  if (!quiz || !Array.isArray(quiz.questions) || !quiz.questions.length)
    return renderQuizHome(items);

  const total = quiz.questions.length;
  const current = quiz.questions[quiz.index];
  if (!current) return renderQuizEnd(quiz);

  const pending = quiz.pending;
  const letters = ["A", "B", "C", "D", "E", "F"];
  const options = current.options
    .map((option, index) => {
      let stateClass = "";
      if (pending) {
        if (pending.choice === index) stateClass = pending.correct ? "is-correct" : "is-wrong";
        else stateClass = "is-dim";
      }
      return `
        <button class="qcm-option ${stateClass}" data-choice="${index}" ${pending ? "disabled" : ""}>
          <span class="qcm-letter">${letters[index] || "•"}</span>
          <span class="qcm-text">${escapeHtml(option)}</span>
        </button>`;
    })
    .join("");

  const isLast = quiz.index + 1 >= total;

  return `
    <section class="quiz-card panel panel-pad" style="${quizScopeVars(quiz.scope)}">
      <div class="view-title">
        <div>
          <div class="eyebrow">${escapeHtml(quizScopeLabel(quiz.scope))}</div>
          <h2 class="h2">Question ${quiz.index + 1} / ${total}</h2>
          <div class="muted">✓ ${quiz.ok || 0}   ✕ ${quiz.nok || 0}</div>
        </div>
        <button class="tag-btn" data-quiz-menu="1">Quitter</button>
      </div>
      <div class="badges" style="margin-bottom:12px">
        <span class="badge info">${escapeHtml(current.category || "Question")}</span>
      </div>
      <div class="progress-line" style="margin-bottom:18px"><div class="progress-fill" style="width:${percent(quiz.index + (pending ? 1 : 0), total)}%"></div></div>
      <div class="quiz-question">${escapeHtml(current.question)}</div>
      <div class="qcm-options">${options}</div>
      ${
        pending
          ? `
        <div class="qcm-feedback ${pending.correct ? "ok" : "ko"}" role="status">
          ${pending.correct ? "✓ Bonne réponse" : "✕ Mauvaise réponse"}
        </div>
        <button class="action-btn primary qcm-next" data-quiz-continue="1">${isLast ? "Voir mon résultat" : "Question suivante"}</button>`
          : ""
      }
    </section>
  `;
}
