const { useState, useMemo, useEffect } = React;

const STORAGE_KEYS = {
  progress: "paradis_v8_progress",
  quizPool: "paradis_v8_quiz_pool",
  quizIdx: "paradis_v8_quiz_idx",
  quizScore: "paradis_v8_quiz_score",
  quizFinished: "paradis_v8_quiz_finished"
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

// Moteur de détection d'allergènes partagé.
// Il sert pour la révision. Pour un vrai client allergique, toujours vérifier en cuisine.
function detectAllergens(ingredients, name) {
  const allergens = [];
  const text = normalizeText((ingredients || []).join(" ") + " " + name);
  const add = (label) => { if (!allergens.includes(label)) allergens.push(label); };

  if (text.includes("thon") || text.includes("saumon") || text.includes("merlu") || text.includes("limande") || text.includes("poisson") || text.includes("gravlax")) add("Poissons");
  if (text.includes("crevette") || text.includes("homard") || text.includes("crustace") || text.includes("lobster")) add("Crustacés");
  if (text.includes("oeuf") || text.includes("brouillade") || text.includes("mayonnaise") || text.includes("caesar") || text.includes("tartare") || text.includes("meringue") || text.includes("pancake") || text.includes("gaufre") || text.includes("chou") || text.includes("profiterole") || text.includes("cheesecake")) add("Œufs");
  if (text.includes("lait") || text.includes("lactose") || text.includes("creme") || text.includes("cheddar") || text.includes("chevre") || text.includes("mozzarella") || text.includes("burrata") || text.includes("feta") || text.includes("cheese") || text.includes("camembert") || text.includes("grana") || text.includes("padano") || text.includes("yaourt") || text.includes("yogurt") || text.includes("yolita") || text.includes("glace") || text.includes("vanille") || text.includes("nougat") || text.includes("chocolat au lait") || text.includes("cappuccino") || text.includes("latte")) add("Lait (Lactose)");
  if (text.includes("noix") || text.includes("amande") || text.includes("pistache") || text.includes("praline") || text.includes("noisette")) add("Fruits à coque");
  if (text.includes("cacahuete") || text.includes("arachide")) add("Arachides");
  if (text.includes("celeri")) add("Céleri");
  if (text.includes("moutarde")) add("Moutarde");
  if (text.includes("sesame")) add("Graines de sésame");
  if (text.includes("edamames") || text.includes("soja") || text.includes("thai") || text.includes("tom yum") || text.includes("sweet chili")) add("Soja");
  if (text.includes("spritz") || text.includes("vin") || text.includes("prosecco") || text.includes("aperol") || text.includes("martini") || text.includes("cidre") || text.includes("confit") || text.includes("vinaigre") || text.includes("vinaigrette") || text.includes("chutney") || text.includes("olive")) add("Anhydride sulfureux & Sulfites");
  if ((text.includes("focaccia") || text.includes("pita") || text.includes("blini") || text.includes("chou") || text.includes("panure") || text.includes("pane") || text.includes("chapelure") || text.includes("panko") || text.includes("muesli") || text.includes("toast") || text.includes("gnocchi") || text.includes("gaufre") || text.includes("pancake") || text.includes("cereales") || text.includes("burger") || text.includes("pain") || text.includes("brioche") || text.includes("boulgour") || text.includes("tarte") || text.includes("cheesecake") || text.includes("gateau") || text.includes("biere") || text.includes("ipa")) && !text.includes("sans gluten")) {
    add("Céréales contenant du gluten");
  }
  return allergens;
}

function getIngredientStyle(name) {
  const lower = normalizeText(name);
  if (lower.includes("pomme") || lower.includes("tatin")) return { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" };
  if (lower.includes("gingembre") || lower.includes("coriandre") || lower.includes("persil") || lower.includes("verveine")) return { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" };
  if (lower.includes("coco") || lower.includes("noix de coco")) return { bg: "#f8fafc", text: "#334155", border: "#cbd5e1" };
  if (lower.includes("biere") || lower.includes("cidre") || lower.includes("vin ") || lower.includes("aop")) return { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" };
  if (lower.includes("glace") || lower.includes("sorbet") || lower.includes("yogurt") || lower.includes("yolita")) return { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" };
  if (lower.includes("choix") || lower.includes("chois")) return { bg: "#fffbeb", text: "#b45309", border: "#fde047" };
  if (lower === "yolita") return { bg: "#f3e8ff", text: "#7e22ce", border: "#c084fc" };
  if (lower.includes("framboise") || lower === "hibiscus") return { bg: "#fce7f3", text: "#db2777", border: "#fbcfe8" };
  if (lower.includes("mangue") || lower.includes("alphonso") || lower.includes("puree de mangue")) return { bg: "#ffedd5", text: "#ea580c", border: "#22c55e" };
  if (lower.includes("citron vert")) return { bg: "#fef9c3", text: "#4d7c0f", border: "#a3e635" };
  if (lower.includes("citron")) return { bg: "#fef9c3", text: "#a16207", border: "#fef08a" };
  if (lower.includes("orange") || lower.includes("clementine") || lower.includes("abricot") || lower.includes("peche jaune") || lower.includes("melon")) return { bg: "#fff7ed", text: "#d97706", border: "#fed7aa" };
  if (lower === "pamplemousse") return { bg: "#ffe4e6", text: "#be123c", border: "#fecdd3" };
  if (lower.includes("fraise") || lower === "cranberry" || lower === "cramberry" || lower === "fruits rouges" || lower === "grenade" || lower === "pasteque" || lower === "pulpe de passion" || lower === "fruit de la passion" || lower === "passion" || lower === "coulis de fruits" || lower === "coulis fruits") return { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" };
  if (lower.includes("banane") || lower.includes("ananas")) return { bg: "#fef9c3", text: "#713f12", border: "#fef08a" };
  if (lower === "the vert glace") return { bg: "#faf0e6", text: "#4a2c11", border: "#d2b48c" };
  if (lower === "litchi" || lower === "goyave") return { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" };
  if (lower.includes("poivron")) return { bg: "#fff5f5", text: "#e53e3e", border: "#feb2b2" };
  if (lower.includes("celeri") || lower.includes("concombre") || lower.includes("edamames") || lower.includes("avocat") || lower.includes("multigraines") || lower.includes("epinard") || lower.includes("kale") || lower.includes("menthe") || lower.includes("basilic") || lower.includes("pistou") || lower.includes("roquette") || lower.includes("salade") || lower.includes("romaine") || lower.includes("mesclun") || lower.includes("courgette") || lower.includes("aubergine") || lower.includes("haricots") || lower.includes("persil") || lower.includes("ciboulette") || lower.includes("aloe") || lower.includes("herbes")) return { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" };
  if (lower.includes("tomate")) return { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" };
  if (lower.includes("aperol") || lower.includes("prosecco") || lower.includes("martini") || lower.includes("eau petillante") || lower.includes("st-germain") || lower.includes("tequila") || lower.includes("camino") || lower.includes("rhum") || lower.includes("bacardi") || lower.includes("gin") || lower.includes("bombay") || lower.includes("sapphire")) return { bg: "#ecfeff", text: "#0891b2", border: "#a5f3fc" };
  if (lower.includes("poulet") || lower.includes("dinde") || lower.includes("boeuf") || lower.includes("pastrami") || lower.includes("aiguillettes")) return { bg: "#f7f4eb", text: "#854d0e", border: "#e6dcce" };
  if (lower.includes("thon") || lower.includes("saumon") || lower.includes("merlu") || lower.includes("limande") || lower.includes("homard") || lower.includes("crevette") || lower.includes("poisson") || lower.includes("gravlax")) return { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" };
  if (lower.includes("chocolat") || lower.includes("nutella") || lower.includes("noisette") || lower.includes("choco") || lower.includes("caramel") || lower.includes("carambar")) return { bg: "#fcf6f0", text: "#4a2c11", border: "#ddc3b3" };
  if (lower.includes("focaccia") || lower.includes("croutons") || lower.includes("pita") || lower.includes("blini") || lower.includes("chou") || lower.includes("panure") || lower.includes("chapelure") || lower.includes("muesli") || lower.includes("toasts") || lower.includes("gnocchis") || lower.includes("gaufres") || lower.includes("pancakes") || lower.includes("cereales") || lower.includes("sesame") || lower.includes("graines") || lower.includes("noix") || lower.includes("amande") || lower.includes("oignons frits")) return { bg: "#faf6f0", text: "#6b4423", border: "#e8dcad" };
  if (lower.includes("feta") || lower.includes("mozzarella") || lower.includes("burrata") || lower.includes("cheddar") || lower.includes("chevre") || lower.includes("cheese") || lower.includes("grana") || lower.includes("padano") || lower.includes("lait") || lower.includes("creme") || lower.includes("yaourt") || lower.includes("camembert") || lower.includes("vanille") || lower.includes("meringue") || lower.includes("anglaise")) return { bg: "#faf5ff", text: "#581c87", border: "#e9d5ff" };
  if (lower.includes("sauces") || lower.includes("sauce") || lower.includes("mayonnaise") || lower.includes("vinaigrette") || lower.includes("condiment") || lower.includes("oignon") || lower.includes("coleslaw") || lower.includes("riz") || lower.includes("frites") || lower.includes("chamallows") || lower.includes("cornichons") || lower.includes("marination")) return { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" };
  return { bg: "#e2e8f0", text: "#1e293b", border: "#cbd5e1" };
}

function getTrapNotes(item, sectionKey = "") {
  const text = normalizeText(`${item.name} ${(item.ingredients || []).join(" ")} ${item.memo || ""}`);
  const traps = [];

  const push = (note) => traps.push(note);
  if (item.trap) push(item.trap);
  if (item.warning) push(item.warning);

  if (text.includes("tartinade de thon")) push("Piège thon : la tartinade contient du céleri et du poivron, avec thon Listao.");
  if (text.includes("fish & chips") && !text.includes("mini")) push("Différence clé : le Fish & Chips plat utilise du merlu du Cap.");
  if (text.includes("mini fish & chips")) push("Différence clé : le Mini Fish & Chips des assiettes utilise de la limande.");
  if (text.includes("pomme bio") && sectionKey === "boissons") push("Boissons avec pomme Bio : servies avec une tige de céleri frais.");
  if (text.includes("jus aloe vera") || text.includes("aloe vera")) push("Veggie Detox : présence de sucre dans le jus aloe vera.");
  if (text.includes("truffe")) push("Truffe : c'est de la truffe d'été, Tuber aestivum.");
  if (text.includes("prosecco")) push("Spritz : le Prosecco mentionné est Martini.");
  if (text.includes("bacardi carta oro")) push("Cocktails au rhum : base Bacardi Carta Oro.");
  if (text.includes("tequila camino real")) push("Margaritas : base Tequila Camino Real.");
  if (text.includes("yolita")) push("Yolita : glace goût yaourt, donc vigilance lait/lactose.");
  if (text.includes("sans gluten")) push("Point fort client : dessert annoncé sans gluten dans la recette.");
  if (text.includes("homard")) push("Sir Homard Lobster : chair de homard américain et poissons.");
  if (text.includes("cheddar en plus")) push("Upsell : proposer sauce cheddar en plus sur les plats concernés.");
  if (text.includes("double ton pastrami")) push("Upsell : possibilité de doubler le pastrami.");
  if (text.includes("saumon fume en plus")) push("Upsell : saumon fumé en plus, encore meilleur avec avocat.");
  if (text.includes("coco") && text.includes("rhum")) push("Cocktail tropical : coco + rhum Bacardi Carta Oro, souvent à relier aux Pina/Danse Joséphine.");

  return unique(traps);
}

function flattenSections() {
  const rows = [];
  Object.entries(window.SECTIONS || {}).forEach(([sectionKey, section]) => {
    Object.entries(section.categories || {}).forEach(([categoryKey, category]) => {
      (category.items || []).forEach((item, index) => {
        const key = `${sectionKey}::${categoryKey}::${index}::${slugify(item.name)}`;
        const allergens = detectAllergens(item.ingredients || [], item.name || "");
        const traps = getTrapNotes(item, sectionKey);
        const searchText = normalizeText([
          item.name,
          ...(item.ingredients || []),
          item.memo,
          ...allergens,
          ...traps,
          section.label,
          category.label
        ].join(" "));

        rows.push({
          key,
          sectionKey,
          categoryKey,
          section,
          category,
          item,
          index,
          allergens,
          traps,
          searchText
        });
      });
    });
  });
  return rows;
}

function buildClientScenarios(allItems) {
  const by = (predicate) => allItems.filter(predicate).slice(0, 8);
  const has = (info, word) => info.searchText.includes(normalizeText(word));
  const noAlcohol = (info) => !["rhum", "tequila", "gin", "aperol", "prosecco", "vin", "cidre", "biere", "bacardi"].some((w) => has(info, w));

  return [
    {
      title: "Boisson mangue sans alcool",
      prompt: "Un client veut une boisson sans alcool avec de la mangue. Tu proposes quoi ?",
      strategy: "Cherche les boissons avec mangue, puis élimine les cocktails alcoolisés.",
      items: by((info) => info.sectionKey === "boissons" && has(info, "mangue") && noAlcohol(info))
    },
    {
      title: "Saumon froid ou frais",
      prompt: "Un client veut quelque chose avec du saumon, mais pas une marmite chaude. Quelles options rapides peux-tu citer ?",
      strategy: "Priorité aux pitas, avocado toast, assiettes et salades. Évite les plats chauds hors demande.",
      items: by((info) => has(info, "saumon") && info.categoryKey !== "chauds" && info.sectionKey !== "boissons")
    },
    {
      title: "Assiette 3 saveurs poisson",
      prompt: "Un client compose une assiette et veut trois saveurs autour du poisson. Tu recommandes quoi ?",
      strategy: "Dans les 23 saveurs, repère thon, saumon, limande, crevettes ou brochettes de saumon.",
      items: by((info) => info.sectionKey === "saveurs" && info.allergens.includes("Poissons"))
    },
    {
      title: "Option veggie et fraîche",
      prompt: "Un client veut quelque chose de frais, coloré, plutôt veggie. Tu l'orientes vers quoi ?",
      strategy: "Cherche Veggie, avocat, burrata, feta, pastèque, melon, pistou, salade fruitée.",
      items: by((info) => has(info, "veggie") || has(info, "avocat") || has(info, "burrata") || has(info, "feta") || has(info, "pasteque") || has(info, "melon") || has(info, "pistou"))
    },
    {
      title: "Gluten, réflexe sécurité",
      prompt: "Un client annonce une allergie au gluten. Quelle est ta réponse professionnelle ?",
      strategy: "Ne promets rien uniquement avec l'application. Explique que tu vérifies la fiche allergènes officielle, puis repère les produits à vigilance et les rares mentions sans gluten.",
      items: by((info) => info.allergens.includes("Céréales contenant du gluten") || has(info, "sans gluten"))
    },
    {
      title: "Piège thon",
      prompt: "Un client prend une recette avec tartinade de thon. Quel point de vigilance dois-tu garder en tête ?",
      strategy: "La tartinade de thon est un piège récurrent : thon Listao, céleri et poivron.",
      items: by((info) => has(info, "tartinade de thon"))
    },
    {
      title: "Différence Fish & Chips",
      prompt: "On te demande la différence entre Fish & Chips plat et Mini Fish & Chips en assiette. Tu réponds quoi ?",
      strategy: "Plat : merlu du Cap. Mini saveur : limande.",
      items: by((info) => has(info, "fish & chips"))
    },
    {
      title: "Cocktail pomme Bio",
      prompt: "Un client commande un pressé avec pomme Bio. Quel détail de service dois-tu connaître ?",
      strategy: "Les cocktails indiqués avec pomme Bio sont accompagnés d'une tige de céleri frais.",
      items: by((info) => info.sectionKey === "boissons" && has(info, "pomme bio"))
    }
  ];
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


function MainApp() {
  const [activeTab, setActiveTab] = useState("plats");
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [mode, setMode] = useState("learn");
  const [flashcardMode, setFlashcardMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientIdx, setClientIdx] = useState(0);
  const [showClientAnswer, setShowClientAnswer] = useState(false);
  const [quizScope, setQuizScope] = useState("all");

  const [progress, setProgress] = useState(() => safeParse(localStorage.getItem(STORAGE_KEYS.progress), {}));
  const [questionsPool, setQuestionsPool] = useState(() => safeParse(localStorage.getItem(STORAGE_KEYS.quizPool), []));
  const [quizIdx, setQuizIdx] = useState(() => parseInt(localStorage.getItem(STORAGE_KEYS.quizIdx) || "0", 10));
  const [score, setScore] = useState(() => safeParse(localStorage.getItem(STORAGE_KEYS.quizScore), { ok: 0, nok: 0 }));
  const [quizFinished, setQuizFinished] = useState(() => safeParse(localStorage.getItem(STORAGE_KEYS.quizFinished), false));
  const [showAnswer, setShowAnswer] = useState(false);

  const allItems = useMemo(() => flattenSections(), []);
  const section = window.SECTIONS[activeTab];
  const clientScenarios = useMemo(() => buildClientScenarios(allItems), [allItems]);

  const getProgress = (key) => progress[key] || { known: false, review: false, mistakes: 0, successes: 0 };

  const weakItems = useMemo(() => {
    return allItems
      .filter((info) => {
        const p = progress[info.key];
        return p && (p.review || p.mistakes > 0 || p.known === false);
      })
      .sort((a, b) => {
        const pa = getProgress(a.key);
        const pb = getProgress(b.key);
        return (pb.mistakes - pa.mistakes) || (pa.successes - pb.successes) || a.item.name.localeCompare(b.item.name);
      });
  }, [allItems, progress]);

  const stats = useMemo(() => {
    const known = allItems.filter((info) => getProgress(info.key).known).length;
    const review = weakItems.length;
    const mistakes = Object.values(progress).reduce((acc, p) => acc + (p.mistakes || 0), 0);
    return { total: allItems.length, known, review, mistakes, mastery: percent(known, allItems.length) };
  }, [allItems, progress, weakItems]);

  const sectionSummaries = useMemo(() => {
    return Object.entries(window.SECTIONS).map(([key, sec]) => {
      const items = allItems.filter((info) => info.sectionKey === key);
      const known = items.filter((info) => getProgress(info.key).known).length;
      return { key, section: sec, total: items.length, known, mastery: percent(known, items.length) };
    });
  }, [allItems, progress]);

  const filteredItems = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return [];
    const tokens = query.split(/\s+/).filter(Boolean);
    return allItems.filter((info) => tokens.every((token) => info.searchText.includes(token)));
  }, [searchQuery, allItems]);

  const quickSearches = ["saumon", "pistou", "mangue", "céleri", "sans gluten", "Bacardi", "pomme Bio", "feta"];

  useEffect(() => localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress)), [progress]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.quizPool, JSON.stringify(questionsPool)), [questionsPool]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.quizIdx, quizIdx.toString()), [quizIdx]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.quizScore, JSON.stringify(score)), [score]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.quizFinished, JSON.stringify(quizFinished)), [quizFinished]);

  const markItem = (key, state) => {
    setProgress((prev) => {
      const old = prev[key] || { known: false, review: false, mistakes: 0, successes: 0 };
      const now = new Date().toISOString();
      if (state === "known") {
        return {
          ...prev,
          [key]: { ...old, known: true, review: false, successes: (old.successes || 0) + 1, lastSeen: now }
        };
      }
      return {
        ...prev,
        [key]: { ...old, known: false, review: true, mistakes: (old.mistakes || 0) + 1, lastMissed: now, lastSeen: now }
      };
    });
  };

  const resetProgress = () => {
    if (confirm("Réinitialiser toute ta progression de révision ?")) setProgress({});
  };

  const buildExamSimulator = (scope = quizScope) => {
    const targetItems = scope === "weak" && weakItems.length > 0 ? weakItems : allItems;
    let pool = [];

    targetItems.forEach((info) => {
      const item = info.item;
      pool.push({
        itemKey: info.key,
        q: `Quelle est la composition complète de "${item.name}" ?`,
        a: `Ingrédients : ${(item.ingredients || []).join(", ")}.`,
        cat: `${info.section.label} · Ingrédients`
      });

      if (item.memo) {
        pool.push({
          itemKey: info.key,
          q: `Quel mémo faut-il retenir pour "${item.name}" ?`,
          a: item.memo,
          cat: `${info.section.label} · Mémo`
        });
      }

      if (info.traps.length > 0) {
        pool.push({
          itemKey: info.key,
          q: `Quel piège faut-il connaître pour "${item.name}" ?`,
          a: info.traps.join(" "),
          cat: "⚠️ Pièges"
        });
      }

      if (info.allergens.length > 0) {
        pool.push({
          itemKey: info.key,
          q: `Quels allergènes probables repérer pour "${item.name}" ?`,
          a: `Allergènes probables pour révision : ${info.allergens.join(", ")}. Pour un vrai client, vérifier en cuisine.`,
          cat: "🛡️ Allergènes"
        });
      }
    });

    pool = shuffle(pool);
    setQuizScope(scope);
    setQuestionsPool(pool);
    setQuizIdx(0);
    setShowAnswer(false);
    setQuizFinished(false);
    setScore({ ok: 0, nok: 0 });
  };

  useEffect(() => {
    if (mode === "quiz" && questionsPool.length === 0) buildExamSimulator("all");
  }, [mode]);

  const handleNextQuestion = (isCorrect) => {
    const current = questionsPool[quizIdx];
    if (current?.itemKey) markItem(current.itemKey, isCorrect ? "known" : "review");

    setScore((prev) => ({
      ...prev,
      [isCorrect ? "ok" : "nok"]: prev[isCorrect ? "ok" : "nok"] + 1
    }));

    if (quizIdx + 1 >= questionsPool.length) {
      setQuizFinished(true);
    } else {
      setQuizIdx((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const resetQuizStorage = (scope = quizScope) => {
    Object.values(STORAGE_KEYS).filter((key) => key.includes("quiz")).forEach((key) => localStorage.removeItem(key));
    buildExamSimulator(scope);
  };

  const activeClientScenario = clientScenarios[clientIdx % clientScenarios.length];

  const navItems = [
    { id: "learn", label: "Carte" },
    { id: "search", label: "Recherche" },
    { id: "review", label: `À revoir${stats.review ? ` · ${stats.review}` : ""}` },
    { id: "client", label: "Mise en situation" },
    { id: "allergens_tab", label: "Allergènes" },
    { id: "quiz", label: "Quiz" }
  ];

  function ProductCard({ info, forceReveal = false, showPath = false }) {
    const item = info.item;
    const p = getProgress(info.key);
    const isRevealed = forceReveal || expandedItem === info.key || !flashcardMode;

    return (
      <article className="product panel" style={{ "--accent": info.section.color }}>
        <div className="product-accent" />
        <div className="product-head">
          <div>
            {showPath && <div className="path">{info.section.label} · {info.category.label}</div>}
            <div className="product-title">{item.name}</div>
            <div className="badges">
              <span className="badge">{(item.ingredients || []).length} ingrédients</span>
              {info.traps.length > 0 && <span className="badge warn">{info.traps.length} piège{info.traps.length > 1 ? "s" : ""}</span>}
              {info.allergens.length > 0 && <span className="badge err">{info.allergens.length} allergène{info.allergens.length > 1 ? "s" : ""}</span>}
            </div>
            <div className="badges">
              {p.known && <span className="badge ok">Maîtrisé</span>}
              {p.review && <span className="badge warn">À revoir</span>}
              {(p.mistakes || 0) > 0 && <span className="badge err">{p.mistakes} erreur{p.mistakes > 1 ? "s" : ""}</span>}
              {(p.successes || 0) > 0 && <span className="badge info">{p.successes} réussite{p.successes > 1 ? "s" : ""}</span>}
            </div>
          </div>
          <div className="emoji-box">{info.category.emoji}</div>
        </div>

        <div className="product-body">
          {isRevealed ? (
            <>
              <div className="info-box">
                <div className="box-title">Ingrédients</div>
                <div className="ingredient-list">
                  {(item.ingredients || []).map((ing, j) => {
                    const colors = getIngredientStyle(ing);
                    return (
                      <span key={j} className="ingredient" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                        {ing}
                      </span>
                    );
                  })}
                </div>
              </div>

              {info.traps.length > 0 && (
                <div className="info-box trap">
                  <div className="box-title">Pièges à connaître</div>
                  <div className="box-text">
                    {info.traps.map((trap, i) => <div key={i}>• {trap}</div>)}
                  </div>
                </div>
              )}

              {info.allergens.length > 0 && (
                <div className="info-box allergens">
                  <div className="box-title" style={{ color: "var(--red)" }}>Allergènes probables</div>
                  <div className="ingredient-list">
                    {info.allergens.map((algName, k) => {
                      const matched = window.OFFICIAL_ALLERGENS.find(a => a.name === algName);
                      return (
                        <span key={k} className="ingredient" style={{ background: matched?.color.bg || "#fff1f2", color: matched?.color.text || "#be123c", border: `1px solid ${matched?.color.border || "#fecdd3"}` }}>
                          {algName}
                        </span>
                      );
                    })}
                  </div>
                  <div className="muted" style={{ marginTop: 8, fontSize: 11 }}>
                    Révision uniquement. Pour un vrai client allergique, vérifier en cuisine.
                  </div>
                </div>
              )}

              {item.memo && (
                <div className="info-box memo">
                  <div className="box-title">Mémo</div>
                  <div className="box-text">{item.memo}</div>
                </div>
              )}
            </>
          ) : (
            <button className="reveal" onClick={() => setExpandedItem(info.key)}>
              Révéler la fiche
            </button>
          )}
        </div>

        <div className="actions">
          <button className="action-btn review" onClick={() => markItem(info.key, "review")}>À revoir</button>
          <button className="action-btn know" onClick={() => markItem(info.key, "known")}>Je connais</button>
        </div>
      </article>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-row">
            <div className="brand">
              <div className="logo">🌴</div>
              <div>
                <h1 className="brand-title">Paradis Revision</h1>
                <div className="brand-subtitle">Carte · Quiz</div>
              </div>
            </div>
            <div className="score-pill">{stats.mastery}% maîtrisé</div>
          </div>

          <div className="progress-line">
            <div className="progress-fill" style={{ width: `${stats.mastery}%` }} />
          </div>

          <nav className="nav">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setMode(item.id)} className={`nav-btn ${mode === item.id ? "active" : ""}`}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app">
        <section className="dashboard">
          <div className="stat"><div className="stat-label">Fiches</div><div className="stat-value">{stats.total}</div></div>
          <div className="stat"><div className="stat-label">Maîtrisées</div><div className="stat-value">{stats.known}</div></div>
          <div className="stat"><div className="stat-label">À revoir</div><div className="stat-value">{stats.review}</div></div>
          <div className="stat"><div className="stat-label">Erreurs</div><div className="stat-value">{stats.mistakes}</div></div>
        </section>

        {mode === "learn" && (
          <section>
            <div className="view-title">
              <div>
                <div className="eyebrow">Révision simple</div>
                <h2 className="h2">Apprendre la carte</h2>
                <div className="muted">Choisis une famille, ouvre une catégorie, puis révise fiche par fiche.</div>
              </div>
              <button className={`action-btn ${flashcardMode ? "primary" : "neutral"}`} onClick={() => setFlashcardMode(!flashcardMode)} style={{ padding: "0 14px" }}>
                {flashcardMode ? "Mode cache actif" : "Tout affiché"}
              </button>
            </div>

            <div className="section-tabs">
              {sectionSummaries.map((sum) => (
                <button
                  key={sum.key}
                  className={`section-btn ${activeTab === sum.key ? "active" : ""}`}
                  style={{ "--section-color": sum.section.color }}
                  onClick={() => { setActiveTab(sum.key); setExpandedCat(null); setExpandedItem(null); }}
                >
                  <div className="section-name">{sum.section.label}</div>
                  <div className="section-meta">{sum.total} fiches · {sum.mastery}% maîtrisé</div>
                </button>
              ))}
            </div>

            {Object.entries(section.categories).map(([catKey, cat]) => {
              const categoryItems = allItems.filter((info) => info.sectionKey === activeTab && info.categoryKey === catKey);
              const known = categoryItems.filter((info) => getProgress(info.key).known).length;
              return (
                <div className="category panel" key={catKey}>
                  <button className="category-head" onClick={() => setExpandedCat(expandedCat === catKey ? null : catKey)}>
                    <div className="category-left">
                      <div className="emoji-box">{cat.emoji}</div>
                      <div>
                        <div className="category-name">{cat.label}</div>
                        <div className="category-meta">{cat.items.length} fiches · {known} maîtrisées</div>
                      </div>
                    </div>
                    <strong>{expandedCat === catKey ? "−" : "+"}</strong>
                  </button>

                  {expandedCat === catKey && (
                    <div className="category-body">
                      <div className="grid">
                        {categoryItems.map((info) => <ProductCard key={info.key} info={info} />)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {mode === "search" && (
          <section>
            <div className="panel panel-pad" style={{ marginBottom: 14 }}>
              <div className="view-title">
                <div>
                  <div className="eyebrow">Recherche</div>
                  <h2 className="h2">Trouver rapidement</h2>
                  <div className="muted">Recherche dans les noms, ingrédients, mémos, pièges et allergènes.</div>
                </div>
              </div>
              <input className="input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ex : saumon, céleri, pistou, Bacardi..." autoFocus />
              <div className="quick-tags">
                {quickSearches.map((term) => <button key={term} className="tag-btn" onClick={() => setSearchQuery(term)}>{term}</button>)}
              </div>
              <div className="muted" style={{ marginTop: 12 }}>{searchQuery ? `${filteredItems.length} résultat(s)` : "Tape un mot ou utilise un raccourci."}</div>
            </div>

            {searchQuery && (
              <div className="grid">
                {filteredItems.map((info) => <ProductCard key={info.key} info={info} forceReveal={true} showPath={true} />)}
              </div>
            )}
          </section>
        )}

        {mode === "review" && (
          <section>
            <div className="panel panel-pad" style={{ marginBottom: 14 }}>
              <div className="view-title" style={{ marginBottom: 0 }}>
                <div>
                  <div className="eyebrow">Consolidation</div>
                  <h2 className="h2">Fiches à revoir</h2>
                  <div className="muted">Tout ce que tu as raté ou marqué comme fragile apparaît ici.</div>
                </div>
                <button className="action-btn review" onClick={resetProgress} style={{ padding: "0 14px" }}>Reset</button>
              </div>
            </div>

            {weakItems.length === 0 ? (
              <div className="panel panel-pad">
                <h3 style={{ margin: "0 0 6px", fontSize: 20 }}>Aucune fiche à revoir 🌱</h3>
                <div className="muted">Utilise “À revoir” sur une fiche ou rate une question dans le quiz.</div>
              </div>
            ) : (
              <div className="grid">
                {weakItems.map((info) => <ProductCard key={info.key} info={info} forceReveal={true} showPath={true} />)}
              </div>
            )}
          </section>
        )}

        {mode === "client" && activeClientScenario && (
          <section>
            <div className="quiz-card panel panel-pad">
              <div className="view-title">
                <div>
                  <div className="eyebrow">Simulation comptoir</div>
                  <h2 className="h2">{activeClientScenario.title}</h2>
                </div>
                <button
                  className="action-btn neutral"
                  style={{ padding: "0 14px" }}
                  onClick={() => { setClientIdx((prev) => (prev + 1) % clientScenarios.length); setShowClientAnswer(false); }}
                >
                  Suivant
                </button>
              </div>

              <div className="info-box" style={{ marginBottom: 14 }}>
                <div className="box-title">Client</div>
                <div style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 850 }}>“{activeClientScenario.prompt}”</div>
              </div>

              {!showClientAnswer ? (
                <button className="action-btn primary" style={{ width: "100%" }} onClick={() => setShowClientAnswer(true)}>Voir la réponse type</button>
              ) : (
                <>
                  <div className="answer" style={{ marginBottom: 14 }}>{activeClientScenario.strategy}</div>
                  <div className="grid">
                    {activeClientScenario.items.map((info) => <ProductCard key={info.key} info={info} forceReveal={true} showPath={true} />)}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {mode === "allergens_tab" && (
          <section>
            <div className="panel panel-pad" style={{ marginBottom: 14, borderColor: "#fecaca" }}>
              <div className="eyebrow" style={{ color: "var(--red)" }}>Important</div>
              <h2 className="h2">Allergènes</h2>
              <div className="muted">
                Le détecteur est là pour réviser. En service, pour un vrai client allergique, on vérifie toujours la fiche officielle du restaurant.
              </div>
            </div>

            <div className="grid">
              {window.OFFICIAL_ALLERGENS.map((alg) => (
                <div className="panel panel-pad" key={alg.id}>
                  <span className="ingredient" style={{ background: alg.color.bg, color: alg.color.text, border: `1px solid ${alg.color.border}` }}>
                    {alg.name}
                  </span>
                  <div className="muted" style={{ marginTop: 12, color: "var(--text)" }}>{alg.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {mode === "quiz" && (
          <section className="quiz-card">
            <div className="view-title">
              <div>
                <div className="eyebrow">Entraînement actif</div>
                <h2 className="h2">Quiz</h2>
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
              <button className={`action-btn ${quizScope === "all" ? "primary" : "neutral"}`} onClick={() => resetQuizStorage("all")}>Complet</button>
              <button className={`action-btn ${quizScope === "weak" ? "primary" : "neutral"}`} onClick={() => resetQuizStorage("weak")}>Erreurs</button>
            </div>

            {quizFinished ? (
              <div className="panel panel-pad" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 54 }}>🏆</div>
                <h3 style={{ margin: "10px 0 8px", fontSize: 24 }}>Évaluation terminée</h3>
                <div className="badge ok" style={{ justifyContent: "center" }}>
                  Score : {score.ok} / {questionsPool.length} ({questionsPool.length > 0 ? Math.round((score.ok / questionsPool.length) * 100) : 0}%)
                </div>
                <button className="action-btn primary" style={{ width: "100%", marginTop: 18 }} onClick={() => resetQuizStorage(quizScope)}>Recommencer</button>
              </div>
            ) : questionsPool.length > 0 ? (
              <div className="panel panel-pad">
                <div className="view-title">
                  <div>
                    <div className="eyebrow">{questionsPool[quizIdx].cat}</div>
                    <div className="muted">Question {quizIdx + 1} / {questionsPool.length} · ✅ {score.ok} · ❌ {score.nok}</div>
                  </div>
                  <button className="tag-btn" onClick={() => resetQuizStorage(quizScope)}>Nouveau</button>
                </div>

                <div className="progress-line" style={{ marginBottom: 18 }}>
                  <div className="progress-fill" style={{ width: `${percent(quizIdx + 1, questionsPool.length)}%` }} />
                </div>

                <div style={{ fontSize: 21, fontWeight: 930, lineHeight: 1.35, marginBottom: 18 }}>{questionsPool[quizIdx].q}</div>

                {!showAnswer ? (
                  <button className="action-btn primary" style={{ width: "100%" }} onClick={() => setShowAnswer(true)}>Voir la réponse</button>
                ) : (
                  <>
                    <div className="answer" style={{ marginBottom: 14 }}>{questionsPool[quizIdx].a}</div>
                    <div className="actions" style={{ padding: 0 }}>
                      <button className="action-btn review" onClick={() => handleNextQuestion(false)}>À revoir</button>
                      <button className="action-btn know" onClick={() => handleNextQuestion(true)}>Maîtrisé</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="panel panel-pad">
                <button className="action-btn primary" style={{ width: "100%" }} onClick={() => buildExamSimulator("all")}>Générer les questions</button>
              </div>
            )}
          </section>
        )}

        <div className="footer-space" />
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);
