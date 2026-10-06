"use strict";

/*
 * js/features/quiz-engine.js
 * Moteur du quizz QCM : banques de questions, scores, déroulé d'une partie.
 */

/*
 * ============================================================
 * QUIZZ PAR CATÉGORIES (Salle, Bar, Cuisine, Général)
 * ============================================================
 *
 * Les questions sont dans data/quiz-questions.js (window.QUIZ_CATEGORIES).
 * Chaque partie d'une catégorie = ses 40 questions, mélangées.
 * Le score de la dernière partie et le meilleur score sont gardés
 * par catégorie. Le score général = moyenne des 4 catégories
 * (une catégorie jamais faite compte 0 %).
 * ============================================================
 */

function quizCategories() {
  return Array.isArray(window.QUIZ_CATEGORIES) ? window.QUIZ_CATEGORIES : [];
}

function quizCategory(key) {
  return quizCategories().find((cat) => cat.key === key) || null;
}

// Fiche liée à une question : nom identique d'abord, sinon nom qui contient la référence.
function findQuizItem(items, ref) {
  const target = normalizeText(ref);
  if (!target) return null;
  return (
    items.find((item) => normalizeText(item.name) === target) ||
    items.find((item) => normalizeText(item.name).includes(target)) ||
    null
  );
}

function buildCategoryBank(category, items) {
  return (category.questions || []).map((entry) => {
    const item = entry.ref ? findQuizItem(items, entry.ref) : null;
    return {
      // Identifiant basé sur le texte : stable même si l'ordre des questions change.
      qid: `${category.key}__${slugify(entry.question)}`,
      id: item ? item.id : null,
      cat: category.key,
      category: entry.theme || category.label,
      question: entry.question,
      good: entry.good,
      // Les 4 réponses sont mélangées à chaque partie.
      options: shuffle([entry.good, ...(entry.bad || [])]),
    };
  });
}

function buildQuestions(items, scope) {
  if (scope === "allergens") return buildAllergenQuestions(items);
  const category = quizCategory(scope);
  return category ? shuffle(buildCategoryBank(category, items)) : [];
}

function scorePercent(entry) {
  return entry && entry.total ? Math.round((entry.ok / entry.total) * 100) : 0;
}

function generalScore() {
  const categories = quizCategories();
  if (!categories.length) return { percent: 0, done: 0, total: 0 };
  let sum = 0;
  let done = 0;
  categories.forEach((category) => {
    const score = state.quizScores[category.key];
    if (score && score.last) {
      sum += scorePercent(score.last);
      done += 1;
    }
  });
  return {
    percent: Math.round(sum / categories.length),
    done,
    total: categories.length,
  };
}

function saveQuizScore(scope, ok, total) {
  const previous = state.quizScores[scope] || {};
  const entry = { ok, total, date: Date.now() };
  const best =
    !previous.best || ok / total >= previous.best.ok / previous.best.total
      ? entry
      : previous.best;
  state.quizScores[scope] = {
    last: entry,
    best,
    count: (previous.count || 0) + 1,
  };
  saveJson(QUIZ_SCORES_KEY, state.quizScores);
  return { isRecord: best === entry && (previous.count || 0) > 0, previousBest: previous.best };
}

/*
 * Contrôle de la banque, affiché dans la console (F12).
 */
function validateQuizData(items) {
  const categories = quizCategories();
  if (!categories.length) {
    console.error("data/quiz-questions.js n'est pas chargé ou ne contient pas QUIZ_CATEGORIES.");
    return;
  }
  categories.forEach((category) => {
    const count = (category.questions || []).length;
    if (count !== 40)
      console.warn(`Quizz ${category.label} : ${count} questions au lieu de 40.`);
    (category.questions || []).forEach((entry) => {
      if (!entry.good || (entry.bad || []).length !== 3)
        console.warn(`Quizz ${category.label} : il faut 1 bonne réponse et 3 pièges pour « ${entry.question} ».`);
      if (entry.ref && !findQuizItem(items, entry.ref))
        console.warn(`Quizz ${category.label} : fiche liée introuvable « ${entry.ref} ».`);
    });
  });
}

function allergenSetLabel(ids) {
  return allergenLabels(sortAllergenIds(ids)).join(", ");
}

