"use strict";

/*
 * js/pages/training.js
 * Page Entraînement : situations client.
 */

function pickItems(items, predicate, limit = 8) {
  return items.filter(predicate).slice(0, limit);
}

function isVegetarianCandidate(item) {
  if (isAlcoholItem(item)) return false;
  // Recherche par début de mot : « vin » ne bloque plus « vinaigrette ».
  const words = wordsOf(`${item.name || ""} ${(item.ingredients || []).join(" ")}`);
  if (MEAT_FISH_WORDS.some((term) => words.some((word) => word.startsWith(term))))
    return false;
  return containsAny(item, [
    "veggie",
    "vegetarien",
    "avocat",
    "chevre",
    "mozzarella",
    "burrata",
    "feta",
    "camembert",
    "gnocchis",
    "salade",
    "melon",
    "pasteque",
    "tutti",
    "pistou",
    "legumes",
  ]);
}

function isFreshLightCandidate(item) {
  if (isAlcoholItem(item)) return false;
  return (
    containsAny(item, [
      "salade",
      "fruits",
      "decoupe",
      "frais",
      "avocat",
      "concombre",
      "menthe",
      "citron",
      "orange",
      "pamplemousse",
      "kiwi",
      "ananas",
      "mangue",
    ]) &&
    containsNone(item, [
      "nutella",
      "chocolat",
      "cheddar",
      "frites",
      "burger",
      "pastrami",
      "cream cheese",
      "creme fouettee",
    ])
  );
}

function scenario(title, emoji, level, response, checks, answer) {
  return { title, emoji, level, response, checks, answer };
}

function pickNamed(items, names) {
  const normalizedNames = names.map(normalizeText);
  const out = [];
  normalizedNames.forEach((target) => {
    const found =
      items.find((item) => normalizeText(item.name) === target) ||
      items.find((item) => normalizeText(item.name).includes(target));
    if (found && !out.some((item) => item.id === found.id)) out.push(found);
  });
  return out;
}

function mergeItems(...groups) {
  const out = [];
  groups.flat().forEach((item) => {
    if (item && !out.some((existing) => existing.id === item.id))
      out.push(item);
  });
  return out;
}

