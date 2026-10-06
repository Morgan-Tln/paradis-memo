"use strict";

/*
 * js/core/storage.js
 * Sauvegarde dans le navigateur (localStorage) : clés, lecture, écriture, migration.
 */

const APP_VERSION = "v22-design-apaise";

// La progression utilise une clé STABLE : elle ne doit plus être effacée
// à chaque nouvelle version de l'app.
const STORAGE_KEY = "paradis_progress";

// Le quiz en cours peut changer de format d'une version à l'autre :
// sa clé reste versionnée (perdre un quiz en cours n'est pas grave).
// Clés du quizz QCM (les scores de l'ancien quizz « Su / Pas su » ne sont pas repris).
const QUIZ_KEY = "paradis_qcm_en_cours";

const QUIZ_SCORES_KEY = "paradis_qcm_scores";

const LEGACY_PROGRESS_KEY = "paradis_v16-manual-questions_progress";

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    // localStorage peut être bloqué en navigation privée. L'app continue sans sauvegarde.
  }
}

/*
 * Récupère la progression.
 * Si la nouvelle clé n'existe pas encore, on reprend l'ancienne
 * (clé versionnée de la v16 ou d'une version antérieure) et on convertit
 * les anciens ids "section__categorie__nom__INDEX" en ids stables
 * "section__categorie__nom".
 */
function loadProgress() {
  const current = loadJson(STORAGE_KEY, null);
  if (current && typeof current === "object") return current;

  let legacy = loadJson(LEGACY_PROGRESS_KEY, null);
  if (!legacy) {
    try {
      let best = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!/^paradis_.+_progress$/.test(key) || key === STORAGE_KEY) continue;
        const data = loadJson(key, null);
        if (
          data &&
          typeof data === "object" &&
          (!best || Object.keys(data).length > Object.keys(best).length)
        )
          best = data;
      }
      legacy = best;
    } catch (_) {
      legacy = null;
    }
  }

  const migrated = {};
  Object.entries(legacy || {}).forEach(([oldId, value]) => {
    if (value === "known" || value === "review")
      migrated[oldId.replace(/__\d+$/, "")] = value;
  });
  if (Object.keys(migrated).length) saveJson(STORAGE_KEY, migrated);
  return migrated;
}