function buildAllergenQuestions(items) {
  const documented = items.filter((item) => {
    const info = getItemAllergens(item);
    return info.status === "officiel" && info.contient.length;
  });
  const allIds = ALLERGENS.map((allergen) => allergen.id);
  const bank = [];

  // 1. « Quels sont les allergènes de X ? » : la bonne liste + 3 listes modifiées.
  documented.forEach((item) => {
    const correct = getItemAllergens(item).contient;
    const missing = allIds.filter((id) => !correct.includes(id));
    const good = allergenSetLabel(correct);
    const bad = new Set();
    let guard = 0;
    while (bad.size < 3 && guard < 60) {
      guard += 1;
      const mode = guard % 3;
      let variant = correct.slice();
      if (mode === 0 && variant.length > 1) {
        variant.splice(Math.floor(Math.random() * variant.length), 1);
      } else if (mode === 1 && missing.length) {
        variant.push(pickRandom(missing, 1)[0]);
      } else if (missing.length) {
        variant.splice(Math.floor(Math.random() * variant.length), 1, pickRandom(missing, 1)[0]);
      }
      const label = allergenSetLabel(variant);
      if (label && label !== good) bad.add(label);
    }
    if (bad.size < 3) return;
    bank.push({
      qid: `allergen_item__${item.id}`,
      id: item.id,
      category: item.categoryLabel,
      question: `Quels sont les allergènes de « ${cleanItemName(item.name)} » ?`,
      good,
      options: shuffle([good, ...bad]),
    });
  });

  // 2. « Lequel de ces plats contient tel allergène ? »
  ALLERGENS.forEach((allergen) => {
    const matches = documented.filter((item) =>
      getItemAllergens(item).contient.includes(allergen.id),
    );
    const others = documented.filter(
      (item) => !getItemAllergens(item).contient.includes(allergen.id),
    );
    if (!matches.length || others.length < 3) return;
    const good = cleanItemName(pickRandom(matches, 1)[0].name);
    bank.push({
      qid: `allergen_reverse__${allergen.id}`,
      id: null,
      category: "Allergènes",
      question: `Lequel de ces plats contient : ${allergen.name.toLowerCase()} ?`,
      good,
      options: shuffle([good, ...pickRandom(others, 3).map((item) => cleanItemName(item.name))]),
    });
  });

  // 3. « Lequel de ces plats n'a pas de gluten sur sa fiche officielle ? »
  const glutenFree = documented.filter(
    (item) => !getItemAllergens(item).contient.includes("gluten"),
  );
  const withGluten = documented.filter((item) =>
    getItemAllergens(item).contient.includes("gluten"),
  );
  if (glutenFree.length && withGluten.length >= 3) {
    const good = cleanItemName(pickRandom(glutenFree, 1)[0].name);
    bank.push({
      qid: "allergen_sans_gluten",
      id: null,
      category: "Allergènes",
      question: "Lequel de ces plats n'a pas de gluten sur sa fiche officielle ?",
      good,
      options: shuffle([good, ...pickRandom(withGluten, 3).map((item) => cleanItemName(item.name))]),
    });
  }

  return shuffle(bank);
}

function quizScopeLabel(scope) {
  if (scope === "allergens") return "Allergènes";
  const category = quizCategory(scope);
  return category ? category.label : "Quizz";
}

function quizScopeVars(scope) {
  const category = quizCategory(scope);
  if (category) return paletteVars(paletteFromHue(category.hue));
  return paletteVars(paletteFromHue(40));
}

function startQuiz(scope, items) {
  const questions = buildQuestions(items, scope);
  if (!questions.length) return;
  state.quiz = { scope, questions, index: 0, ok: 0, nok: 0, pending: null };
  saveJson(QUIZ_KEY, state.quiz);
  render();
  scrollPageTo(0);
}

/*
 * Réponse à une question : on indique seulement juste (vert) ou faux (rouge).
 * La bonne réponse n'est jamais affichée.
 */
function answerQuiz(choice) {
  const quiz = state.quiz;
  if (!quiz || quiz.pending) return;
  const current = quiz.questions[quiz.index];
  if (!current) return;

  const correct = current.options[choice] === current.good;
  if (correct) {
    quiz.ok = (quiz.ok || 0) + 1;
    if (current.id) state.progress[current.id] = "known";
  } else {
    quiz.nok = (quiz.nok || 0) + 1;
    if (current.id) state.progress[current.id] = "review";
  }
  quiz.pending = { choice, correct };

  saveJson(STORAGE_KEY, state.progress);
  saveJson(QUIZ_KEY, quiz);
  render();
}

function nextQuiz() {
  const quiz = state.quiz;
  if (!quiz || !quiz.pending) return;
  quiz.pending = null;
  quiz.index += 1;

  // Fin d'une catégorie : le score est recalculé à chaque partie terminée.
  if (quiz.index >= quiz.questions.length && !quiz.saved && quizCategory(quiz.scope)) {
    const result = saveQuizScore(quiz.scope, quiz.ok, quiz.questions.length);
    quiz.record = result.isRecord;
    quiz.saved = true;
  }

  saveJson(QUIZ_KEY, quiz);
  render();
  scrollPageTo(0);
}