function buildScenarios(items) {
  const noAlcohol = (item) => !isAlcoholItem(item);
  const seafoodTerms = [
    "thon",
    "saumon",
    "merlu",
    "limande",
    "fish",
    "crevette",
    "homard",
    "poisson",
    "gravlax",
  ];
  const meatTerms = ["poulet", "dinde", "pastrami", "boeuf"];
  const dairyTerms = [
    "lait",
    "creme",
    "cream",
    "cheddar",
    "chevre",
    "mozzarella",
    "burrata",
    "feta",
    "cheese",
    "yaourt",
    "yogurt",
    "yolita",
    "glace",
    "vanille",
    "nougat",
    "cappuccino",
    "latte",
  ];
  const nutTerms = [
    "noix",
    "amande",
    "pistache",
    "praline",
    "noisette",
    "nutella",
    "nougat",
  ];
  const glutenTerms = [
    "pita",
    "focaccia",
    "blini",
    "toast",
    "pain",
    "brioche",
    "burger",
    "boulgour",
    "gnocchi",
    "gaufre",
    "pancake",
    "tarte",
    "cheesecake",
    "gateau",
    "muesli",
    "panko",
    "cereales",
    "biere",
    "ipa",
  ];

  const glutenSafeExamples = mergeItems(
    pickNamed(items, [
      "Fondant Cœur Coulant",
      "Salade de Fruits Jolie Jolie",
      "Ma Jolie Mangue",
      "Grand Soleil 40cl",
      "Mangue Énergie",
      "Joséphine Baker",
      "Cure Détox",
    ]),
    pickItems(
      items,
      (item) =>
        item.sectionKey === "boissons" &&
        noAlcohol(item) &&
        containsNone(item, ["milk", "yoyo", "yolita", "muesli", "glace"]),
      4,
    ),
  ).slice(0, 10);

  const alcoholicFruity = pickNamed(items, [
    "Hugo Spritz",
    "Pink Spritz",
    "Passion Spritz",
    "Mojito Fruit 27cl",
    "Pina Colada La Fragola",
    "Margarita Mangue",
    "Danse Joséphine",
    "Daiquiri Passion & Framboise",
  ]);

  return [
    scenario(
      "Client : “Je suis végétarien, je veux un vrai plat, pas juste une salade.”",
      "🌱",
      "Moyen",
      "Réponse serveur : proposer d'abord Le Veggie, Veggie Burger, Pistou Presto, Dolce Paradisio, Tutti Salata ou les pitas/fromages sans viande. Préciser que végétarien ne veut pas dire vegan : beaucoup d'options contiennent fromage, œufs ou crème.",
      [
        "Éviter viande, poisson, crustacés.",
        "Ne pas confondre veggie et vegan.",
        "Pour une contrainte stricte, vérifier les sauces et contaminations possibles.",
      ],
      pickItems(items, isVegetarianCandidate, 10),
    ),
    scenario(
      "Client : “Je suis vegan, qu'est-ce que je peux prendre ?”",
      "🥬",
      "Difficile",
      "Réponse serveur : côté boisson, orienter vers les pressés, cocktails fruits et la base Vegan à composer. Côté plats, ne rien promettre sans validation cuisine : beaucoup de recettes contiennent fromage, œufs, crème, miel, pain ou sauces.",
      [
        "Vegan = aucun produit animal, donc attention lait, œuf, fromage, miel, crème, yaourt, glace.",
        "Les boissons fruitées sont les plus simples à orienter.",
        "Toujours vérifier la fiche officielle si le client est strict.",
      ],
      pickItems(
        items,
        (item) =>
          item.sectionKey === "boissons" &&
          noAlcohol(item) &&
          containsNone(item, [
            "milk",
            "lait",
            "yoyo",
            "yolita",
            "yogurt",
            "miel",
            "creme",
            "glace",
          ]),
        10,
      ),
    ),
    scenario(
      "Client : “Je suis allergique au céleri.”",
      "🚨",
      "Difficile",
      "Réponse serveur : ne pas recommander au hasard. Côté plats, la fiche officielle indique du céleri dans la pita Tartinade de thon, le C'Bon et le Sir Homard Lobster. Les boissons avec pomme Bio sont accompagnées d'une tige de céleri. Vérifier la fiche officielle avant commande.",
      [
        "Piège n°1 : tartinade de thon = céleri, donc aussi le C'Bon qui la contient.",
        "Piège n°2 : Sir Homard Lobster contient du céleri (fiche officielle).",
        "Piège n°3 : pomme Bio dans plusieurs pressés = tige de céleri.",
        "Réflexe pro : liste allergènes officielle, pas de mémoire freestyle.",
      ],
      mergeItems(
        items.filter((item) =>
          getItemAllergens(item).contient.includes("celeri"),
        ),
        pickItems(
          items,
          (item) => containsAny(item, ["pomme bio", "celeri"]),
          10,
        ),
      ).slice(0, 12),
    ),
    scenario(
      "Client : “J'ai une allergie aux fruits à coque.”",
      "🥜",
      "Difficile",
      "Réponse serveur : éviter noix, amandes, pistache, noisette, praliné, nougat et Nutella/noisette. Proposer uniquement après vérification officielle, surtout desserts et recettes avec crunch.",
      [
        "Attention aux noix dans la pita chèvre-miel-noix.",
        "Attention amandes dans Citron Beldi, Mama Corail, desserts et coupes glacées.",
        "Pistache, nougat, noisette et praliné sont des pièges dessert.",
      ],
      pickItems(items, (item) => containsAny(item, nutTerms), 12),
    ),
    scenario(
      "Client : “Je veux du poisson ou fruits de mer.”",
      "🐟",
      "Moyen",
      "Réponse serveur : proposer thon, saumon, merlu, limande, crevettes, homard et sauces associées.",
      [
        "Fish & Chips = merlu.",
        "Mini Fish & Chips = limande.",
        "Mama Corail = merlu + crevettes.",
        "Sir Homard = homard américain et poissons.",
      ],
      pickItems(items, (item) => containsAny(item, seafoodTerms), 12),
    ),
    scenario(
      "Client : “Je veux éviter le lactose / les produits laitiers.”",
      "🥛",
      "Difficile",
      "Réponse serveur : éviter cheddar, chèvre, mozzarella, burrata, feta, cream cheese, crème, yaourt/Yolita, glaces et crème fouettée. Orienter plutôt vers pressés/cocktails fruits, mais vérifier les sauces des plats.",
      [
        "La plupart des desserts sont à risque lait/crème.",
        "Beaucoup de plats salés contiennent fromage ou sauce crémeuse.",
        "La base Vegan à composer est plus sûre côté boisson.",
      ],
      pickItems(items, (item) => containsAny(item, dairyTerms), 12),
    ),
    scenario(
      "Client : “Je suis intolérant au gluten, qu'est-ce que je peux prendre ?”",
      "🌾",
      "Difficile",
      "Réponse serveur : côté dessert, le Fondant Cœur Coulant est explicitement indiqué sans gluten sur la carte. Tu peux aussi orienter vers des options très fruitées comme Salade de Fruits Jolie Jolie ou Ma Jolie Mangue, et vers les boissons fruitées sans alcool. En salé, prudence : pain, pita, focaccia, toast, burger, blini, boulgour, panure et gnocchis reviennent souvent. Vérifier la procédure cuisine si allergie sévère.",
      [
        "Fondant Cœur Coulant = mention sans gluten sur la carte.",
        "Ne pas proposer automatiquement tous les plats : beaucoup ont pain, focaccia, toast, blini, boulgour ou panure.",
        "Intolérance ≠ allergie sévère : dans les deux cas, réflexe pro = vérifier la fiche officielle et la contamination croisée.",
      ],
      glutenSafeExamples,
    ),
    scenario(
      "Client : “Je veux manger léger et frais, mais avec du goût.”",
      "🥗",
      "Facile",
      "Réponse serveur : orienter vers salades, avocado toast, fruits frais, pressés minute ou cocktails stars fruités. Éviter spontanément burgers, frites, cheddar, gros desserts chocolatés.",
      [
        "Demander s'il veut salé ou sucré.",
        "Proposer une option fraîche puis une boisson cohérente.",
        "Ne pas vendre un plat très gourmand comme “léger”.",
      ],
      pickItems(items, isFreshLightCandidate, 12),
    ),
    scenario(
      "Client : “Je veux un plat copieux / grande faim.”",
      "🍱",
      "Moyen",
      "Réponse serveur : proposer les plats vraiment nourrissants : Deli Mix Pastrami, Pastrami Burger, Goody Woody, Banquise Sauvage, Fish & Chips, ou Paradis du Paradis si la personne veut plusieurs saveurs à partager. Le Paradis du Paradis = 8 saveurs préférées avec pommes frites et coleslaw, idéal pour 2.",
      [
        "Grande faim solo : burger, toast chaud, marmite ou fish & chips.",
        "À partager : Paradis du Paradis.",
        "Toujours demander chaud/froid et viande/poisson/veggie.",
      ],
      mergeItems(
        pickNamed(items, [
          "Paradis du Paradis",
          "Deli Mix Pastrami",
          "Pastrami Burger",
          "Goody Woody",
          "Banquise Sauvage",
          "Fish & Chips",
          "Citron Beldi",
        ]),
        pickItems(
          items,
          (item) =>
            item.sectionKey === "plats" && containsAny(item, meatTerms),
          4,
        ),
      ),
    ),
    scenario(
      "Client : “Je veux du saumon, mais pas un plat trop lourd.”",
      "🍣",
      "Moyen",
      "Réponse serveur : proposer Le Saumon en avocado toast, Mama Saumon en salade, ou les petites saveurs saumon selon faim. Éviter Banquise Sauvage si le client veut vraiment léger, car toast + pommes frites.",
      [
        "Léger : salade ou avocado toast.",
        "Plus gourmand : Banquise Sauvage.",
        "Assiette à composer : saveur saumon + accompagnement frais.",
      ],
      pickItems(
        items,
        (item) =>
          containsAny(item, ["saumon"]) &&
          containsNone(item, ["profiterole"]),
        10,
      ),
    ),
    scenario(
      "Client : “Je veux un cocktail sans alcool à la mangue.”",
      "🥭",
      "Facile",
      "Réponse serveur : proposer Mangue Énergie, Joséphine Baker côté cocktails stars, ou un cocktail à composer base Fruit/Vegan avec parfum mangue. Attention à ne pas proposer Margarita Mangue, qui contient tequila.",
      [
        "Vérifier alcool : Margarita Mangue = tequila.",
        "Cocktail à composer = bonne solution.",
        "Mangue Énergie = mangue, clémentine corse, citron vert.",
      ],
      pickItems(
        items,
        (item) =>
          item.sectionKey === "boissons" &&
          containsAny(item, ["mangue"]) &&
          noAlcohol(item),
        10,
      ),
    ),
    scenario(
      "Client : “Je veux un cocktail alcoolisé fruité, pas trop sec.”",
      "🍹",
      "Moyen",
      "Réponse serveur : proposer uniquement des alcoolisés : Pink Spritz pour pamplemousse, Hugo Spritz pour floral/sureau, Passion Spritz pour passion, Mojito Fruit pour menthe + fruit, Pina Colada La Fragola pour ananas-coco-fraise, Margarita Mangue ou Danse Joséphine si le client veut mangue/passion.",
      [
        "Ne pas mélanger avec les cocktails stars sans alcool dans ce cas.",
        "Rhum : Mojito Fruit, Daiquiri, Pina Colada, Danse Joséphine.",
        "Tequila : Margarita Mangue. Spritz : Apérol/Prosecco ou St-Germain/Prosecco.",
      ],
      alcoholicFruity,
    ),
    scenario(
      "Client : “Je veux quelque chose vitaminé, avec orange/citron, sans alcool.”",
      "🍊",
      "Facile",
      "Réponse serveur : proposer Vitaminé, Caro't Detox, Mangue Énergie, Grand Soleil ou Rose Paradis selon envie d'agrumes, carotte ou cocktail plus doux.",
      [
        "Pressés Minute = fruits pressés à la demande, sans sucre ajouté.",
        "Citron Pressé à part : servi avec eau et sucre en poudre.",
        "Ne pas confondre citron jaune et citron vert.",
      ],
      pickItems(
        items,
        (item) =>
          item.sectionKey === "boissons" &&
          noAlcohol(item) &&
          containsAny(item, [
            "orange",
            "citron",
            "pamplemousse",
            "vitamine",
            "clementine",
          ]),
        12,
      ),
    ),
    scenario(
      "Client : “C'est quoi le coleslaw ?”",
      "🥬",
      "Moyen",
      "Réponse serveur : expliquer simplement que c'est un accompagnement froid type salade de chou, carotte, pomme, citron, mayonnaise et raisins sec. Si le client parle d'allergie ou d'intolérance, on vérifie la fiche officielle.",
      [
        "Réponse simple : salade froide chou + carotte + citron + mayonnaise + raisins sec + pomme.",
        "Réponse allergie : ne jamais garantir sans fiche officielle.",
        "Il accompagne notamment Deli Mix Pastrami, Sir Homard Lobster et Paradis du Paradis.",
      ],
      pickItems(items, (item) => containsAny(item, ["coleslaw"]), 8),
    ),
    scenario(
      "Client : “Je veux une assiette à composer, je ne comprends pas les formules.”",
      "🎯",
      "Facile",
      "Réponse serveur : Adam & Eve = 2 saveurs + 1 accompagnement. Paradis Terrestre = 3 saveurs + 1 accompagnement. Paradis Céleste = 4 saveurs + 1 accompagnement. Paradis du Paradis = plateau géant de 8 saveurs préférées avec pommes frites et coleslaw, idéal pour 2.",
      [
        "Toujours guider : nombre de saveurs d'abord, accompagnement ensuite.",
        "Formule midi : de 11h30 à 15h00, lundi-vendredi, hors jours fériés.",
        "Paradis du Paradis n'est pas une formule 2/3/4 saveurs : c'est le grand plateau 8 saveurs.",
      ],
      pickItems(
        items,
        (item) =>
          item.sectionKey === "saveurs" && item.categoryKey === "formules",
        8,
      ),
    ),
    scenario(
      "Client : “Je n'aime pas la menthe ni la coriandre.”",
      "🌿",
      "Moyen",
      "Réponse serveur : éviter les boissons/plats avec menthe ou coriandre : Potion Magique contient coriandre ; Tornade Santé, Green Attitude, Lemon Nana, Green Ice'T, thé vert du Paradis contiennent de la menthe.",
      [
        "Coriandre : Potion Magique.",
        "Menthe : plusieurs boissons fraîches et thé vert.",
        "Toujours proposer une alternative fruitée sans herbe.",
      ],
      pickItems(
        items,
        (item) => containsAny(item, ["menthe", "coriandre"]),
        12,
      ),
    ),
    scenario(
      "Client : “Je veux du chocolat/Nutella, le dessert le plus gourmand possible.”",
      "🍫",
      "Facile",
      "Réponse serveur : proposer Chocolat Mon Amour, Profiterole Très Folle, Fondue de Fruits Très Chocolat, Nutella Lover, Nougatella ou Double Choco selon envie à partager ou individuel.",
      [
        "Très gourmand individuel : Chocolat Mon Amour / Profiterole.",
        "À partager : Fondue de Fruits Très Chocolat ou Gaufres Géantes.",
        "Attention fruits à coque/lait/gluten possibles.",
      ],
      pickItems(
        items,
        (item) =>
          item.sectionKey === "desserts" &&
          containsAny(item, [
            "chocolat",
            "nutella",
            "choco",
            "nougatella",
            "fondant",
          ]),
        12,
      ),
    ),
    scenario(
      "Client : “Je veux commander vite, conseillez-moi un combo cohérent.”",
      "⚡",
      "Moyen",
      "Réponse serveur : proposer une logique en 4 choix clairs.\nCombo léger : Le Veggie + Mangue Énergie, frais et lisible.\nCombo rapide : Fish & Chips + Grand Soleil, simple à expliquer et efficace.\nCombo star : Goody Woody + Joséphine Baker et un magnifique dessert.\nCombo gourmand : Deli Mix / Paradis du paradis + Pink Spritz + Chocolat Mon Amour.",
      [
        "Toujours demander : léger, rapide, star ou gourmand ?",
        "Associer un plat riche avec une boisson fraîche/fruitée.",
        "Le combo alcoolisé doit être annoncé clairement comme alcoolisé.",
      ],
      mergeItems(
        pickNamed(items, [
          "Le Veggie",
          "Mangue Énergie",
          "Fish & Chips",
          "Grand Soleil 40cl",
          "Goody Woody",
          "Joséphine Baker",
          "Deli Mix Pastrami",
          "Pink Spritz",
          "Chocolat Mon Amour",
        ]),
        [],
      ),
    ),
  ];
}

