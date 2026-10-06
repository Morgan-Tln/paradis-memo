"use strict";

/*
 * js/core/utils.js
 * Outils génériques : texte, HTML, nombres, hasard, dates.
 */

function $(selector, root = document) {
  return root.querySelector(selector);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeText(value).replace(/\s+/g, "-").slice(0, 90) || "item";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function percent(value, total) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Prend `count` éléments au hasard dans une liste.
function pickRandom(list, count) {
  return shuffle(list).slice(0, count);
}

function formatDate(timestamp) {
  try {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch (_) {
    return "";
  }
}

function containsAnyText(text, terms) {
  const normalized = normalizeText(text);
  return terms.some((term) => normalized.includes(normalizeText(term)));
}

// Découpe un texte en mots normalisés (minuscules, sans accents).
function wordsOf(text) {
  return normalizeText(text).split(" ").filter(Boolean);
}

function hasWordPrefix(words, tokens) {
  return tokens.every((token) => words.some((word) => word.startsWith(token)));
}

function cleanItemName(name) {
  return String(name || "")
    .replace(/^\d+\.\s*/, "")
    .trim();
}

function formatText(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}
