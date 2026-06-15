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

// Moteur de détection d'allergènes partagé.
// Il sert pour la révision. Pour un vrai client allergique, toujours vérifier la fiche allergènes officielle du restaurant.
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
  if (text.includes("saumon fumé en plus")) push("Upsell : saumon fumé en plus, encore meilleur avec avocat.");
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
  const [flashcardMode, setFlashcardMode] = useState(false);
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
    return { total: allItems.length, known, review, mistakes };
  }, [allItems, progress, weakItems]);

  const filteredItems = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return [];
    const tokens = query.split(/\s+/).filter(Boolean);
    return allItems.filter((info) => tokens.every((token) => info.searchText.includes(token)));
  }, [searchQuery, allItems]);

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
    if (confirm("Réinitialiser toute ta progression de révision ?")) {
      setProgress({});
    }
  };

  const buildExamSimulator = (scope = quizScope) => {
    const targetItems = scope === "weak" && weakItems.length > 0 ? weakItems : allItems;
    let pool = [];

    targetItems.forEach((info) => {
      const item = info.item;
      pool.push({
        itemKey: info.key,
        q: `Quelle est la composition exacte et complète du produit suivant : "${item.name}" ?`,
        a: `Ingrédients requis : ${(item.ingredients || []).join(", ")}.`,
        cat: `${info.section.label} - Ingrédients`
      });

      if (item.memo) {
        pool.push({
          itemKey: info.key,
          q: `Quel est le point de vigilance ou mémo à retenir pour : "${item.name}" ?`,
          a: item.memo,
          cat: `${info.section.label} - Mémo`
        });
      }

      if (info.traps.length > 0) {
        pool.push({
          itemKey: info.key,
          q: `Quel piège opérationnel dois-tu connaître pour : "${item.name}" ?`,
          a: info.traps.join(" "),
          cat: "⚠️ Pièges carte"
        });
      }

      if (info.allergens.length > 0) {
        pool.push({
          itemKey: info.key,
          q: `Quels allergènes majeurs dois-tu repérer pour la recette : "${item.name}" ?`,
          a: `Allergènes probables pour révision : ${info.allergens.join(", ")}. Pour un vrai client, vérifier en cuisine.`,
          cat: "🛡️ Sécurité & allergènes"
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

  const nextClientScenario = () => {
    setClientIdx((prev) => (prev + 1) % clientScenarios.length);
    setShowClientAnswer(false);
  };

  const navItems = [
    { id: "learn", label: "💡 Carte" },
    { id: "search", label: "🔎 Recherche" },
    { id: "review", label: `🧠 À revoir${stats.review ? ` (${stats.review})` : ""}` },
    { id: "client", label: "🎭 Client réel" },
    { id: "allergens_tab", label: "🛡️ Allergènes" },
    { id: "quiz", label: "🎯 Quiz" }
  ];

  function ProductCard({ info, forceReveal = false, showPath = false }) {
    const item = info.item;
    const p = getProgress(info.key);
    const isRevealed = forceReveal || expandedItem === info.key || !flashcardMode;

    return (
      <div className="card-ui" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #cbd5e1" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", background: "#ffffff" }}>
          {showPath && (
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase", marginBottom: 6 }}>
              {info.section.label} · {info.category.emoji} {info.category.label}
            </div>
          )}
          <div style={{ fontWeight: 955, fontSize: 15, color: "var(--text-dark)", lineHeight: 1.35 }}>{item.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {p.known && <span className="pill-ui" style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>✅ maîtrisé</span>}
            {p.review && <span className="pill-ui" style={{ background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>🧠 à revoir</span>}
            {(p.mistakes || 0) > 0 && <span className="pill-ui" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>❌ {p.mistakes} erreur{p.mistakes > 1 ? "s" : ""}</span>}
            {(p.successes || 0) > 0 && <span className="pill-ui" style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>🔥 {p.successes} réussite{p.successes > 1 ? "s" : ""}</span>}
          </div>
        </div>

        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {isRevealed ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Fiche ingrédients</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(item.ingredients || []).map((ing, j) => {
                    const colors = getIngredientStyle(ing);
                    return (
                      <span key={j} style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 800 }}>
                        {ing}
                      </span>
                    );
                  })}
                </div>
              </div>

              {info.traps.length > 0 && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: "#92400e", textTransform: "uppercase", marginBottom: 7 }}>⚠️ Pièges à connaître</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {info.traps.map((trap, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#78350f", lineHeight: 1.45, fontWeight: 700 }}>• {trap}</div>
                    ))}
                  </div>
                </div>
              )}

              {info.allergens.length > 0 && (
                <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 12 }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: "#be123c", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>🛡️ Allergènes probables pour révision</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {info.allergens.map((algName, k) => {
                      const matched = window.OFFICIAL_ALLERGENS.find(a => a.name === algName);
                      return (
                        <span key={k} style={{ background: matched?.color.bg || "#fff1f2", color: matched?.color.text || "#be123c", border: `1px solid ${matched?.color.border || "#fecdd3"}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 900 }}>
                          {algName}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 7, fontSize: 10, color: "#64748b", lineHeight: 1.4, fontWeight: 700 }}>
                    Outil de révision uniquement. Pour un vrai client allergique, vérifier en cuisine.
                  </div>
                </div>
              )}

              {item.memo && (
                <div style={{ background: "#fffdf5", border: "1px solid #fde047", borderRadius: 10, padding: "12px", fontSize: 11, color: "#78350f", lineHeight: 1.5, fontWeight: 600 }}>
                  <strong>⚡ MÉMO :</strong> {item.memo}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setExpandedItem(info.key)} className="touch-target btn-interactive" style={{ width: "100%", padding: "14px", background: "#fffbeb", border: "1px dashed #d97706", borderRadius: 10, color: "#b45309", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
              ❓ Révéler ingrédients, allergènes & pièges
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
          <button onClick={() => markItem(info.key, "review")} className="touch-target btn-interactive" style={{ flex: 1, padding: "10px", background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa", borderRadius: 12, fontWeight: 900, fontSize: 12, cursor: "pointer" }}>🧠 Je ne connais pas</button>
          <button onClick={() => markItem(info.key, "known")} className="touch-target btn-interactive" style={{ flex: 1, padding: "10px", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 12, fontWeight: 900, fontSize: 12, cursor: "pointer" }}>✅ Je connais</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #010f05 0%, var(--primary-green) 100%)", padding: "35px 16px 24px", textAlign: "center", boxShadow: "0 10px 30px rgba(6,36,16,0.15)" }}>
        <div style={{ fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 955, color: "var(--accent-gold)", letterSpacing: 2, textTransform: "uppercase" }}>🌴 MASTERMIND PARADIS</div>
        <div style={{ color: "#bbf7d0", fontSize: 12, marginTop: 6, marginBottom: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2 }}>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <div className="mini-stat"><div style={{ fontSize: 11, opacity: 0.78, fontWeight: 800 }}>Fiches</div><div style={{ fontSize: 20, fontWeight: 955 }}>{stats.total}</div></div>
          <div className="mini-stat"><div style={{ fontSize: 11, opacity: 0.78, fontWeight: 800 }}>Maîtrisées</div><div style={{ fontSize: 20, fontWeight: 955 }}>{stats.known}</div></div>
          <div className="mini-stat"><div style={{ fontSize: 11, opacity: 0.78, fontWeight: 800 }}>À revoir</div><div style={{ fontSize: 20, fontWeight: 955 }}>{stats.review}</div></div>
          <div className="mini-stat"><div style={{ fontSize: 11, opacity: 0.78, fontWeight: 800 }}>Erreurs</div><div style={{ fontSize: 20, fontWeight: 955 }}>{stats.mistakes}</div></div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {navItems.map(m => (
            <button key={m.id}
              onClick={() => setMode(m.id)}
              className="touch-target btn-interactive"
              style={{
                padding: "10px 16px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 850, fontSize: 12,
                background: mode === m.id ? "var(--accent-gold)" : "rgba(255,255,255,0.08)",
                color: mode === m.id ? "var(--primary-green)" : "#ffffff",
                boxShadow: mode === m.id ? "0 4px 15px rgba(234,179,8,0.3)" : "none"
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "quiz" && (
        <div style={{ maxWidth: 720, width: "100%", margin: "25px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={() => resetQuizStorage("all")} className="touch-target btn-interactive" style={{ flex: 1, minWidth: 180, padding: "12px", background: quizScope === "all" ? "var(--primary-green)" : "#ffffff", color: quizScope === "all" ? "#fff" : "var(--text-dark)", border: "1px solid #cbd5e1", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}>🎯 Examen complet</button>
            <button onClick={() => resetQuizStorage("weak")} className="touch-target btn-interactive" style={{ flex: 1, minWidth: 180, padding: "12px", background: quizScope === "weak" ? "var(--primary-green)" : "#ffffff", color: quizScope === "weak" ? "#fff" : "var(--text-dark)", border: "1px solid #cbd5e1", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}>🧠 Quiz erreurs uniquement</button>
          </div>

          {quizFinished ? (
            <div className="card-ui" style={{ textAlign: "center", padding: "40px 24px" }}>
              <div style={{ fontSize: 72 }}>🏆</div>
              <div style={{ fontSize: 26, fontWeight: 955, marginTop: 16, color: "var(--text-dark)" }}>Évaluation terminée</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-green)", marginTop: 10, background: "#f0fdf4", display: "inline-block", padding: "8px 20px", borderRadius: 99 }}>
                Score : {score.ok} / {questionsPool.length} ({questionsPool.length > 0 ? Math.round((score.ok / questionsPool.length) * 100) : 0}%)
              </div>
              <button onClick={() => resetQuizStorage(quizScope)} className="touch-target btn-interactive" style={{ width: "100%", marginTop: 30, padding: "16px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 15px rgba(6,36,16,0.2)" }}>
                🔄 Recommencer ce mode
              </button>
            </div>
          ) : questionsPool.length > 0 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 4px", gap: 10 }}>
                <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Progression : {quizIdx + 1} / {questionsPool.length}</span>
                <span style={{ fontSize: 12, fontWeight: 800, background: "#ffffff", padding: "6px 14px", borderRadius: 99, border: "1px solid #cbd5e1" }}>✅ {score.ok} · ❌ {score.nok}</span>
              </div>

              <div className="card-ui" style={{ padding: "30px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 10 }}>
                  <div style={{ fontSize: 10, color: "var(--primary-green)", textTransform: "uppercase", fontWeight: 900, background: "#e6f4ea", padding: "6px 12px", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                    {questionsPool[quizIdx].cat}
                  </div>
                  <button onClick={() => resetQuizStorage(quizScope)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    Nouveau tirage 🔄
                  </button>
                </div>

                <div style={{ fontSize: "clamp(17px, 4.5vw, 21px)", fontWeight: 950, lineHeight: 1.4, color: "var(--text-dark)", marginBottom: 30 }}>
                  {questionsPool[quizIdx].q}
                </div>

                {!showAnswer ? (
                  <button onClick={() => setShowAnswer(true)} className="touch-target btn-interactive" style={{ width: "100%", padding: "16px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 15px rgba(6,36,16,0.15)" }}>
                    👁️ Vérifier la réponse
                  </button>
                ) : (
                  <div className="animate-fade">
                    <div style={{ background: "#f0fdf4", borderRadius: 16, padding: 20, marginBottom: 25, borderLeft: "5px solid #16a34a" }}>
                      <div style={{ fontWeight: 800, color: "#14532d", fontSize: 15, lineHeight: 1.6 }}>
                        {questionsPool[quizIdx].a}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => handleNextQuestion(false)} className="touch-target btn-interactive" style={{ flex: 1, padding: "14px", background: "#fef2f2", color: "#991b1b", border: "1px solid #fee2e2", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>❌ À revoir</button>
                      <button onClick={() => handleNextQuestion(true)} className="touch-target btn-interactive" style={{ flex: 1, padding: "14px", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>✅ Maîtrisé</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card-ui" style={{ textAlign: "center", padding: 36 }}>
              <button onClick={() => buildExamSimulator("all")} className="touch-target btn-interactive" style={{ padding: "12px 24px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>
                🚀 Générer le pool de questions
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "allergens_tab" && (
        <div style={{ maxWidth: 900, width: "100%", margin: "25px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          <div className="card-ui" style={{ marginBottom: 20, padding: 20, borderLeft: "5px solid #dc2626", background: "#fff7ed" }}>
            <h3 style={{ margin: "0 0 6px 0", color: "#991b1b", fontWeight: 955, fontSize: 18 }}>⚠️ Important allergènes</h3>
            <p style={{ margin: 0, fontSize: 13, color: "#7c2d12", lineHeight: 1.55, fontWeight: 700 }}>
              Cette application est un outil de révision. Le détecteur fonctionne par mots-clés et peut rater des traces, préparations, contaminations croisées ou changements de recette. Pour un vrai client allergique, on vérifie toujours en cuisine.
            </p>
          </div>
          <div className="card-ui" style={{ marginBottom: 20, padding: 20, borderLeft: "5px solid var(--primary-green)" }}>
            <h3 style={{ margin: "0 0 6px 0", color: "var(--primary-green)", fontWeight: 955, fontSize: 18 }}>🛡️ Les 14 allergènes majeurs réglementaires</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, fontWeight: 500 }}>
              Référentiel de base pour apprendre les familles d'allergènes et les réflexes de contrôle.
            </p>
          </div>
          <div className="responsive-grid">
            {window.OFFICIAL_ALLERGENS.map((alg) => (
              <div key={alg.id} className="card-ui card-hover" style={{ padding: 18, borderTop: `4px solid ${alg.color.border}` }}>
                <span style={{ background: alg.color.bg, color: alg.color.text, border: `1px solid ${alg.color.border}`, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 900, display: "inline-block" }}>
                  {alg.name}
                </span>
                <p style={{ margin: "12px 0 0 0", fontSize: 13, color: "var(--text-dark)", fontWeight: 600, lineHeight: 1.5 }}>{alg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "search" && (
        <div style={{ maxWidth: 1200, width: "100%", margin: "25px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          <div className="card-ui" style={{ padding: 18, marginBottom: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 955, color: "var(--text-dark)", marginBottom: 10 }}>🔎 Recherche instantanée</div>
            <input className="input-ui" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tape saumon, céleri, pistou, sans gluten, Bacardi, mangue..." autoFocus />
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)", fontWeight: 800 }}>
              {searchQuery ? `${filteredItems.length} résultat(s)` : "Recherche dans noms, ingrédients, mémos, pièges et allergènes."}
            </div>
          </div>

          {searchQuery && (
            <div className="responsive-grid">
              {filteredItems.map((info) => <ProductCard key={info.key} info={info} forceReveal={true} showPath={true} />)}
            </div>
          )}
        </div>
      )}

      {mode === "review" && (
        <div style={{ maxWidth: 1200, width: "100%", margin: "25px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          <div className="card-ui" style={{ padding: 18, marginBottom: 18, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 955, color: "var(--text-dark)" }}>🧠 Fiches à revoir</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 800, marginTop: 4 }}>Triées par nombre d'erreurs. Le cerveau adore qu'on lui serve les fantômes un par un.</div>
            </div>
            <button onClick={resetProgress} className="touch-target btn-interactive" style={{ padding: "10px 14px", background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}>Réinitialiser progression</button>
          </div>

          {weakItems.length === 0 ? (
            <div className="card-ui" style={{ padding: 34, textAlign: "center" }}>
              <div style={{ fontSize: 48 }}>🌱</div>
              <div style={{ fontSize: 20, fontWeight: 955, color: "var(--text-dark)", marginTop: 10 }}>Aucune fiche à revoir pour l'instant</div>
              <p style={{ color: "var(--text-muted)", fontWeight: 700 }}>Clique sur “Je ne connais pas” dans la carte ou rate des questions en quiz pour alimenter cette zone.</p>
            </div>
          ) : (
            <div className="responsive-grid">
              {weakItems.map((info) => <ProductCard key={info.key} info={info} forceReveal={true} showPath={true} />)}
            </div>
          )}
        </div>
      )}

      {mode === "client" && activeClientScenario && (
        <div style={{ maxWidth: 900, width: "100%", margin: "25px auto", padding: "0 16px", boxSizing: "border-box" }} className="animate-fade">
          <div className="card-ui" style={{ padding: "28px 22px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--primary-green)", textTransform: "uppercase", fontWeight: 900, background: "#e6f4ea", padding: "6px 12px", borderRadius: 8, border: "1px solid #bbf7d0", display: "inline-block" }}>Simulation comptoir</div>
                <h2 style={{ margin: "14px 0 6px", fontSize: "clamp(20px, 5vw, 28px)", lineHeight: 1.25, color: "var(--text-dark)" }}>{activeClientScenario.title}</h2>
              </div>
              <button onClick={nextClientScenario} className="touch-target btn-interactive" style={{ padding: "10px 14px", background: "#f1f5f9", color: "var(--text-dark)", border: "none", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}>Suivant 🎲</button>
            </div>

            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-dark)", lineHeight: 1.45, marginBottom: 18 }}>
              “{activeClientScenario.prompt}”
            </div>

            {!showClientAnswer ? (
              <button onClick={() => setShowClientAnswer(true)} className="touch-target btn-interactive" style={{ width: "100%", padding: "16px", background: "var(--primary-green)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 900, cursor: "pointer" }}>👁️ Voir la réponse type</button>
            ) : (
              <div className="animate-fade">
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: "#166534", textTransform: "uppercase", marginBottom: 8 }}>Réflexe professionnel</div>
                  <div style={{ fontSize: 14, color: "#14532d", fontWeight: 800, lineHeight: 1.55 }}>{activeClientScenario.strategy}</div>
                </div>

                {activeClientScenario.items.length > 0 ? (
                  <div className="responsive-grid">
                    {activeClientScenario.items.map((info) => <ProductCard key={info.key} info={info} forceReveal={true} showPath={true} />)}
                  </div>
                ) : (
                  <div style={{ color: "var(--text-muted)", fontWeight: 800 }}>Aucun produit trouvé automatiquement. Vérifie la carte complète.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {mode === "learn" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          <div className="tab-container" style={{ display: "flex", gap: 8, padding: "14px 16px", background: "var(--panel-bg)", borderBottom: "1px solid #cbd5e1", overflowX: "auto", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(window.SECTIONS).map(([key, s]) => {
                const totalItems = Object.values(s.categories).reduce((acc, cat) => acc + cat.items.length, 0);
                return (
                  <button key={key} onClick={() => { setActiveTab(key); setExpandedCat(null); setExpandedItem(null); }}
                    className="touch-target btn-interactive"
                    style={{
                      padding: "10px 18px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap",
                      background: activeTab === key ? s.color : "#f1f5f9",
                      color: activeTab === key ? "#fff" : "var(--text-muted)",
                      boxShadow: activeTab === key ? `0 4px 12px ${s.color}40` : "none"
                    }}>
                    {s.label} ({totalItems})
                  </button>
                );
              })}
            </div>
            <button onClick={() => setFlashcardMode(!flashcardMode)} className="touch-target btn-interactive" style={{ padding: "10px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap", background: flashcardMode ? "var(--primary-green)" : "#e2e8f0", color: flashcardMode ? "#fff" : "var(--text-dark)" }}>
              {flashcardMode ? "👁️ Tout afficher" : "🙈 Mode cache"}
            </button>
          </div>

          <div style={{ padding: "20px 16px", width: "100%", boxSizing: "border-box", maxWidth: 1200, margin: "0 auto" }}>
            {Object.entries(section.categories).map(([catKey, cat]) => {
              const categoryItems = allItems.filter((info) => info.sectionKey === activeTab && info.categoryKey === catKey);
              return (
                <div key={catKey} style={{ marginBottom: 20, borderRadius: 16, overflow: "hidden", background: "var(--panel-bg)", border: "1px solid #cbd5e1" }}>
                  <button onClick={() => setExpandedCat(expandedCat === catKey ? null : catKey)} className="touch-target card-hover" style={{ width: "100%", padding: "18px 20px", background: "var(--panel-bg)", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                    <span style={{ fontWeight: 955, fontSize: 16, color: "var(--text-dark)" }}>{cat.emoji} &nbsp;&nbsp; {cat.label} ({cat.items.length})</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 18, fontWeight: "bold" }}>{expandedCat === catKey ? "−" : "+"}</span>
                  </button>

                  {expandedCat === catKey && (
                    <div style={{ padding: "16px", background: "#faf9f5", borderTop: "1px solid #cbd5e1" }}>
                      <div className="responsive-grid">
                        {categoryItems.map((info) => <ProductCard key={info.key} info={info} />)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);