function renderSituationsView(items) {
  const scenarios = buildScenarios(items);
  const chevron = `<svg class="review-chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const list = scenarios
    .map((scenario, index) => {
      const open = state.openScenario === index;
      const vars = paletteVars(paletteFromHue(index * 47 + 15));
      const count = scenario.answer.length;
      return `
        <article class="scenario ${open ? "open" : ""}" data-group-key="scenario-${index}" style="${vars}">
          <button class="scenario-head" data-scenario="${index}" aria-expanded="${open}">
            <span class="scenario-emoji">${escapeHtml(scenario.emoji || "🧑‍🍳")}</span>
            <span class="scenario-title">${escapeHtml(scenario.title)}
              <small>Niveau ${escapeHtml(scenario.level || "Moyen")} · ${count} fiche${count > 1 ? "s" : ""} liée${count > 1 ? "s" : ""}</small>
            </span>
            ${chevron}
          </button>
          ${
            open
              ? `
            <div class="scenario-body">
              <div class="scenario-block answer-block">
                <h3>Réponse conseillée</h3>
                <p>${formatText(scenario.response)}</p>
              </div>
              ${
                scenario.checks && scenario.checks.length
                  ? `
                <div class="scenario-block checks-block">
                  <h3>Réflexes à retenir</h3>
                  <ul>${scenario.checks.map((check) => `<li>${escapeHtml(check)}</li>`).join("")}</ul>
                </div>`
                  : ""
              }
              ${count ? `<h3 class="scenario-cards-title">Fiches liées</h3>${renderMiniCards(scenario.answer)}` : renderEmpty("Aucune fiche directe", "Cas à traiter surtout avec la vérification cuisine / allergènes.")}
            </div>`
              : ""
          }
        </article>`;
    })
    .join("");

  return `
    ${renderPageHead({
      vars: paletteVars(paletteFromHue(205)),
      title: `<span class="t">Entraînement</span>`,
      lead: "Des situations de salle réalistes : végétarien, allergies, formules, pièges. Ouvre une situation, réfléchis à ta réponse, puis compare.",
    })}
    <div class="scenarios">${list}</div>
  `;
}
