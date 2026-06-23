(function () {
  "use strict";

  const APP_VERSION = "v14";
  const STORAGE_KEY = `paradis_${APP_VERSION}_progress`;
  const QUIZ_KEY = `paradis_${APP_VERSION}_quiz`;

  const SECTION_ACCENTS = {
    plats: "#C45A2C",
    saveurs: "#1F6B45",
    boissons: "#1B7F76",
    desserts: "#A8385F"
  };

  function sectionAccent(sectionKey, section) {
    return SECTION_ACCENTS[sectionKey] || (section && section.color) || "#1F6B45";
  }

  const state = {
    view: "apprendre",
    sectionKey: "plats",
    query: "",
    open: {},
    progress: loadJson(STORAGE_KEY, {}),
    quiz: loadJson(QUIZ_KEY, null),
    showAnswer: false
  };

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

  function getSections() {
    return window.SECTIONS && typeof window.SECTIONS === "object" ? window.SECTIONS : null;
  }

  function flattenItems() {
    const sections = getSections();
    if (!sections) return [];
    const out = [];

    Object.entries(sections).forEach(([sectionKey, section]) => {
      Object.entries(section.categories || {}).forEach(([categoryKey, category]) => {
        (category.items || []).forEach((item, index) => {
          const id = `${sectionKey}__${categoryKey}__${slugify(item.name)}__${index}`;
          out.push({
            ...item,
            id,
            sectionKey,
            sectionLabel: section.label || sectionKey,
            sectionColor: sectionAccent(sectionKey, section),
            categoryKey,
            categoryLabel: category.label || categoryKey,
            categoryEmoji: category.emoji || "🍽️"
          });
        });
      });
    });

    return out;
  }

  function itemText(item) {
    return normalizeText(`${item.name || ""} ${(item.ingredients || []).join(" ")} ${item.memo || ""} ${item.trap || ""} ${item.warning || ""} ${item.categoryLabel || ""} ${item.sectionLabel || ""}`);
  }

  function has(item, term) {
    return itemText(item).includes(normalizeText(term));
  }

  function getProgress(id) {
    return state.progress[id] || "new";
  }

  function setProgress(id, value) {
    if (value === "new") delete state.progress[id];
    else state.progress[id] = value;
    saveJson(STORAGE_KEY, state.progress);
    render();
  }

  function getRevisionAllergens(item) {
    const text = normalizeText(`${item.name || ""} ${(item.ingredients || []).join(" ")} ${item.memo || ""}`);
    const allergens = [];
    const add = (name) => {
      if (!allergens.includes(name)) allergens.push(name);
    };

    if (text.includes("thon") || text.includes("saumon") || text.includes("merlu") || text.includes("limande") || text.includes("poisson") || text.includes("gravlax")) add("Poissons");
    if (text.includes("crevette") || text.includes("homard") || text.includes("crustace") || text.includes("lobster")) add("Crustacés");
    if (text.includes("oeuf") || text.includes("brouillade") || text.includes("mayonnaise") || text.includes("caesar") || text.includes("tartare") || text.includes("meringue") || text.includes("pancake") || text.includes("gaufre") || text.includes("chou") || text.includes("profiterole") || text.includes("cheesecake")) add("Œufs");
    const hasLaitAnimal = text.includes("lait") && !text.includes("lait de coco");
    if (hasLaitAnimal || text.includes("creme") || text.includes("cheddar") || text.includes("chevre") || text.includes("mozzarella") || text.includes("burrata") || text.includes("feta") || text.includes("cheese") || text.includes("camembert") || text.includes("grana") || text.includes("yaourt") || text.includes("yogurt") || text.includes("yolita") || text.includes("glace") || text.includes("vanille") || text.includes("nougat") || text.includes("cappuccino") || text.includes("latte")) add("Lait / lactose");
    const hasNoixCoque = text.includes("noix") && !text.includes("noix de coco");
    if (hasNoixCoque || text.includes("amande") || text.includes("pistache") || text.includes("praline") || text.includes("noisette")) add("Fruits à coque");
    if (text.includes("celeri")) add("Céleri");
    if (text.includes("moutarde")) add("Moutarde");
    if (text.includes("sesame")) add("Graines de sésame");
    if (text.includes("edamames") || text.includes("soja") || text.includes("thai") || text.includes("tom yum") || text.includes("sweet chili")) add("Soja possible");
    if (text.includes("spritz") || text.includes("vin") || text.includes("prosecco") || text.includes("aperol") || text.includes("martini") || text.includes("cidre") || text.includes("vinaigre") || text.includes("vinaigrette") || text.includes("chutney") || text.includes("olive")) add("Sulfites possibles");
    if ((text.includes("focaccia") || text.includes("pita") || text.includes("blini") || text.includes("chou") || text.includes("panure") || text.includes("pane") || text.includes("panko") || text.includes("muesli") || text.includes("toast") || text.includes("gnocchi") || text.includes("gaufre") || text.includes("pancake") || text.includes("cereales") || text.includes("burger") || text.includes("pain") || text.includes("brioche") || text.includes("boulgour") || text.includes("tarte") || text.includes("cheesecake") || text.includes("gateau") || text.includes("biere") || text.includes("ipa")) && !text.includes("sans gluten")) add("Gluten possible");

    return allergens;
  }

  function getTrapNotes(item) {
    const text = itemText(item);
    const traps = [];
    const push = (note) => {
      if (note && !traps.includes(note)) traps.push(note);
    };

    push(item.trap);
    push(item.warning);
    if (text.includes("tartinade de thon")) push("Piège thon : contient céleri et poivron, avec thon Listao.");
    if (text.includes("fish chips") && !text.includes("mini")) push("Différence clé : le Fish & Chips plat utilise du merlu du Cap.");
    if (text.includes("mini fish chips")) push("Différence clé : le Mini Fish & Chips des assiettes utilise de la limande.");
    if (text.includes("pomme bio") && item.sectionKey === "boissons") push("Boissons avec pomme Bio : servies avec une tige de céleri frais.");
    if (text.includes("jus aloe vera") || text.includes("aloe vera")) push("Veggie Detox : présence de sucre dans le jus aloe vera.");
    if (text.includes("truffe")) push("Truffe : truffe d'été, Tuber aestivum.");
    if (text.includes("bacardi carta oro")) push("Alcool : rhum Bacardi Carta Oro.");
    if (text.includes("camino real")) push("Alcool : tequila Camino Real.");
    if (text.includes("bombay sapphire")) push("Alcool : gin Bombay Sapphire.");
    return traps;
  }

  function getIngredientStyle(name) {
    const lower = normalizeText(name);
    if (lower.includes("saumon") || lower.includes("thon") || lower.includes("merlu") || lower.includes("crevette") || lower.includes("homard")) return "background:#E7EEF2;color:#2B5B72;border:1px solid #C9DCE4";
    if (lower.includes("poulet") || lower.includes("dinde") || lower.includes("pastrami") || lower.includes("boeuf")) return "background:#F2EADC;color:#7A5230;border:1px solid #E2D2B8";
    if (lower.includes("fraise") || lower.includes("framboise") || lower.includes("grenade") || lower.includes("cranberry") || lower.includes("pasteque")) return "background:#F7E3DD;color:#A8385F;border:1px solid #EBC4BA";
    if (lower.includes("mangue") || lower.includes("orange") || lower.includes("abricot") || lower.includes("peche") || lower.includes("carotte")) return "background:#FBE8D8;color:#C45A2C;border:1px solid #F0CCA8";
    if (lower.includes("citron") || lower.includes("banane") || lower.includes("ananas")) return "background:#F8EFC9;color:#8A6A12;border:1px solid #EBDC9E";
    if (lower.includes("kale") || lower.includes("menthe") || lower.includes("basilic") || lower.includes("pistou") || lower.includes("avocat") || lower.includes("salade") || lower.includes("concombre") || lower.includes("epinard") || lower.includes("persil") || lower.includes("roquette") || lower.includes("courgette")) return "background:#E4EEE2;color:#1F6B45;border:1px solid #C7DEC4";
    if (lower.includes("cheddar") || lower.includes("chevre") || lower.includes("mozzarella") || lower.includes("burrata") || lower.includes("feta") || lower.includes("cream") || lower.includes("lait") || lower.includes("glace") || lower.includes("yogurt") || lower.includes("yolita")) return "background:#EFE7F1;color:#6B3E72;border:1px solid #DCC9DF";
    if (lower.includes("chocolat") || lower.includes("nutella") || lower.includes("caramel") || lower.includes("noisette")) return "background:#EFE2D6;color:#5C3A22;border:1px solid #DDC4AE";
    return "background:#F1EEE5;color:#4A5650;border:1px solid #DCD6C6";
  }

  function renderBadges(item) {
    const progress = getProgress(item.id);
    const allergens = getRevisionAllergens(item);
    const trapCount = getTrapNotes(item).length;
    const badges = [];

    if (progress === "known") badges.push(`<span class="badge ok">✅ maîtrisé</span>`);
    if (progress === "review") badges.push(`<span class="badge warn">🔁 à revoir</span>`);
    if (trapCount) badges.push(`<span class="badge warn">⚠️ ${trapCount} piège${trapCount > 1 ? "s" : ""}</span>`);
    if (allergens.length) badges.push(`<span class="badge info">Allergènes indicatifs : ${allergens.length}</span>`);
    if (isAlcoholItem(item)) badges.push(`<span class="badge err">🍸 alcool</span>`);

    return `<div class="badges">${badges.join("") || `<span class="badge">nouveau</span>`}</div>`;
  }

  function renderItemCard(item) {
    const ingredients = (item.ingredients || [])
      .map((ingredient) => `<span class="ingredient" style="${getIngredientStyle(ingredient)}">${escapeHtml(ingredient)}</span>`)
      .join("");
    const traps = getTrapNotes(item);
    const allergens = getRevisionAllergens(item);
    const progress = getProgress(item.id);

    return `
      <article class="product panel" data-id="${escapeHtml(item.id)}" style="--accent:${escapeHtml(item.sectionColor)}">
        <div class="product-accent"></div>
        <div class="product-head">
          <div>
            <div class="path">${escapeHtml(item.sectionLabel)} · ${escapeHtml(item.categoryLabel)}</div>
            <div class="product-title">${escapeHtml(item.name)}</div>
            ${renderBadges(item)}
          </div>
        </div>
        <div class="product-body">
          ${ingredients ? `<div><div class="box-title">Composition</div><div class="ingredient-list">${ingredients}</div></div>` : ""}
          ${item.memo ? `<div class="info-box memo"><div class="box-title">Mémo</div><div class="box-text">${escapeHtml(item.memo)}</div></div>` : ""}
          ${traps.length ? `<div class="info-box trap"><div class="box-title">Pièges / détails à retenir</div><div class="box-text">${traps.map(escapeHtml).join("<br>")}</div></div>` : ""}
          ${allergens.length ? `<div class="info-box allergens"><div class="box-title">Allergènes indicatifs, à vérifier officiellement</div><div class="box-text">${allergens.map(escapeHtml).join(" · ")}</div></div>` : ""}
        </div>
        <div class="actions">
          <button class="action-btn ${progress === "review" ? "review" : "neutral"}" data-action="review" data-id="${escapeHtml(item.id)}">À revoir</button>
          <button class="action-btn ${progress === "known" ? "know" : "neutral"}" data-action="known" data-id="${escapeHtml(item.id)}">Maîtrisé</button>
        </div>
      </article>
    `;
  }

  function renderTop(items) {
    const total = items.length;
    const known = items.filter((item) => getProgress(item.id) === "known").length;
    const review = items.filter((item) => getProgress(item.id) === "review").length;
    const sections = Object.keys(getSections() || {}).length;

    return `
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand-row">
            <div class="brand">
              <div class="logo">🍍</div>
              <div>
                <h1 class="brand-title">Paradis du Fruit</h1>
                <div class="brand-subtitle">Révision</div>
              </div>
            </div>
            <div class="score-pill">${known}/${total} maîtrisés · ${percent(known, total)}%</div>
          </div>
          <div class="progress-line"><div class="progress-fill" style="width:${percent(known, total)}%"></div></div>
          <nav class="nav">
            ${navButton("apprendre", "📚 Apprendre")}
            ${navButton("recherche", "🔎 Recherche")}
            ${navButton("revision", `🔁 À revoir ${review ? `(${review})` : ""}`)}
            ${navButton("quiz", "🎯 Quiz")}
            ${navButton("situations", "🧑‍🍳 Situations")}
          </nav>
        </div>
      </header>
      <main class="app">
        <section class="dashboard">
          ${stat("Fiches", total)}
          ${stat("Sections", sections)}
          ${stat("Maîtrisées", known)}
          ${stat("À revoir", review)}
        </section>
    `;
  }

  function navButton(view, label) {
    return `<button class="nav-btn ${state.view === view ? "active" : ""}" data-view="${view}">${label}</button>`;
  }

  function stat(label, value) {
    return `<div class="stat"><div class="stat-label">${escapeHtml(label)}</div><div class="stat-value">${escapeHtml(value)}</div></div>`;
  }

  function renderSectionTabs() {
    const sections = getSections();
    return `
      <div class="section-tabs">
        ${Object.entries(sections).map(([key, section]) => {
          const count = Object.values(section.categories || {}).reduce((sum, cat) => sum + ((cat.items || []).length), 0);
          return `
            <button class="section-btn ${state.sectionKey === key ? "active" : ""}" data-section="${escapeHtml(key)}" style="--section-color:${escapeHtml(sectionAccent(key, section))}">
              <div class="section-name">${escapeHtml(section.label || key)}</div>
              <div class="section-meta">${count} fiches</div>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderLearnView() {
    const sections = getSections();
    const section = sections[state.sectionKey] || sections[Object.keys(sections)[0]];
    const sectionKey = state.sectionKey in sections ? state.sectionKey : Object.keys(sections)[0];

    return `
      <section class="panel panel-pad">
        <div class="view-title">
          <div>
            <div class="eyebrow">Mode apprentissage</div>
            <h2 class="h2">Apprendre par familles</h2>
          </div>
          <p class="muted">Ouvre les catégories, lis la composition, marque ce qui est maîtrisé ou à revoir.</p>
        </div>
        ${renderSectionTabs()}
      </section>
      <section style="margin-top:14px">
        ${Object.entries(section.categories || {}).map(([categoryKey, category]) => renderCategory(sectionKey, section, categoryKey, category)).join("")}
      </section>
    `;
  }

  function renderCategory(sectionKey, section, categoryKey, category) {
    const key = `${sectionKey}.${categoryKey}`;
    const isOpen = state.open[key] === true;
    const items = category.items || [];
    const known = items.filter((item, index) => getProgress(`${sectionKey}__${categoryKey}__${slugify(item.name)}__${index}`) === "known").length;

    return `
      <div class="category panel" style="--cat-accent:${escapeHtml(sectionAccent(sectionKey, section))}">
        <button class="category-head" data-toggle="${escapeHtml(key)}">
          <div class="category-left">
            <div class="emoji-box" style="--cat-accent:${escapeHtml(sectionAccent(sectionKey, section))}">${escapeHtml(category.emoji || "🍽️")}</div>
            <div>
              <div class="category-name">${escapeHtml(category.label || categoryKey)}</div>
              <div class="category-meta">${items.length} fiches · ${known} maîtrisées</div>
            </div>
          </div>
          <div class="badge">${isOpen ? "Refermer" : "Ouvrir"}</div>
        </button>
        ${isOpen ? `<div class="category-body"><div class="grid">${items.map((item, index) => renderItemCard({
          ...item,
          id: `${sectionKey}__${categoryKey}__${slugify(item.name)}__${index}`,
          sectionKey,
          sectionLabel: section.label || sectionKey,
          sectionColor: sectionAccent(sectionKey, section),
          categoryKey,
          categoryLabel: category.label || categoryKey,
          categoryEmoji: category.emoji || "🍽️"
        })).join("")}</div></div>` : ""}
      </div>
    `;
  }

  function renderSearchView(items) {
    const q = normalizeText(state.query);
    let results;

    if (!q) {
      results = items.slice(0, 24);
    } else if (q === "alcool" || q === "alcoolise" || q === "cocktail alcoolise") {
      results = items.filter(isAlcoholItem).slice(0, 80);
    } else if (q === "sans alcool" || q === "non alcoolise" || q === "soft") {
      results = items.filter((item) => item.sectionKey === "boissons" && !isAlcoholItem(item)).slice(0, 80);
    } else if (q === "veggie" || q === "vegetarien" || q === "vegetarienne") {
      results = items.filter((item) => isVegetarianCandidate(item) || itemText(item).includes(q)).slice(0, 80);
    } else {
      results = items.filter((item) => itemText(item).includes(q)).slice(0, 80);
    }

    const quickFilters = ["banane", "fraise", "orange", "dinde", "poulet", "saumon", "veggie", "chocolat", "alcool", "sans alcool"];

    return `
      <section class="panel panel-pad">
        <div class="view-title">
          <div>
            <div class="eyebrow">Recherche rapide</div>
            <h2 class="h2">Trouver un produit ou un ingrédient</h2>
          </div>
        </div>
        <input class="input" id="searchInput" value="${escapeHtml(state.query)}" placeholder="Ex : saumon, banane, poulet, veggie, alcool, sans alcool..." autocomplete="off">
        <div class="quick-tags">
          ${quickFilters.map((tag) => `<button class="tag-btn" data-search="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("")}
        </div>
      </section>
      <section style="margin-top:14px" class="grid">
        ${results.length ? results.map(renderItemCard).join("") : renderEmpty("Aucun résultat", "Essaie un ingrédient plus simple, par exemple “saumon”, “mangue” ou “sans alcool”.")}
      </section>
    `;
  }

  function renderReviewView(items) {
    const review = items.filter((item) => getProgress(item.id) === "review");
    return `
      <section class="panel panel-pad">
        <div class="view-title">
          <div>
            <div class="eyebrow">Révision ciblée</div>
            <h2 class="h2">Tes fiches à revoir</h2>
          </div>
          <p class="muted">Le panier anti-oubli. Tu y places les fiches qui glissent encore entre les neurones.</p>
        </div>
      </section>
      <section style="margin-top:14px" class="grid">
        ${review.length ? review.map(renderItemCard).join("") : renderEmpty("Aucune fiche à revoir", "Marque des produits “À revoir” dans l'apprentissage ou la recherche.")}
      </section>
    `;
  }

  function containsAnyText(text, terms) {
    const normalized = normalizeText(text);
    return terms.some((term) => normalized.includes(normalizeText(term)));
  }

  function containsAny(item, terms) {
    return containsAnyText(itemText(item), terms);
  }

  function containsNone(item, terms) {
    return !containsAny(item, terms);
  }

  function isAlcoholItem(item) {
    if (!item || item.sectionKey !== "boissons") return false;
    const alcoholicCategories = new Set(["spritz", "margaritas_daiquiris", "pina_coladas", "mixologie_fine"]);
    if (alcoholicCategories.has(item.categoryKey)) return true;
    if (item.categoryKey === "mojitos") return !containsAnyText(item.name, ["virgin"]);
    if (item.categoryKey === "eaux_bieres_vins") {
      return containsAnyText(item.name, ["gallia", "ipa", "cidre", "vin blanc", "vin rouge", "vin rose", "rosé", "orsuro", "belleruche"]);
    }
    return false;
  }

  function isUtilityQuizItem(item) {
    const text = itemText(item);
    return containsAnyText(text, [
      "2 parfums au choix et fruits de saison",
      "1 parfum au choix et fruits de saison",
      "parfum supplementaire",
      "supplements glaces",
      "toppings yolita",
      "liste reglementaire des cotes",
      "parfums a composer",
      "fruit supplementaire",
      "planche de 3 pitas",
      "brunch boisson chaude",
      "brunch jus d orange",
      "brunch decoupe d ananas frais",
      "formule midi choisis ta bulle"
    ]);
  }

  function isGoodCompositionQuizItem(item) {
    const ingredients = item.ingredients || [];
    if (isUtilityQuizItem(item)) return false;
    if (ingredients.length < 3) return false;
    if (containsAnyText(item.name, ["a composer", "au choix"])) return false;
    return true;
  }

  function cleanItemName(name) {
    return String(name || "").replace(/^\d+\.\s*/, "").trim();
  }

  function compactIngredients(item, limit = 6) {
    return (item.ingredients || [])
      .filter((ingredient) => !containsAnyText(ingredient, ["au choix", "a partager ou pas", "accompagnement froid"]))
      .slice(0, limit);
  }

  function question(id, category, type, difficulty, questionText, answer, sourceId) {
    return {
      id: sourceId || id,
      qid: id,
      category,
      type,
      difficulty,
      question: questionText,
      answer
    };
  }

  function buildManualQuestions(items, onlyWeak) {
    if (onlyWeak) return [];
    const findOne = (terms) => items.find((item) => containsAny(item, terms)) || items[0];
    const refs = {
      thon: findOne(["tartinade de thon"]),
      fish: findOne(["fish chips merlu"]),
      miniFish: findOne(["mini fish chips limande"]),
      bulle: findOne(["dans ta bulle", "bulle citron jaune"]),
      formule: findOne(["adam eve", "paradis terrestre", "paradis celeste"]),
      fondant: findOne(["fondant coeur coulant"]),
      detox: findOne(["veggie detox"]),
      pommeBio: findOne(["pomme bio"]),
      coleslaw: findOne(["coleslaw"]),
      spritz: findOne(["spritz original"]),
      composer: findOne(["yoyo a composer", "vegan a composer"])
    };

    return [
      question(
        "manual__fish_chips_difference",
        "Pièges carte",
        "Comparaison",
        "Difficile",
        "Différence à connaître : Fish & Chips plat vs Mini Fish & Chips des assiettes ?",
        "Fish & Chips en plat = merlu du Cap croustillant, frites, mesclun et sauce tartare. Mini Fish & Chips des assiettes = limande avec sauce tartare.",
        refs.fish && refs.fish.id
      ),
      question(
        "manual__thon_celeri",
        "Pièges allergènes",
        "Réflexe service",
        "Difficile",
        "Un client allergique au céleri veut une tartinade de thon : quel piège dois-tu avoir en tête ?",
        "La tartinade de thon contient du céleri et du poivron, avec du thon Listao. Réflexe pro : ne pas improviser, vérifier la liste officielle des allergènes.",
        refs.thon && refs.thon.id
      ),
      question(
        "manual__pomme_bio_celeri",
        "Boissons",
        "Piège garniture",
        "Moyen",
        "Quels cocktails avec pomme Bio ont un détail de service à ne pas oublier ?",
        "Double Force, Apple Bunny, Tornade Santé, Green Attitude et Super Green contiennent de la pomme Bio et sont accompagnés d'une tige de céleri.",
        refs.pommeBio && refs.pommeBio.id
      ),
      question(
        "manual__veggie_detox_sucre",
        "Boissons",
        "Piège composition",
        "Moyen",
        "Pourquoi le Veggie Detox n'est pas à présenter comme complètement “sans sucre” ?",
        "Il contient concombre, kale, menthe et jus aloe vera. Le piège : présence de sucre dans le jus aloe vera.",
        refs.detox && refs.detox.id
      ),
      question(
        "manual__fondant_sans_gluten",
        "Desserts",
        "Allergène",
        "Moyen",
        "Quel dessert de la carte est explicitement indiqué sans gluten ?",
        "Le Fondant Cœur Coulant : fondant au chocolat sans gluten, accompagné de crème anglaise et crème fouettée. Attention : vérifier quand même la procédure cuisine en cas d'allergie sévère.",
        refs.fondant && refs.fondant.id
      ),
      question(
        "manual__assiettes_formules",
        "Assiettes à composer",
        "Formule",
        "Facile",
        "Combien de saveurs dans Adam & Eve, Paradis Terrestre et Paradis Céleste ?",
        "Adam & Eve = 2 saveurs + 1 accompagnement. Paradis Terrestre = 3 saveurs + 1 accompagnement. Paradis Céleste = 4 saveurs + 1 accompagnement. Paradis du Paradis = plateau géant de 8 saveurs avec frites et coleslaw, idéal à partager.",
        refs.formule && refs.formule.id
      ),
      question(
        "manual__formule_midi",
        "Assiettes à composer",
        "Service",
        "Moyen",
        "Quand s'appliquent les formules midi des assiettes à composer ?",
        "De 11h30 à 15h00, du lundi au vendredi, hors jours fériés. Elles ajoutent “Choisis ta bulle” selon la formule concernée.",
        refs.formule && refs.formule.id
      ),
      question(
        "manual__dans_ta_bulle",
        "Boissons",
        "Composition",
        "Moyen",
        "C'est quoi “Dans ta Bulle XXL” ?",
        "Une boisson XXL de 45cl à base de tonic, avec une touche d'amertume. Choix : citron jaune, concombre, orange fraîchement pressée, ananas-verveine ou framboise-cranberry-hibiscus.",
        refs.bulle && refs.bulle.id
      ),
      question(
        "manual__cocktails_composer",
        "Boissons",
        "Structure",
        "Moyen",
        "Comment expliquer les Cocktails à Composer ?",
        "Le client choisit une base : Yoyo, Fruit, Milk ou Vegan, puis 1 ou 2 parfums parmi la liste. Le fruit supplémentaire est une option.",
        refs.composer && refs.composer.id
      ),
      question(
        "manual__presses_sans_sucre",
        "Boissons",
        "Promesse carte",
        "Facile",
        "Quelle est la promesse des Pressés Minute ?",
        "Fruits pressés à la demande, sans sucre ajouté. Exception à ne pas confondre : le Citron Pressé est servi avec eau et sucre en poudre.",
        refs.pommeBio && refs.pommeBio.id
      ),
      question(
        "manual__alcool_bases",
        "Mixologie",
        "Alcools",
        "Difficile",
        "Associe les grandes familles d'alcools : Margarita, Daiquiri, Mojito, Pina Colada, Spritz, Basilic Instinct.",
        "Margarita = tequila Camino Real. Daiquiri, Mojito et Pina Colada = rhum Bacardi Carta Oro. Spritz = Apérol/Prosecco ou St-Germain/Prosecco pour Hugo. Basilic Instinct = gin Bombay Sapphire.",
        refs.spritz && refs.spritz.id
      ),
      question(
        "manual__coleslaw",
        "Vocabulaire carte",
        "Service client",
        "Moyen",
        "Un client demande : “C'est quoi le coleslaw ?” Que répondre simplement ?",
        "C'est un accompagnement froid type salade de chou, carotte et raisins, avec une sauce plutôt crémeuse/sucrée. Pour une allergie, ne jamais garantir : vérifier la fiche officielle.",
        refs.coleslaw && refs.coleslaw.id
      )
    ];
  }

  function buildDynamicQuestions(items, onlyWeak = false) {
    const source = onlyWeak ? items.filter((item) => getProgress(item.id) === "review") : items;
    const bank = [];
    const eligible = source.filter(isGoodCompositionQuizItem);

    eligible.forEach((item) => {
      const ingredients = compactIngredients(item, 8);
      if (ingredients.length >= 3) {
        bank.push(question(
          `composition__${item.id}`,
          item.categoryLabel,
          "Composition",
          ingredients.length >= 6 ? "Difficile" : "Moyen",
          `Donne la composition utile de “${cleanItemName(item.name)}”.`,
          ingredients.join(" · "),
          item.id
        ));
      }

      const reverse = compactIngredients(item, 4);
      if (reverse.length >= 3 && !containsAnyText(item.name, ["original", "l'original"])) {
        bank.push(question(
          `reverse__${item.id}`,
          item.categoryLabel,
          "Reconnaissance",
          "Moyen",
          `Quel produit correspond à : ${reverse.join(" · ")} ?`,
          `${cleanItemName(item.name)} (${item.categoryLabel})`,
          item.id
        ));
      }

      const traps = getTrapNotes(item);
      if (traps.length) {
        bank.push(question(
          `trap__${item.id}`,
          item.categoryLabel,
          "Piège",
          "Difficile",
          `Quel piège ou détail de service retenir pour “${cleanItemName(item.name)}” ?`,
          traps.join(" · "),
          item.id
        ));
      }

      const allergens = getRevisionAllergens(item);
      if (allergens.length >= 2 && !containsAnyText(item.name, ["liste", "supplement", "parfums"])) {
        bank.push(question(
          `allergens__${item.id}`,
          item.categoryLabel,
          "Vigilance allergènes",
          "Difficile",
          `Quels allergènes indicatifs dois-tu vérifier pour “${cleanItemName(item.name)}” ?`,
          `${allergens.join(" · ")}. Réflexe : confirmer avec la liste officielle et/ou la cuisine.`,
          item.id
        ));
      }

      if (isAlcoholItem(item)) {
        const alcohols = (item.ingredients || []).filter((ingredient) => containsAnyText(ingredient, [
          "rhum", "tequila", "gin", "aperol", "prosecco", "martini", "st-germain", "biere", "cidre", "vin"
        ]));
        if (alcohols.length) {
          bank.push(question(
            `alcohol__${item.id}`,
            item.categoryLabel,
            "Alcool",
            "Moyen",
            `Quel alcool contient “${cleanItemName(item.name)}” ?`,
            alcohols.join(" · "),
            item.id
          ));
        }
      }
    });

    return bank;
  }

  function buildKeywordQuestions(items, onlyWeak = false) {
    if (onlyWeak) return [];
    const cases = [
      {
        id: "keyword__gravlax",
        category: "Sauces",
        type: "Association",
        difficulty: "Moyen",
        term: "gravlax",
        q: "Quels produits de la carte sont associés à la sauce gravlax ?"
      },
      {
        id: "keyword__pistou",
        category: "Sauces",
        type: "Association",
        difficulty: "Moyen",
        term: "pistou",
        q: "Quels produits contiennent du pistou ?"
      },
      {
        id: "keyword__cheddar",
        category: "Fromage",
        type: "Association",
        difficulty: "Moyen",
        term: "cheddar",
        q: "Cite des produits où le Cheddar apparaît."
      },
      {
        id: "keyword__sweet_chili",
        category: "Sauces",
        type: "Association",
        difficulty: "Difficile",
        term: "sweet chili",
        q: "Quelle saveur utilise la sauce sweet chili ?"
      },
      {
        id: "keyword__tom_yum",
        category: "Marmites",
        type: "Association",
        difficulty: "Difficile",
        term: "tom yum",
        q: "Quelle marmite contient la sauce tom yum ?"
      }
    ];

    return cases.map((entry) => {
      const matches = items.filter((item) => has(item, entry.term)).slice(0, 8);
      return question(
        entry.id,
        entry.category,
        entry.type,
        entry.difficulty,
        entry.q,
        matches.length ? matches.map((item) => cleanItemName(item.name)).join(" · ") : "Aucune fiche trouvée.",
        matches[0] && matches[0].id
      );
    });
  }

  function buildQuestions(items, onlyWeak = false) {
    const dynamic = buildDynamicQuestions(items, onlyWeak);
    const manual = buildManualQuestions(items, onlyWeak);
    const keyword = buildKeywordQuestions(items, onlyWeak);
    const bank = [...manual, ...keyword, ...dynamic];

    const uniqueByQuestion = [];
    const seen = new Set();
    bank.forEach((entry) => {
      const key = normalizeText(entry.question);
      if (!key || seen.has(key)) return;
      seen.add(key);
      uniqueByQuestion.push(entry);
    });

    return shuffle(uniqueByQuestion).slice(0, Math.min(40, uniqueByQuestion.length));
  }

  function renderQuizView(items) {
    if (!state.quiz || !Array.isArray(state.quiz.questions) || !state.quiz.questions.length) {
      const weakCount = items.filter((item) => getProgress(item.id) === "review").length;
      return `
        <section class="quiz-card panel panel-pad">
          <div class="view-title">
            <div>
              <div class="eyebrow">Quiz renforcé</div>
              <h2 class="h2">Interrogation utile, pas récitation bête</h2>
            </div>
          </div>
          <p class="muted">Le quiz évite maintenant les questions creuses du type “2 parfums au choix”. Il mélange compositions, pièges, allergènes indicatifs, alcools, formules et reconnaissance d'ingrédients.</p>
          <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:14px">
            <button class="action-btn primary" data-quiz="all">Quiz complet</button>
            <button class="action-btn review" data-quiz="weak">Mes erreurs (${weakCount})</button>
          </div>
        </section>
      `;
    }

    const quiz = state.quiz;
    const total = quiz.questions.length;
    const current = quiz.questions[quiz.index];

    if (!current) {
      return `
        <section class="quiz-card panel panel-pad" style="text-align:center">
          <div style="font-size:54px">🏆</div>
          <h2 class="h2">Quiz terminé</h2>
          <p class="muted">Score : ${quiz.ok || 0} maîtrisé${(quiz.ok || 0) > 1 ? "s" : ""} · ${quiz.nok || 0} à revoir</p>
          <button class="action-btn primary" style="width:100%;margin-top:14px" data-quiz="all">Recommencer</button>
        </section>
      `;
    }

    return `
      <section class="quiz-card panel panel-pad">
        <div class="view-title">
          <div>
            <div class="eyebrow">${escapeHtml(current.category || "Quiz")}</div>
            <h2 class="h2">Question ${quiz.index + 1} / ${total}</h2>
            <div class="muted">✅ ${quiz.ok || 0} · ❌ ${quiz.nok || 0}</div>
          </div>
          <button class="tag-btn" data-quiz="all">Nouveau</button>
        </div>
        <div class="badges" style="margin-bottom:12px">
          <span class="badge info">${escapeHtml(current.type || "Question")}</span>
          <span class="badge warn">Niveau : ${escapeHtml(current.difficulty || "Moyen")}</span>
        </div>
        <div class="progress-line" style="margin-bottom:18px"><div class="progress-fill" style="width:${percent(quiz.index + 1, total)}%"></div></div>
        <div style="font-size:21px;font-weight:930;line-height:1.35;margin-bottom:18px">${escapeHtml(current.question)}</div>
        ${state.showAnswer ? `
          <div class="answer" style="margin-bottom:14px">${escapeHtml(current.answer)}</div>
          <div class="actions" style="padding:0">
            <button class="action-btn review" data-quiz-next="nok" data-id="${escapeHtml(current.id)}">À revoir</button>
            <button class="action-btn know" data-quiz-next="ok" data-id="${escapeHtml(current.id)}">Maîtrisé</button>
          </div>
        ` : `<button class="action-btn primary" style="width:100%" data-show-answer="1">Voir la réponse</button>`}
      </section>
    `;
  }

  function pickItems(items, predicate, limit = 8) {
    return items.filter(predicate).slice(0, limit);
  }

  function withoutAllergens(item, allergens) {
    const itemAllergens = getRevisionAllergens(item).map(normalizeText);
    return allergens.every((allergen) => !itemAllergens.includes(normalizeText(allergen)));
  }

  function isVegetarianCandidate(item) {
    if (isAlcoholItem(item)) return false;
    if (containsAny(item, ["poulet", "dinde", "pastrami", "boeuf", "thon", "saumon", "merlu", "limande", "crevette", "homard", "poisson", "rhum", "tequila", "gin", "aperol", "prosecco", "cidre", "vin", "biere"])) return false;
    return containsAny(item, ["veggie", "vegetarien", "avocat", "chevre", "mozzarella", "burrata", "feta", "camembert", "gnocchis", "salade", "melon", "pasteque", "tutti", "pistou", "legumes"]);
  }

  function isFreshLightCandidate(item) {
    if (isAlcoholItem(item)) return false;
    return containsAny(item, ["salade", "fruits", "decoupe", "frais", "avocat", "concombre", "menthe", "citron", "orange", "pamplemousse", "kiwi", "ananas", "mangue"]) &&
      containsNone(item, ["nutella", "chocolat", "cheddar", "frites", "burger", "pastrami", "cream cheese", "creme fouettee"]);
  }

  function scenario(title, emoji, level, response, checks, answer) {
    return { title, emoji, level, response, checks, answer };
  }

  function formatText(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  function pickNamed(items, names) {
    const normalizedNames = names.map(normalizeText);
    const out = [];
    normalizedNames.forEach((target) => {
      const found = items.find((item) => normalizeText(item.name) === target) ||
        items.find((item) => normalizeText(item.name).includes(target));
      if (found && !out.some((item) => item.id === found.id)) out.push(found);
    });
    return out;
  }

  function mergeItems(...groups) {
    const out = [];
    groups.flat().forEach((item) => {
      if (item && !out.some((existing) => existing.id === item.id)) out.push(item);
    });
    return out;
  }

  function buildScenarios(items) {
    const noAlcohol = (item) => !isAlcoholItem(item);
    const seafoodTerms = ["thon", "saumon", "merlu", "limande", "fish", "crevette", "homard", "poisson", "gravlax"];
    const meatTerms = ["poulet", "dinde", "pastrami", "boeuf"];
    const dairyTerms = ["lait", "creme", "cream", "cheddar", "chevre", "mozzarella", "burrata", "feta", "cheese", "yaourt", "yogurt", "yolita", "glace", "vanille", "nougat", "cappuccino", "latte"];
    const nutTerms = ["noix", "amande", "pistache", "praline", "noisette", "nutella", "nougat"];
    const glutenTerms = ["pita", "focaccia", "blini", "toast", "pain", "brioche", "burger", "boulgour", "gnocchi", "gaufre", "pancake", "tarte", "cheesecake", "gateau", "muesli", "panko", "cereales", "biere", "ipa"];

    const glutenSafeExamples = mergeItems(
      pickNamed(items, ["Fondant Cœur Coulant", "Salade de Fruits Jolie Jolie", "Ma Jolie Mangue", "Grand Soleil 40cl", "Mangue Énergie", "Joséphine Baker", "Cure Détox"]),
      pickItems(items, (item) => item.sectionKey === "boissons" && noAlcohol(item) && containsNone(item, ["milk", "yoyo", "yolita", "muesli", "glace"]), 4)
    ).slice(0, 10);

    const alcoholicFruity = pickNamed(items, [
      "Hugo Spritz",
      "Pink Spritz",
      "Passion Spritz",
      "Mojito Fruit 27cl",
      "Pina Colada La Fragola",
      "Margarita Mangue",
      "Danse Joséphine",
      "Daiquiri Passion & Framboise"
    ]);

    return [
      scenario(
        "Client : “Je suis végétarien, je veux un vrai plat, pas juste une salade triste.”",
        "🌱",
        "Moyen",
        "Réponse serveur : proposer d'abord Le Veggie, Veggie Burger, Pistou Presto, Dolce Paradisio, Tutti Salata ou les pitas/fromages sans viande. Préciser que végétarien ne veut pas dire vegan : beaucoup d'options contiennent fromage, œufs ou crème.",
        [
          "Éviter viande, poisson, crustacés.",
          "Ne pas confondre veggie et vegan.",
          "Pour une contrainte stricte, vérifier les sauces et contaminations possibles."
        ],
        pickItems(items, isVegetarianCandidate, 10)
      ),
      scenario(
        "Client : “Je suis vegan, qu'est-ce que je peux prendre ?”",
        "🥬",
        "Difficile",
        "Réponse serveur : côté boisson, orienter vers les pressés, cocktails fruits et la base Vegan à composer. Côté plats, ne rien promettre sans validation cuisine : beaucoup de recettes contiennent fromage, œufs, crème, miel, pain ou sauces.",
        [
          "Vegan = aucun produit animal, donc attention lait, œuf, fromage, miel, crème, yaourt, glace.",
          "Les boissons fruitées sont les plus simples à orienter.",
          "Toujours vérifier la fiche officielle si le client est strict."
        ],
        pickItems(items, (item) => item.sectionKey === "boissons" && noAlcohol(item) && containsNone(item, ["milk", "lait", "yoyo", "yolita", "yogurt", "miel", "creme", "glace"]), 10)
      ),
      scenario(
        "Client : “Je suis allergique au céleri.”",
        "🚨",
        "Difficile",
        "Réponse serveur : ne pas recommander au hasard. La tartinade de thon contient du céleri, et les boissons avec pomme Bio sont accompagnées d'une tige de céleri. Il faut vérifier officiellement avant commande.",
        [
          "Piège n°1 : tartinade de thon = céleri + poivron.",
          "Piège n°2 : pomme Bio dans plusieurs pressés = tige de céleri.",
          "Réflexe pro : liste allergènes officielle, pas de mémoire freestyle."
        ],
        pickItems(items, (item) => containsAny(item, ["tartinade de thon", "pomme bio", "celeri"]), 10)
      ),
      scenario(
        "Client : “J'ai une allergie aux fruits à coque.”",
        "🥜",
        "Difficile",
        "Réponse serveur : éviter noix, amandes, pistache, noisette, praliné, nougat et Nutella/noisette. Proposer uniquement après vérification officielle, surtout desserts et recettes avec crunch.",
        [
          "Attention aux noix dans la pita chèvre-miel-noix.",
          "Attention amandes dans Citron Beldi, Mama Corail, desserts et coupes glacées.",
          "Pistache, nougat, noisette et praliné sont des pièges dessert."
        ],
        pickItems(items, (item) => containsAny(item, nutTerms), 12)
      ),
      scenario(
        "Client : “Je ne mange ni poisson ni fruits de mer.”",
        "🐟",
        "Moyen",
        "Réponse serveur : écarter thon, saumon, merlu, limande, crevettes, homard et sauces associées. Rediriger vers poulet, veggie, pastrami ou recettes fromage/légumes selon envie.",
        [
          "Fish & Chips = merlu.",
          "Mini Fish & Chips = limande.",
          "Mama Corail = merlu + crevettes.",
          "Sir Homard = homard américain et poissons."
        ],
        pickItems(items, (item) => containsAny(item, seafoodTerms), 12)
      ),
      scenario(
        "Client : “Je veux éviter le lactose / les produits laitiers.”",
        "🥛",
        "Difficile",
        "Réponse serveur : éviter cheddar, chèvre, mozzarella, burrata, feta, cream cheese, crème, yaourt/Yolita, glaces et crème fouettée. Orienter plutôt vers pressés/cocktails fruits, mais vérifier les sauces des plats.",
        [
          "La plupart des desserts sont à risque lait/crème.",
          "Beaucoup de plats salés contiennent fromage ou sauce crémeuse.",
          "La base Vegan à composer est plus sûre côté boisson."
        ],
        pickItems(items, (item) => containsAny(item, dairyTerms), 12)
      ),
      scenario(
        "Client : “Je suis intolérant au gluten, qu'est-ce que je peux prendre ?”",
        "🌾",
        "Difficile",
        "Réponse serveur : côté dessert, le Fondant Cœur Coulant est explicitement indiqué sans gluten sur la carte. Tu peux aussi orienter vers des options très fruitées comme Salade de Fruits Jolie Jolie ou Ma Jolie Mangue, et vers les boissons fruitées sans alcool. En salé, prudence : pain, pita, focaccia, toast, burger, blini, boulgour, panure et gnocchis reviennent souvent. Vérifier la procédure cuisine si allergie sévère.",
        [
          "Fondant Cœur Coulant = mention sans gluten sur la carte.",
          "Ne pas proposer automatiquement tous les plats : beaucoup ont pain, focaccia, toast, blini, boulgour ou panure.",
          "Intolérance ≠ allergie sévère : dans les deux cas, réflexe pro = vérifier la fiche officielle et la contamination croisée."
        ],
        glutenSafeExamples
      ),
      scenario(
        "Client : “Je veux manger léger et frais, mais avec du goût.”",
        "🥗",
        "Facile",
        "Réponse serveur : orienter vers salades, avocado toast, fruits frais, pressés minute ou cocktails stars fruités. Éviter spontanément burgers, frites, cheddar, gros desserts chocolatés.",
        [
          "Demander s'il veut salé ou sucré.",
          "Proposer une option fraîche puis une boisson cohérente.",
          "Ne pas vendre un plat très gourmand comme “léger”."
        ],
        pickItems(items, isFreshLightCandidate, 12)
      ),
      scenario(
        "Client : “Je veux un plat copieux / grande faim.”",
        "🍱",
        "Moyen",
        "Réponse serveur : proposer les plats vraiment nourrissants : Deli Mix Pastrami, Pastrami Burger, Goody Woody, Banquise Sauvage, Fish & Chips, ou Paradis du Paradis si la personne veut plusieurs saveurs à partager. Le Paradis du Paradis = 8 saveurs préférées avec pommes frites et coleslaw, idéal pour 2.",
        [
          "Grande faim solo : burger, toast chaud, marmite ou fish & chips.",
          "À partager : Paradis du Paradis.",
          "Toujours demander chaud/froid et viande/poisson/veggie."
        ],
        mergeItems(
          pickNamed(items, ["Paradis du Paradis", "Deli Mix Pastrami", "Pastrami Burger", "Goody Woody", "Banquise Sauvage", "Fish & Chips", "Citron Beldi"]),
          pickItems(items, (item) => item.sectionKey === "plats" && containsAny(item, meatTerms), 4)
        )
      ),
      scenario(
        "Client : “Je veux du saumon, mais pas un plat trop lourd.”",
        "🍣",
        "Moyen",
        "Réponse serveur : proposer Le Saumon en avocado toast, Mama Saumon en salade, ou les petites saveurs saumon selon faim. Éviter Banquise Sauvage si le client veut vraiment léger, car toast + pommes frites.",
        [
          "Léger : salade ou avocado toast.",
          "Plus gourmand : Banquise Sauvage.",
          "Assiette à composer : saveur saumon + accompagnement frais."
        ],
        pickItems(items, (item) => containsAny(item, ["saumon"]) && containsNone(item, ["profiterole"]), 10)
      ),
      scenario(
        "Client : “Je veux un cocktail sans alcool à la mangue.”",
        "🥭",
        "Facile",
        "Réponse serveur : proposer Mangue Énergie, Joséphine Baker côté cocktails stars, ou un cocktail à composer base Fruit/Vegan avec parfum mangue. Attention à ne pas proposer Margarita Mangue, qui contient tequila.",
        [
          "Vérifier alcool : Margarita Mangue = tequila.",
          "Cocktail à composer = bonne solution.",
          "Mangue Énergie = mangue, clémentine corse, citron vert."
        ],
        pickItems(items, (item) => item.sectionKey === "boissons" && containsAny(item, ["mangue"]) && noAlcohol(item), 10)
      ),
      scenario(
        "Client : “Je veux un cocktail alcoolisé fruité, pas trop sec.”",
        "🍹",
        "Moyen",
        "Réponse serveur : proposer uniquement des alcoolisés : Pink Spritz pour pamplemousse, Hugo Spritz pour floral/sureau, Passion Spritz pour passion, Mojito Fruit pour menthe + fruit, Pina Colada La Fragola pour ananas-coco-fraise, Margarita Mangue ou Danse Joséphine si le client veut mangue/passion.",
        [
          "Ne pas mélanger avec les cocktails stars sans alcool dans ce cas.",
          "Rhum : Mojito Fruit, Daiquiri, Pina Colada, Danse Joséphine.",
          "Tequila : Margarita Mangue. Spritz : Apérol/Prosecco ou St-Germain/Prosecco."
        ],
        alcoholicFruity
      ),
      scenario(
        "Client : “Je veux quelque chose vitaminé, avec orange/citron, sans alcool.”",
        "🍊",
        "Facile",
        "Réponse serveur : proposer Vitaminé, Caro't Detox, Mangue Énergie, Grand Soleil ou Rose Paradis selon envie d'agrumes, carotte ou cocktail plus doux.",
        [
          "Pressés Minute = fruits pressés à la demande, sans sucre ajouté.",
          "Citron Pressé à part : servi avec eau et sucre en poudre.",
          "Ne pas confondre citron jaune et citron vert."
        ],
        pickItems(items, (item) => item.sectionKey === "boissons" && noAlcohol(item) && containsAny(item, ["orange", "citron", "pamplemousse", "vitamine", "clementine"]), 12)
      ),
      scenario(
        "Client : “C'est quoi le coleslaw ?”",
        "🥬",
        "Moyen",
        "Réponse serveur : expliquer simplement que c'est un accompagnement froid type salade de chou, carotte et raisins, avec une sauce plutôt sucrée/crémeuse. Si le client parle d'allergie ou d'intolérance, on vérifie la fiche officielle.",
        [
          "Réponse simple : salade froide chou + carotte + raisins + sauce sucrée/crémeuse.",
          "Réponse allergie : ne jamais garantir sans fiche officielle.",
          "Il accompagne notamment Deli Mix Pastrami, Sir Homard Lobster et Paradis du Paradis."
        ],
        pickItems(items, (item) => containsAny(item, ["coleslaw"]), 8)
      ),
      scenario(
        "Client : “Je veux une assiette à composer, je ne comprends pas les formules.”",
        "🎯",
        "Facile",
        "Réponse serveur : Adam & Eve = 2 saveurs + 1 accompagnement. Paradis Terrestre = 3 saveurs + 1 accompagnement. Paradis Céleste = 4 saveurs + 1 accompagnement. Paradis du Paradis = plateau géant de 8 saveurs préférées avec pommes frites et coleslaw, idéal pour 2.",
        [
          "Toujours guider : nombre de saveurs d'abord, accompagnement ensuite.",
          "Formule midi : de 11h30 à 15h00, lundi-vendredi, hors jours fériés.",
          "Paradis du Paradis n'est pas une formule 2/3/4 saveurs : c'est le grand plateau 8 saveurs."
        ],
        pickItems(items, (item) => item.sectionKey === "saveurs" && item.categoryKey === "formules", 8)
      ),
      scenario(
        "Client : “Je n'aime pas la menthe ni la coriandre.”",
        "🌿",
        "Moyen",
        "Réponse serveur : éviter les boissons/plats avec menthe ou coriandre : Potion Magique contient coriandre ; Tornade Santé, Green Attitude, Lemon Nana, Green Ice'T, thé vert du Paradis contiennent de la menthe.",
        [
          "Coriandre : Potion Magique.",
          "Menthe : plusieurs boissons fraîches et thé vert.",
          "Toujours proposer une alternative fruitée sans herbe."
        ],
        pickItems(items, (item) => containsAny(item, ["menthe", "coriandre"]), 12)
      ),
      scenario(
        "Client : “Je veux du chocolat/Nutella, le dessert le plus gourmand possible.”",
        "🍫",
        "Facile",
        "Réponse serveur : proposer Chocolat Mon Amour, Profiterole Très Folle, Fondue de Fruits Très Chocolat, Nutella Lover, Nougatella ou Double Choco selon envie à partager ou individuel.",
        [
          "Très gourmand individuel : Chocolat Mon Amour / Profiterole.",
          "À partager : Fondue de Fruits Très Chocolat ou Gaufres Géantes.",
          "Attention fruits à coque/lait/gluten possibles."
        ],
        pickItems(items, (item) => item.sectionKey === "desserts" && containsAny(item, ["chocolat", "nutella", "choco", "nougatella", "fondant"]), 12)
      ),
      scenario(
        "Client : “Je veux commander vite, conseillez-moi un combo cohérent.”",
        "⚡",
        "Moyen",
        "Réponse serveur : proposer une logique en 4 choix clairs.\nCombo léger : Le Veggie + Mangue Énergie, frais et lisible.\nCombo rapide : Fish & Chips + Grand Soleil, simple à expliquer et efficace.\nCombo star : Goody Woody + Joséphine Baker, gourmand salé + tropical sans alcool.\nCombo gourmand : Deli Mix Pastrami + Pink Spritz + Chocolat Mon Amour, pour grosse faim et plaisir.",
        [
          "Toujours demander : léger, rapide, star ou gourmand ?",
          "Associer un plat riche avec une boisson fraîche/fruitée.",
          "Le combo alcoolisé doit être annoncé clairement comme alcoolisé."
        ],
        mergeItems(
          pickNamed(items, ["Le Veggie", "Mangue Énergie", "Fish & Chips", "Grand Soleil 40cl", "Goody Woody", "Joséphine Baker", "Deli Mix Pastrami", "Pink Spritz", "Chocolat Mon Amour"]),
          []
        )
      )
    ];
  }

  function renderSituationsView(items) {
    const scenarios = buildScenarios(items);
    return `
      <section class="panel panel-pad">
        <div class="view-title">
          <div>
            <div class="eyebrow">Mise en pratique avancée</div>
            <h2 class="h2">Situations client réalistes</h2>
          </div>
          <p class="muted">Des cas plus proches du service : végétarien, vegan, allergènes, formules, explications de mots, pièges et recommandations. Petit simulateur de salle, sans plateau qui tombe.</p>
        </div>
      </section>
      <section style="margin-top:14px">
        ${scenarios.map((scenario, index) => `
          <div class="category panel" style="--cat-accent:#3B4A3E">
            <button class="category-head" data-toggle="scenario.${index}">
              <div class="category-left">
                <div class="emoji-box" style="--cat-accent:#3B4A3E">${escapeHtml(scenario.emoji || "🧑‍🍳")}</div>
                <div>
                  <div class="category-name">${escapeHtml(scenario.title)}</div>
                  <div class="category-meta">Niveau ${escapeHtml(scenario.level || "Moyen")} · ${scenario.answer.length} fiche${scenario.answer.length > 1 ? "s" : ""} liée${scenario.answer.length > 1 ? "s" : ""}</div>
                </div>
              </div>
              <div class="badge">${state.open[`scenario.${index}`] === true ? "Refermer" : "Ouvrir"}</div>
            </button>
            ${state.open[`scenario.${index}`] === true ? `
              <div class="category-body">
                <div class="info-box memo" style="margin-bottom:12px">
                  <div class="box-title">Réponse serveur conseillée</div>
                  <div class="box-text">${formatText(scenario.response)}</div>
                </div>
                ${scenario.checks && scenario.checks.length ? `
                  <div class="info-box trap" style="margin-bottom:12px">
                    <div class="box-title">Réflexes à retenir</div>
                    <div class="box-text">${scenario.checks.map((check) => `• ${escapeHtml(check)}`).join("<br>")}</div>
                  </div>
                ` : ""}
                ${scenario.answer.length ? `<div class="grid">${scenario.answer.map(renderItemCard).join("")}</div>` : renderEmpty("Aucune fiche directe", "Cas à traiter surtout avec la vérification cuisine / allergènes.")}
              </div>
            ` : ""}
          </div>
        `).join("")}
      </section>
    `;
  }

  function renderFloatingControls() {
    if (!["apprendre", "situations"].includes(state.view)) return "";
    return `<button class="floating-collapse" data-collapse-all="1" title="Tout refermer">Tout fermer</button>`;
  }

  function renderEmpty(title, message) {
    return `
      <div class="panel panel-pad" style="grid-column:1/-1;text-align:center">
        <div style="font-size:42px">🍋</div>
        <h3 style="margin:8px 0 6px">${escapeHtml(title)}</h3>
        <p class="muted" style="margin:0">${escapeHtml(message)}</p>
      </div>
    `;
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startQuiz(scope, items) {
    const questions = buildQuestions(items, scope === "weak");
    state.quiz = { scope, questions, index: 0, ok: 0, nok: 0 };
    state.showAnswer = false;
    saveJson(QUIZ_KEY, state.quiz);
    render();
  }

  function nextQuiz(result, id) {
    if (!state.quiz) return;
    if (result === "ok") {
      state.quiz.ok = (state.quiz.ok || 0) + 1;
      state.progress[id] = "known";
    } else {
      state.quiz.nok = (state.quiz.nok || 0) + 1;
      state.progress[id] = "review";
    }
    state.quiz.index += 1;
    state.showAnswer = false;
    saveJson(STORAGE_KEY, state.progress);
    saveJson(QUIZ_KEY, state.quiz);
    render();
  }

  function render() {
    const root = $("#root");
    const sections = getSections();

    if (!root) return;
    if (!sections) {
      root.innerHTML = `
        <div class="app-error">
          <strong>Données introuvables.</strong>
          <div>Le fichier <b>data.js</b> n'a pas chargé ou ne contient pas <code>window.SECTIONS</code>.</div>
          <div style="margin-top:12px;color:#6f7d75;font-size:13px">Vérifie que <b>data.js</b> est dans le même dossier que <b>index.html</b>.</div>
        </div>
      `;
      return;
    }

    if (!sections[state.sectionKey]) state.sectionKey = Object.keys(sections)[0];
    const items = flattenItems();

    let content = renderTop(items);
    if (state.view === "apprendre") content += renderLearnView(items);
    if (state.view === "recherche") content += renderSearchView(items);
    if (state.view === "revision") content += renderReviewView(items);
    if (state.view === "quiz") content += renderQuizView(items);
    if (state.view === "situations") content += renderSituationsView(items);
    content += renderFloatingControls();
    content += `<div class="footer-space"></div></main>`;

    root.innerHTML = content;

    const search = $("#searchInput", root);
    if (search) {
      search.focus({ preventScroll: true });
      const length = search.value.length;
      try { search.setSelectionRange(length, length); } catch (_) {}
    }
  }

  function bindEvents() {
    const root = $("#root");
    if (!root) return;

    root.addEventListener("click", (event) => {
      const viewBtn = event.target.closest("[data-view]");
      const sectionBtn = event.target.closest("[data-section]");
      const toggleBtn = event.target.closest("[data-toggle]");
      const actionBtn = event.target.closest("[data-action]");
      const searchBtn = event.target.closest("[data-search]");
      const quizBtn = event.target.closest("[data-quiz]");
      const showAnswerBtn = event.target.closest("[data-show-answer]");
      const quizNextBtn = event.target.closest("[data-quiz-next]");
      const collapseBtn = event.target.closest("[data-collapse-all]");

      if (viewBtn) {
        state.view = viewBtn.dataset.view;
        render();
        return;
      }

      if (sectionBtn) {
        state.sectionKey = sectionBtn.dataset.section;
        render();
        return;
      }

      if (toggleBtn) {
        const key = toggleBtn.dataset.toggle;
        state.open[key] = state.open[key] === true ? false : true;
        render();
        return;
      }

      if (actionBtn) {
        setProgress(actionBtn.dataset.id, actionBtn.dataset.action === "known" ? "known" : "review");
        return;
      }

      if (searchBtn) {
        state.query = searchBtn.dataset.search || "";
        state.view = "recherche";
        render();
        return;
      }

      if (quizBtn) {
        startQuiz(quizBtn.dataset.quiz, flattenItems());
        return;
      }

      if (showAnswerBtn) {
        state.showAnswer = true;
        render();
        return;
      }

      if (quizNextBtn) {
        nextQuiz(quizNextBtn.dataset.quizNext, quizNextBtn.dataset.id);
        return;
      }

      if (collapseBtn) {
        state.open = {};
        render();
      }
    });

    root.addEventListener("input", (event) => {
      if (event.target && event.target.id === "searchInput") {
        state.query = event.target.value;
        render();
      }
    });
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
    bindEvents();
    render();
  });
})();
