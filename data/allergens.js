// ============================================================
// ALLERGÈNES OFFICIELS - Le Paradis du Fruit
// ============================================================
//
// Ce fichier est la SEULE source des allergènes affichés dans l'app.
// L'app ne devine plus rien à partir des ingrédients.
//
// 1. ALLERGEN_LIST : les 14 allergènes réglementaires (id + libellé + couleurs).
//
// 2. ITEM_ALLERGENS : section → catégorie → nom exact de la fiche (comme dans data/menu.js).
//    Trois formes possibles pour une fiche :
//
//    "Nom de la fiche": ["gluten", "oeufs"],
//        → liste simple = allergènes contenus (forme la plus courante)
//
//    "Nom de la fiche": { contient: ["gluten"], traces: ["fruits_coque"] },
//        → si la fiche officielle précise des traces / « peut contenir »
//
//    "Nom de la fiche": [],
//        → la fiche officielle indique AUCUN allergène
//
//    "Nom de la fiche": { note: "Explication" },
//        → dépend du choix du client (formules, planches, parfums au choix…)
//
//    Une fiche ABSENTE de ce fichier = « non renseignée » dans l'app.
//    On n'invente jamais : absent vaut mieux que faux.
//
// Au chargement, la console du navigateur (F12) affiche un contrôle :
// fiches non renseignées, ids inconnus, noms qui ne correspondent à aucune fiche.
// ============================================================

window.ALLERGEN_LIST = [
  { id: "gluten",       label: "Gluten",         name: "Céréales contenant du gluten",   color: { bg: "#f6eedd", text: "#6b4423", border: "#e2cfa4" } },
  { id: "crustaces",    label: "Crustacés",      name: "Crustacés",                      color: { bg: "#fde4e6", text: "#9f1239", border: "#f6c3c9" } },
  { id: "oeufs",        label: "Œuf",            name: "Œufs",                           color: { bg: "#fbf3c4", text: "#713f12", border: "#efdf8a" } },
  { id: "poissons",     label: "Poisson",        name: "Poissons",                       color: { bg: "#e0f0fb", text: "#0b5a8a", border: "#b8dcf3" } },
  { id: "arachides",    label: "Arachide",       name: "Arachides",                      color: { bg: "#fbeccb", text: "#8a3f0c", border: "#f0d494" } },
  { id: "soja",         label: "Soja",           name: "Soja",                           color: { bg: "#e9f6e5", text: "#2f6b1f", border: "#c4e3b8" } },
  { id: "lait",         label: "Lait",           name: "Lait (y compris lactose)",       color: { bg: "#f3ecfb", text: "#5b2a8a", border: "#ddc9f1" } },
  { id: "fruits_coque", label: "Fruits à coque", name: "Fruits à coque",                 color: { bg: "#f3e6dc", text: "#7c2d12", border: "#e2c6b2" } },
  { id: "celeri",       label: "Céleri",         name: "Céleri",                         color: { bg: "#e3f4e6", text: "#15703a", border: "#b5dfc0" } },
  { id: "moutarde",     label: "Moutarde",       name: "Moutarde",                       color: { bg: "#fbf0c2", text: "#8a5a05", border: "#efd67e" } },
  { id: "sesame",       label: "Sésame",         name: "Graines de sésame",              color: { bg: "#f2ebe4", text: "#4a2a12", border: "#ddcbb9" } },
  { id: "sulfites",     label: "Sulfites",       name: "Anhydride sulfureux et sulfites", color: { bg: "#e2f5f8", text: "#0b6b80", border: "#b2e0ea" } },
  { id: "lupin",        label: "Lupin",          name: "Lupin",                          color: { bg: "#eef1f5", text: "#334155", border: "#cbd3de" } },
  { id: "mollusques",   label: "Mollusques",     name: "Mollusques",                     color: { bg: "#e3eefa", text: "#1e4f8a", border: "#bcd3ef" } }
];

window.ITEM_ALLERGENS = {
  plats: {
    // Bonjour Paradis ! Pitas Toastées
    pitas: {
      "Tartinade de thon au citron confit":                 ["gluten", "oeufs", "poissons", "celeri", "moutarde", "sulfites"],
      "Dinde fumée, pomme et Cheddar fondu":                ["gluten", "oeufs", "lait", "moutarde"],
      "Saumon fumé, Cream Cheese et aneth":                 ["gluten", "oeufs", "poissons", "lait", "moutarde", "sulfites"],
      "Crémeux de Chèvre, miel, noix et épinards":          ["gluten", "oeufs", "lait", "fruits_coque", "moutarde"],
      "Crémeux de poulet miel & curry, poivrons et Cheddar": ["gluten", "oeufs", "lait", "moutarde", "sulfites"],
      "Mozzarella Fior Di Latte, pistou, poivron rôti":     ["gluten", "oeufs", "lait", "moutarde"],
      "Planche de 3 Pitas": { note: "Selon les 3 pitas choisies : additionner les allergènes de chacune." }
    },

    // Avocado Toast Party
    avocado: {
      "Le Veggie": ["gluten", "oeufs", "lait", "moutarde"],
      "Le Saumon": ["gluten", "poissons", "lait", "moutarde", "sulfites"]
    },

    // La vie est belle en Salade
    salades: {
      "Paradis Bonheur":   ["gluten", "oeufs", "soja", "lait", "sesame"],
      "Caesar au Paradis": ["gluten", "oeufs", "poissons", "soja", "lait"],
      "Tutti Salata":      ["gluten", "oeufs", "soja", "lait", "moutarde"],
      "Mama Saumon":       ["gluten", "oeufs", "poissons", "soja", "lait", "moutarde", "sesame"],
      "Pistou Presto":     ["gluten", "oeufs", "lait"]
    },

    // Chaud le Toast !
    chaud_toast: {
      "Goody Woody":       ["gluten", "oeufs", "lait", "moutarde", "sulfites"],
      "C'Bon":             ["gluten", "oeufs", "poissons", "lait", "celeri", "moutarde", "sulfites"],
      "Banquise Sauvage":  ["gluten", "oeufs", "poissons", "lait", "moutarde", "sulfites"],
      "Deli Mix Pastrami": ["gluten", "oeufs", "lait", "moutarde", "sulfites"]
    },

    // Street Paradis
    street_paradis: {
      "Fish & Chips":       ["oeufs", "poissons", "moutarde", "sulfites"],
      "Pastrami Burger":    ["gluten", "oeufs", "lait", "moutarde", "sesame", "sulfites"],
      "Veggie Burger":      ["gluten", "oeufs", "lait", "moutarde", "sesame", "sulfites"],
      "Sir Homard Lobster": ["gluten", "crustaces", "oeufs", "poissons", "soja", "lait", "celeri", "moutarde", "sulfites"]
    },

    // Les Marmites Magiques !
    marmites: {
      "Dolce Paradisio": ["gluten", "oeufs", "lait", "moutarde"],
      "Citron Beldi":    ["gluten", "soja", "fruits_coque", "sesame", "sulfites"],
      "Mama Corail":     ["crustaces", "poissons", "fruits_coque"]
    }
  }

  // À compléter : saveurs, boissons, desserts, brunch, base méli-mélo…
};
