(function () {
  "use strict";

  const APP_VERSION = "v15";
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

    const name = normalizeText(item.name || "");
    if (
      text.includes("thon") ||
      text.includes("saumon") ||
      text.includes("merlu") ||
      text.includes("limande") ||
      text.includes("poisson") ||
      text.includes("gravlax") ||
      text.includes("sauce caesar") ||
      name === "caesar au paradis"
    ) add("Poissons");
    if (text.includes("crevette") || text.includes("homard") || text.includes("crustace") || text.includes("lobster")) add("Crustacés");
    if (text.includes("oeuf") || text.includes("brouillade") || text.includes("mayonnaise") || text.includes("caesar") || text.includes("tartare") || text.includes("meringue") || text.includes("pancake") || text.includes("gaufre") || text.includes("chou") || text.includes("profiterole") || text.includes("cheesecake")) add("Œufs");
    const hasLaitAnimal = text.includes("lait") && !text.includes("lait de coco");
    const forceLactose = name === "fish chips";
    if (
      hasLaitAnimal ||
      forceLactose ||
      text.includes("creme") ||
      text.includes("cheddar") ||
      text.includes("chevre") ||
      text.includes("mozzarella") ||
      text.includes("burrata") ||
      text.includes("feta") ||
      text.includes("cheese") ||
      text.includes("camembert") ||
      text.includes("grana") ||
      text.includes("yaourt") ||
      text.includes("yogurt") ||
      text.includes("yolita") ||
      text.includes("glace") ||
      text.includes("vanille") ||
      text.includes("nougat") ||
      text.includes("cappuccino") ||
      text.includes("latte")
    ) add("Lait / lactose");
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

    const style = (bg, color, border) => `background:${bg};color:${color};border:1px solid ${border}`;

    if (lower.includes("pommes frites")) return style("#F4DDA1", "#7C5B0B", "#DFBE72");
    if (lower.includes("pomme de terre")) return style("#EFE0C4", "#775A27", "#D7BD8A");

    const rules = [
      // Fruits rouges / roses
      { keys: ["fraise senga", "fraises des bois"], css: style("#F8D9D7", "#9F2D3F", "#EDB3AE") },
      { keys: ["fraise", "fraises"], css: style("#F7D7D3", "#A7333F", "#EBAFA8") },
      { keys: ["framboise cranberry hibiscus", "framboise-cranberry-hibiscus"], css: style("#F2D4E4", "#9B2F61", "#E3A9C5") },
      { keys: ["framboise", "framboises"], css: style("#F5D7E6", "#A8385F", "#E7B0CC") },
      { keys: ["grenade"], css: style("#F4D6DC", "#8F2739", "#E4AEB8") },
      { keys: ["cranberry"], css: style("#F3D7E2", "#8E2F55", "#E2AFC2") },
      { keys: ["hibiscus"], css: style("#EED7EA", "#7E3A78", "#D8B0D2") },
      { keys: ["fruits rouges", "coulis de fruits", "coulis multi-fruits", "multi-fruits", "fruit de la passion"], css: style("#F5DDE1", "#9A3448", "#E8B8C0") },

      // Agrumes / fruits jaunes / orangés
      { keys: ["carottes jaunes et oranges", "brunoise de carottes", "julienne de carottes", "carotte", "carottes"], css: style("#FBE1CE", "#B84A1A", "#EFBF9B") },
      { keys: ["orange fraichement pressee", "orange ou pamplemousse", "orange"], css: style("#F9D8BE", "#B94D18", "#EDB28C") },
      { keys: ["clementine corse", "clémentine corse"], css: style("#FCE0B7", "#AD5A00", "#F0BE78") },
      { keys: ["pamplemousse", "sirop de pamplemousse"], css: style("#F8D0C6", "#AC3F31", "#EAA497") },
      { keys: ["citron vert"], css: style("#E8EDBD", "#60720F", "#D3DC86") },
      { keys: ["citron jaune", "citron confit", "citron presse", "citron"], css: style("#F9EDB2", "#846B05", "#E8D56F") },
      { keys: ["ananas-verveine", "ananas verveine"], css: style("#F9E9B9", "#80690A", "#E8D98A") },
      { keys: ["ananas poeles", "ananas frais", "decoupe d'ananas", "des d'ananas", "ananas"], css: style("#F9E38E", "#7B6500", "#E6C852") },
      { keys: ["banane caramelisee", "decoupe de banane", "banane"], css: style("#F8E8A4", "#806505", "#E7D06B") },
      { keys: ["mangue alphonso", "puree de mangue", "mangue en des", "mangue"], css: style("#F9D693", "#9A5A00", "#EAB76A") },
      { keys: ["abricot"], css: style("#F8CFA7", "#A85312", "#E8A977") },
      { keys: ["peche jaune", "pêche jaune"], css: style("#F8D7AD", "#9A5C12", "#E9B97F") },
      { keys: ["melon jaune", "melon"], css: style("#F7E1A5", "#81660C", "#E5CC75") },
      { keys: ["pasteque", "pastèque"], css: style("#F6CFCF", "#A5363B", "#E7A4A4") },
      { keys: ["goyave"], css: style("#F6D3C9", "#A14535", "#E8A89A") },
      { keys: ["litchi"], css: style("#F7DEE5", "#8E3A55", "#E7B6C5") },
      { keys: ["myrtilles"], css: style("#E1DDF3", "#4B3C91", "#C7BFE9") },
      { keys: ["açai", "acai"], css: style("#E5D7F0", "#673A85", "#CDB2DF") },
      { keys: ["fruits de saison", "decoupe de fruits", "fruits prepares minute"], css: style("#F3E6C9", "#745A18", "#E0C98D") },

      // Fruits / légumes verts
      { keys: ["pomme bio", "pomme"], css: style("#DDEDCB", "#3F6F1D", "#BED9A2") },
      { keys: ["kiwi"], css: style("#D9E9C7", "#4F6A1B", "#B9D394") },
      { keys: ["menthe fraiche", "feuilles de menthe", "menthe"], css: style("#D7E8D8", "#155C38", "#AFD0B6") },
      { keys: ["basilic"], css: style("#DCEBD0", "#2F6B20", "#BBD8A7") },
      { keys: ["pistou"], css: style("#D5E8C9", "#27611E", "#ABD09A") },
      { keys: ["coriandre"], css: style("#D8EBD0", "#2D6E2D", "#B4D8A9") },
      { keys: ["persil"], css: style("#D9EAD3", "#28633A", "#B6D5B2") },
      { keys: ["ciboulette"], css: style("#DCEED5", "#356B33", "#BDDCB5") },
      { keys: ["herbes fraiches"], css: style("#DDEAD2", "#345F2A", "#BED8B2") },
      { keys: ["avocat frais", "1/2 avocat", "demi avocat", "avocat"], css: style("#DCE6B7", "#506514", "#C4D28C") },
      { keys: ["kale"], css: style("#D3E5CE", "#1F5E35", "#AACBA8") },
      { keys: ["epinard", "épinard", "pousses d'epinard"], css: style("#D8E8D3", "#285D36", "#B3D0AE") },
      { keys: ["roquette"], css: style("#D7E6C9", "#3B641D", "#B5CF9D") },
      { keys: ["salade romaine", "meli-melo de salade", "mini salade", "mesclun", "salade"], css: style("#E2ECCE", "#446A21", "#C4D5A2") },
      { keys: ["concombre"], css: style("#DCEEDB", "#26714B", "#B9DBB8") },
      { keys: ["courgettes marinees", "courgette", "courgettes"], css: style("#DCE8C8", "#55711C", "#BDD2A0") },
      { keys: ["haricots verts"], css: style("#D6E7C9", "#3C6622", "#B4D09F") },
      { keys: ["edamames"], css: style("#D7EBD0", "#2E6B2D", "#B4D7AA") },
      { keys: ["petits pois"], css: style("#DCEBC7", "#4D6D1E", "#BED69D") },
      { keys: ["plantes"], css: style("#E1EAD5", "#435D35", "#C5D5B7") },

      // Légumes / condiments
      { keys: ["tomates cerises mi-sechees", "tomates d'antan", "tomates multicolores", "chutney de tomates", "condiment tomate", "tomate", "tomates"], css: style("#F5D6CE", "#A33D2C", "#E7A99B") },
      { keys: ["poivron roti", "poivron", "poivrons"], css: style("#F6D9C8", "#A74721", "#E9AD91") },
      { keys: ["aubergine"], css: style("#E7DBF0", "#68417A", "#CEB5DF") },
      { keys: ["mais", "maïs"], css: style("#F7E6A8", "#7F6408", "#E5CC70") },
      { keys: ["oignon rouge", "oignons rouges"], css: style("#EAD9EA", "#7B3E77", "#D4B1D4") },
      { keys: ["oignons frits"], css: style("#F2DEC2", "#7D5422", "#DDBD92") },
      { keys: ["cornichons"], css: style("#DEE9C9", "#526820", "#C2D39B") },
      { keys: ["olives taggiasche"], css: style("#DFE2C6", "#5D6025", "#C6C992") },
      { keys: ["coleslaw", "chou"], css: style("#EADFC8", "#6A5330", "#D2BF97") },
      { keys: ["raisins"], css: style("#E8D9EF", "#673B75", "#CFB5DC") },
      { keys: ["celeri", "céleri", "tige de celeri"], css: style("#E1EBCF", "#4F6828", "#C4D6A4") },
      { keys: ["gingembre"], css: style("#F2E2C5", "#805A1C", "#DBBF8D") },

      // Poissons / fruits de mer
      { keys: ["saumon fume", "tartinade de saumon", "brochettes de saumon", "saumon"], css: style("#F6D7C9", "#B14D2E", "#E9AE98") },
      { keys: ["tartinade de thon", "thon listao", "thon"], css: style("#E7EEF2", "#24566C", "#C4DAE4") },
      { keys: ["merlu du cap", "dos de merlu", "merlu"], css: style("#DCEAF0", "#24536A", "#B8D4E0") },
      { keys: ["limande"], css: style("#E0EDF2", "#2B5E72", "#BFDAE4") },
      { keys: ["crevettes panko", "crevettes"], css: style("#F5D7D2", "#A64234", "#E7ACA4") },
      { keys: ["homard", "chair de homard"], css: style("#F4D3C8", "#A33B24", "#E4A798") },
      { keys: ["poissons"], css: style("#DDECF2", "#27566E", "#BAD7E3") },

      // Viandes
      { keys: ["crispy de poulet", "poulet au citron", "poulet marine", "poulet miel", "brochettes de poulet", "cremeux de poulet", "poulet"], css: style("#F3E0CC", "#7B4E23", "#E0BD94") },
      { keys: ["chiffonnade de dinde fumee", "chiffonnade de dinde", "dinde fumee", "dinde"], css: style("#EFE0D2", "#765031", "#D9BEA5") },
      { keys: ["pastrami de boeuf", "pastrami", "boeuf", "bœuf"], css: style("#EAD7CE", "#78402D", "#D4AD9D") },

      // Fromages / laitages
      { keys: ["cheddar fondu", "sauce cheddar", "cheddar"], css: style("#F6D58F", "#8A5500", "#E5B95E") },
      { keys: ["mozzarella fior di latte", "mozzarella"], css: style("#F4ECD9", "#6F5A35", "#DDD0B0") },
      { keys: ["burrata"], css: style("#F3ECD7", "#6A5B2E", "#DBD0A8") },
      { keys: ["feta"], css: style("#F1ECDC", "#5F6252", "#D8D1B7") },
      { keys: ["chevre", "chèvre"], css: style("#EFE7D8", "#665132", "#D8C6A8") },
      { keys: ["cream cheese"], css: style("#EFE5EE", "#6F3F6F", "#D8C2D8") },
      { keys: ["creme liquide", "creme fraiche", "creme anglaise", "creme fouettee", "crème"], css: style("#F3E7D9", "#765F40", "#DAC5AB") },
      { keys: ["lait de coco", "lait chaud", "lait ou boisson vegetale", "base au lait", "lait"], css: style("#EEE8F1", "#604C70", "#D6C6DF") },
      { keys: ["yolita frozen yogurt", "frozen yogurt", "yolita", "yaourt"], css: style("#ECE3F1", "#6B3E72", "#D4BFE0") },
      { keys: ["glace noix de coco", "noix de coco au lait de coco", "noix de coco"], css: style("#EFEFE4", "#5E6148", "#D4D3BC") },

      // Féculents / pains / céréales
      { keys: ["pommes frites"], css: style("#F4DDA1", "#7C5B0B", "#DFBE72") },
      { keys: ["pita toastee", "pita toastée", "pita"], css: style("#F0D6B5", "#76501F", "#D7AF7F") },
      { keys: ["focaccia toastee", "focaccia au pistou", "focaccia"], css: style("#EED5B7", "#73511F", "#D5B184") },
      { keys: ["blini chaud", "blini"], css: style("#EEDAB8", "#75541F", "#D7B987") },
      { keys: ["toasts croustillants", "toast"], css: style("#EBD0AA", "#74511E", "#D3A976") },
      { keys: ["pain au curcuma", "pain brioche", "pain"], css: style("#EED2AA", "#76501E", "#D5A975") },
      { keys: ["brioche"], css: style("#EFCFA3", "#79511B", "#D9A96F") },
      { keys: ["croutons", "croûtons"], css: style("#EAD0A6", "#6F4D1B", "#D0A56E") },
      { keys: ["gnocchis"], css: style("#EFE0C4", "#775A27", "#D7BD8A") },
      { keys: ["riz vapeur", "riz"], css: style("#F0E6CE", "#6F5D38", "#D9C7A0") },
      { keys: ["quinoa"], css: style("#EAD9B6", "#735A22", "#D0B37A") },
      { keys: ["boulgour"], css: style("#E4D0A6", "#70531B", "#C8A86F") },
      { keys: ["muesli"], css: style("#E8D3AE", "#70511E", "#CFAE7A") },
      { keys: ["multigraines", "graines de sesame", "sésame", "sesame", "amandes coco crunch"], css: style("#E8D7B7", "#765A27", "#CDB58A") },
      { keys: ["gaufres", "gaufre"], css: style("#EECF9F", "#815316", "#D9A96D") },
      { keys: ["pancakes"], css: style("#F0D5A8", "#7C551C", "#DAB177") },

      // Sauces / assaisonnements
      { keys: ["vinaigrette aux agrumes"], css: style("#F2DFA8", "#7A610A", "#DDC170") },
      { keys: ["sauce caesar"], css: style("#E8DAC1", "#6C5630", "#D0B993") },
      { keys: ["sauce tartare"], css: style("#E7E4C9", "#5F6530", "#CCCAA0") },
      { keys: ["sauce thai", "sauce thaï"], css: style("#F0D9BF", "#8A4C1D", "#D9B08A") },
      { keys: ["sauce tom yum"], css: style("#F4D2C7", "#A33E28", "#E3A396") },
      { keys: ["sauce spicy mayo"], css: style("#F5D5C3", "#A34A1E", "#E6A884") },
      { keys: ["sauce sweet chili"], css: style("#F5D3C7", "#A23C27", "#E6A396") },
      { keys: ["sauce gravlax"], css: style("#E7E3C4", "#68642D", "#CFC991") },
      { keys: ["mayonnaise homard", "mayonnaise"], css: style("#EFE0C2", "#755A28", "#D7BD89") },
      { keys: ["moutarde au miel", "miel"], css: style("#F3DF9E", "#7C6308", "#DEC46B") },
      { keys: ["sauce barbecue"], css: style("#EACFC0", "#7E3E23", "#D3A48F") },
      { keys: ["sucre en poudre", "sucree", "sucrée"], css: style("#EFE8D6", "#655A42", "#D7C9AA") },
      { keys: ["american syrup"], css: style("#EAD0AC", "#7B4E19", "#D3A879") },

      // Chocolat / gourmandises
      { keys: ["chocolat noir guanaja", "glace chocolat", "chocolat chaud valrhona", "chocolat chaud", "chocolat"], css: style("#E7D4C4", "#5C3320", "#CDAA92") },
      { keys: ["nutella"], css: style("#E9D3C2", "#60361F", "#D0A78E") },
      { keys: ["sauce choco-noisette", "sauce choco-nutella"], css: style("#E5CDBB", "#5B321F", "#C99F86") },
      { keys: ["caramelito", "carambar", "caramel"], css: style("#EBCDA4", "#80511A", "#D6A870") },
      { keys: ["nougat"], css: style("#EEE2CA", "#735C35", "#D5C09A") },
      { keys: ["vanille de madagascar", "vanille"], css: style("#F1E6C9", "#725D2D", "#D9C694") },
      { keys: ["pistache de sicile", "pistache crunch", "pistache"], css: style("#DCE8C5", "#566F22", "#BED29A") },
      { keys: ["chamallows"], css: style("#F4DEE4", "#8B3F56", "#E1B5C3") },
      { keys: ["smarties"], css: style("#E3DDF2", "#51458B", "#C8BFE7") },
      { keys: ["fondant au chocolat sans gluten", "fondant choco", "gateau au chocolat"], css: style("#E6D0BD", "#5A321E", "#C9A58D") },
      { keys: ["tarte au citron"], css: style("#F5E6AA", "#7B620A", "#DDC573") },
      { keys: ["tarte caramelisee"], css: style("#EBD0A8", "#7B501A", "#D3A877") },
      { keys: ["cheesecake"], css: style("#EFE4CF", "#6F5730", "#D8C2A0") },
      { keys: ["meringue"], css: style("#F2E9D8", "#655945", "#D8CBB0") },
      { keys: ["p'tit chou", "chou xxl"], css: style("#E9D0B0", "#76501E", "#D0A778") },
      { keys: ["esquimau"], css: style("#E8DFF0", "#5E4570", "#D0BEE0") },

      // Boissons chaudes / froides / alcool
      { keys: ["eau petillante san pellegrino", "eau minerale vittel", "eau petillante", "eau"], css: style("#DCEAF2", "#25566D", "#B7D4E2") },
      { keys: ["tonic", "touche d'amertume"], css: style("#E8E7C7", "#666628", "#CFCD92") },
      { keys: ["thé vert glace", "the vert glace", "thé vert", "the vert"], css: style("#DCE9D0", "#3F682A", "#BED7AA") },
      { keys: ["the noir", "thé noir", "thes noirs", "thés noirs"], css: style("#E4D6C7", "#5D4630", "#CBB19B") },
      { keys: ["matcha"], css: style("#D8E6C3", "#516B22", "#B7CC91") },
      { keys: ["rooibos"], css: style("#ECD2BF", "#805034", "#D6A98D") },
      { keys: ["bergamote", "fleur d'oranger"], css: style("#F2DAB5", "#805511", "#DDBC82") },
      { keys: ["infusion", "latte", "cappuccino", "cafe", "café", "expresso"], css: style("#E5D6C8", "#5C4532", "#CDB49D") },
      { keys: ["gin bombay sapphire"], css: style("#D9E9EA", "#1F5D64", "#AED2D5") },
      { keys: ["rhum bacardi carta oro"], css: style("#EBD0A4", "#835319", "#D4AA71") },
      { keys: ["tequila camino real"], css: style("#EBD7A8", "#7E5A11", "#D4B875") },
      { keys: ["aperol"], css: style("#F5CFB8", "#A54A16", "#E3A27E") },
      { keys: ["prosecco martini"], css: style("#F0E2A9", "#7B6410", "#D9C474") },
      { keys: ["liqueur st-germain"], css: style("#E8DDF1", "#604479", "#CFBDE0") },
      { keys: ["triple sec"], css: style("#F0DDB0", "#7C5B12", "#D8BF7E") },
      { keys: ["vin blanc"], css: style("#F0E7C8", "#725F22", "#D9CB97") },
      { keys: ["vin rouge"], css: style("#E7D0D7", "#783044", "#CFA7B3") },
      { keys: ["vin rose", "rosé"], css: style("#F2D2D3", "#934244", "#DEA8AA") },
      { keys: ["biere ipa", "biere blonde", "bière", "ipa"], css: style("#EED59A", "#7E580A", "#D8B765") },
      { keys: ["cidre"], css: style("#ECD8A3", "#795D0F", "#D5BC71") },
      { keys: ["sans alcool"], css: style("#DCE9EF", "#285B6D", "#B8D3DE") },

      // Formats / formules
      { keys: ["plateau geant", "8 saveurs"], css: style("#E8DCC8", "#685132", "#D0BB94") },
      { keys: ["saveurs au choix", "saveur au choix", "parfums au choix", "parfum au choix", "toppings au choix", "accompagnement au choix"], css: style("#E8E2CF", "#5F5A43", "#D1C7A6") },
      { keys: ["a partager", "à partager"], css: style("#E9DCCB", "#6D5135", "#D0B999") },
      { keys: ["cl", "1l", "5,8", "6°", "aop", "chapoutier"], css: style("#E4E2D4", "#52594A", "#CBC7B1") }
    ];

    const match = rules.find((rule) => rule.keys.some((key) => lower.includes(normalizeText(key))));
    if (match) return match.css;

    const fallbackPalette = [
      style("#E6DFF0", "#574571", "#CCBFE1"),
      style("#F0DED2", "#724B35", "#D9BAA7"),
      style("#DFE9D2", "#455F2C", "#C0D4AA"),
      style("#F0E2C2", "#705823", "#D7BF88"),
      style("#DDE9ED", "#2E5967", "#BCD4DC"),
      style("#F1DADC", "#83424A", "#DDB2B8"),
      style("#E6E1CC", "#5B5F3D", "#CDC79E"),
      style("#E9DDC8", "#664F31", "#D0BA94")
    ];

    let hash = 0;
    for (const char of lower) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return fallbackPalette[hash % fallbackPalette.length];
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
      adam: findOne(["adam eve"]),
      terrestre: findOne(["paradis terrestre"]),
      celeste: findOne(["paradis celeste"]),
      paradisParadis: findOne(["paradis du paradis", "plateau geant"]),
      fondant: findOne(["fondant coeur coulant"]),
      detox: findOne(["veggie detox"]),
      pommeBio: findOne(["pomme bio"]),
      coleslaw: findOne(["coleslaw"]),
      spritz: findOne(["spritz original"]),
      composer: findOne(["yoyo a composer", "vegan a composer"]),
      caesar: findOne(["caesar au paradis"]),
      banquise: findOne(["banquise sauvage"]),
      hugo: findOne(["hugo spritz"]),
      fragola: findOne(["fragola"]),
      goody: findOne(["goody woody"]),
      josephine: findOne(["josephine baker"]),
      chutney: findOne(["chutney de tomates"]),
      veggieBurger: findOne(["veggie burger"]),
      dolce: findOne(["dolce paradisio"])
    };

    return [
      question(
        "manual__fish_chips_poisson",
        "Pièges carte",
        "Comparaison",
        "Difficile",
        "Deux versions de Fish & Chips existent sur la carte. Quelle différence dois-tu connaître ?",
        "Le Fish & Chips en plat utilise du merlu du Cap croustillant avec frites, mesclun et sauce tartare. Le Mini Fish & Chips des assiettes à composer utilise de la limande avec sauce tartare.",
        refs.fish && refs.fish.id
      ),
      question(
        "manual__fish_chips_lactose",
        "Allergènes",
        "Vigilance service",
        "Difficile",
        "Pour le Fish & Chips, quel allergène moins évident dois-tu aussi vérifier en plus du poisson et du gluten possible ?",
        "Lait / lactose. Réflexe pro : ne pas garantir à l'oral sans vérifier la fiche allergènes officielle et/ou la cuisine.",
        refs.fish && refs.fish.id
      ),
      question(
        "manual__thon_celeri",
        "Pièges allergènes",
        "Réflexe service",
        "Difficile",
        "Un client allergique au céleri hésite sur une préparation au thon. Quel réflexe dois-tu avoir ?",
        "Vérifier la tartinade de thon : elle contient du céleri et du poivron, avec thon Listao. Ne jamais improviser en cas d'allergie.",
        refs.thon && refs.thon.id
      ),
      question(
        "manual__caesar_poisson_cache",
        "Allergènes",
        "Vigilance sauce",
        "Difficile",
        "Quel allergène peut être moins évident dans une salade Caesar, même si le nom du plat ne le montre pas ?",
        "Poissons, à cause de la sauce Caesar qui peut contenir de l'anchois selon la recette. Réflexe : vérifier la liste officielle.",
        refs.caesar && refs.caesar.id
      ),
      question(
        "manual__banquise_oeuf",
        "Allergènes",
        "Composition",
        "Moyen",
        "Dans un toast chaud au saumon avec tartinade à l'aneth, quel ingrédient ajoute une vigilance œuf ?",
        "L'œuf poché de la Banquise Sauvage. À retenir aussi : saumon/tartinade de saumon, pousses d'épinard et pommes frites.",
        refs.banquise && refs.banquise.id
      ),
      question(
        "manual__pomme_bio_celeri",
        "Boissons",
        "Piège garniture",
        "Moyen",
        "Certains jus à base de pomme Bio ont un détail de service à ne pas oublier. Lequel ?",
        "Ils sont accompagnés d'une tige de céleri. Produits concernés : Double Force, Apple Bunny, Tornade Santé, Green Attitude et Super Green.",
        refs.pommeBio && refs.pommeBio.id
      ),
      question(
        "manual__veggie_detox_sucre",
        "Boissons",
        "Piège composition",
        "Moyen",
        "Quelle boisson verte ne doit pas être présentée comme totalement sans sucre, et pourquoi ?",
        "Le Veggie Detox, car il contient du jus aloe vera avec présence de sucre. Composition : concombre, kale, menthe, jus aloe vera.",
        refs.detox && refs.detox.id
      ),
      question(
        "manual__fondant_sans_gluten",
        "Desserts",
        "Allergène",
        "Moyen",
        "Un client cherche un dessert indiqué sans gluten sur la carte. Que peux-tu citer en priorité ?",
        "Le Fondant Cœur Coulant : fondant au chocolat sans gluten avec crème anglaise et crème fouettée. En cas d'allergie sévère, vérifier la procédure officielle.",
        refs.fondant && refs.fondant.id
      ),
      question(
        "manual__assiettes_formules",
        "Assiettes à composer",
        "Formule",
        "Facile",
        "Comment résumer les quatre formats d'assiettes à composer ?",
        "Adam & Eve = 2 saveurs + 1 accompagnement. Paradis Terrestre = 3 saveurs + 1 accompagnement. Paradis Céleste = 4 saveurs + 1 accompagnement. Paradis du Paradis = 8 saveurs avec frites et coleslaw, idéal pour 2.",
        refs.paradisParadis && refs.paradisParadis.id
      ),
      question(
        "manual__formule_midi",
        "Assiettes à composer",
        "Service",
        "Moyen",
        "À quel moment les formules midi des assiettes à composer s'appliquent-elles ?",
        "De 11h30 à 15h00, du lundi au vendredi, hors jours fériés. Les formules concernées ajoutent aussi “Choisis ta bulle”.",
        refs.adam && refs.adam.id
      ),
      question(
        "manual__dans_ta_bulle",
        "Boissons",
        "Explication client",
        "Moyen",
        "Un client demande ce qu'est “Dans ta Bulle XXL”. Comment l'expliquer simplement ?",
        "C'est une boisson XXL de 45cl à base de tonic avec une touche d'amertume. Choix : citron jaune, concombre, orange fraîchement pressée, ananas-verveine ou framboise-cranberry-hibiscus.",
        refs.bulle && refs.bulle.id
      ),
      question(
        "manual__cocktails_composer",
        "Boissons",
        "Structure",
        "Moyen",
        "Comment fonctionne la famille des Cocktails à Composer ?",
        "Le client choisit une base : Yoyo, Fruit, Milk ou Vegan, puis 1 ou 2 parfums dans la liste. Un fruit supplémentaire peut être ajouté.",
        refs.composer && refs.composer.id
      ),
      question(
        "manual__presses_sans_sucre",
        "Boissons",
        "Promesse carte",
        "Facile",
        "Quelle différence faut-il faire entre les Pressés Minute et le Citron Pressé ?",
        "Les Pressés Minute sont des fruits pressés à la demande, sans sucre ajouté. Le Citron Pressé est servi avec eau et sucre en poudre.",
        refs.pommeBio && refs.pommeBio.id
      ),
      question(
        "manual__alcool_bases",
        "Mixologie",
        "Alcools",
        "Difficile",
        "Quelles bases d'alcool retenir pour les grandes familles de cocktails ?",
        "Margarita = tequila Camino Real. Daiquiri, Mojito et Pina Colada = rhum Bacardi Carta Oro. Spritz = Apérol/Prosecco, sauf Hugo avec St-Germain/Prosecco. Basilic Instinct = gin Bombay Sapphire.",
        refs.spritz && refs.spritz.id
      ),
      question(
        "manual__cocktail_fruite_alcool",
        "Mixologie",
        "Conseil client",
        "Moyen",
        "Un client veut un cocktail alcoolisé fruité. Quelles propositions cohérentes peux-tu donner ?",
        "Pink Spritz, Passion Spritz, Hugo Spritz, Mojito Fruit, Pina Colada La Fragola, Margarita Mangue, Danse Joséphine ou Daiquiri Passion & Framboise.",
        refs.hugo && refs.hugo.id
      ),
      question(
        "manual__coleslaw",
        "Vocabulaire carte",
        "Service client",
        "Moyen",
        "Un client demande ce qu'est le coleslaw. Quelle réponse simple donner ?",
        "C'est un accompagnement froid type salade de chou et carotte, avec raisins et sauce sucrée/crémeuse. Pour une allergie, vérifier la fiche officielle.",
        refs.coleslaw && refs.coleslaw.id
      ),
      question(
        "manual__chutney_tomate",
        "Vocabulaire carte",
        "Service client",
        "Facile",
        "Comment expliquer un chutney de tomate à un client ?",
        "C'est une compotée/condiment de tomate, légèrement sucré-acidulé, plus parfumé qu'une sauce tomate classique.",
        refs.chutney && refs.chutney.id
      ),
      question(
        "manual__combo_rapide",
        "Service client",
        "Conseil",
        "Moyen",
        "Un client veut commander vite. Quelle logique de conseil peux-tu utiliser ?",
        "Proposer une logique claire : léger = salade ou avocado toast + boisson fraîche ; rapide/gourmand = toast chaud type Goody Woody ; star fruitée = Joséphine Baker ou Mangue Énergie ; dessert gourmand = gaufre, pancake ou dessert chocolaté selon faim.",
        refs.goody && refs.goody.id
      ),
      question(
        "manual__vegetarien_vrai_plat",
        "Service client",
        "Conseil",
        "Moyen",
        "Un client végétarien veut un vrai plat, pas seulement une salade. Que peux-tu proposer ?",
        "Le Veggie Burger, Dolce Paradisio, Pistou Presto, Le Veggie en avocado toast, Tutti Salata, ou des pitas/fromages sans viande ni poisson selon disponibilité.",
        refs.veggieBurger && refs.veggieBurger.id
      ),
      question(
        "manual__vegan_prudence",
        "Service client",
        "Vigilance",
        "Difficile",
        "Pourquoi faut-il être prudent quand un client demande une option vegan ?",
        "Beaucoup d'options veggie contiennent fromage, œuf, crème, miel ou sauce non vegan. Proposer plutôt boissons fruitées/vegan à composer, puis vérifier précisément chaque plat en cuisine.",
        refs.composer && refs.composer.id
      )
    ];
  }

  function hasObviousAllergenInName(item, allergens) {
    const name = normalizeText(item.name || "");
    const checks = [
      { allergen: "Poissons", words: ["thon", "saumon", "fish", "merlu", "limande", "poisson"] },
      { allergen: "Crustacés", words: ["crevette", "homard", "lobster"] },
      { allergen: "Œufs", words: ["oeuf", "brouillade", "pancake", "gaufre", "profiterole", "meringue"] },
      { allergen: "Lait / lactose", words: ["cheddar", "chevre", "mozzarella", "burrata", "feta", "cheese", "lait", "latte", "cappuccino", "glace", "yolita", "yaourt", "cream"] },
      { allergen: "Fruits à coque", words: ["noix", "amande", "pistache", "praline", "noisette", "nutella", "nougat"] },
      { allergen: "Gluten possible", words: ["pita", "focaccia", "toast", "burger", "pain", "gaufre", "pancake", "tarte", "cheesecake", "gateau"] }
    ];

    return checks.some((entry) =>
      allergens.includes(entry.allergen) &&
      entry.words.some((word) => name.includes(normalizeText(word)))
    );
  }

  function ingredientLooksGivenInName(itemName, ingredient) {
    const name = normalizeText(itemName);
    const text = normalizeText(ingredient);
    const stopWords = new Set([
      "avec", "dans", "pour", "facon", "paradis", "fruit", "fruits", "saveur", "mini",
      "pita", "toastee", "toast", "toasts", "sauce", "cremeux", "cremeuse", "creme",
      "fior", "latte", "aop", "chaud", "chaude", "frais", "fraiche", "fraiches", "des", "aux"
    ]);

    return text
      .split(" ")
      .filter((word) => word.length >= 4 && !stopWords.has(word))
      .some((word) => name.includes(word));
  }

  function ingredientLeakCount(item, ingredients) {
    return ingredients.filter((ingredient) => ingredientLooksGivenInName(item.name || "", ingredient)).length;
  }

  function makeCompositionQuiz(item, ingredients) {
    const name = cleanItemName(item.name);
    const normalized = normalizeText(name);

    const make = (label, questionText, answerParts) => ({
      label,
      questionText,
      answer: answerParts.filter(Boolean).join(" · ")
    });

    if (normalized.includes("pita toastee") && normalized.includes("chevre")) {
      return make(
        "Pita toastée Chèvre",
        "Tu dois préparer ou annoncer “Pita toastée Chèvre”. Quels éléments principaux retenir en plus du chèvre ?",
        ingredients.filter((ingredient) => !containsAnyText(ingredient, ["pita toastee", "chevre"]))
      );
    }

    if (normalized.includes("pita toastee") && normalized.includes("thon")) {
      return make(
        "Pita toastée Thon",
        "Tu dois préparer ou annoncer “Pita toastée Thon”. Quels éléments principaux retenir avec le thon ?",
        ingredients.filter((ingredient) => !containsAnyText(ingredient, ["pita toastee"]))
      );
    }

    if (normalized.includes("pita toastee") && normalized.includes("dinde")) {
      return make(
        "Pita toastée Dinde",
        "Tu dois préparer ou annoncer “Pita toastée Dinde”. Quels éléments principaux retenir avec la dinde ?",
        ingredients.filter((ingredient) => !containsAnyText(ingredient, ["pita toastee", "dinde"]))
      );
    }

    if (normalized.includes("pita toastee") && normalized.includes("poulet")) {
      return make(
        "Pita toastée Poulet Curry",
        "Tu dois préparer ou annoncer “Pita toastée Poulet Curry”. Quels éléments principaux retenir en plus du poulet curry ?",
        ingredients.filter((ingredient) => !containsAnyText(ingredient, ["pita toastee", "poulet miel curry", "poulet"])))
      ;
    }

    if (normalized.includes("pita toastee") && (normalized.includes("mozza") || normalized.includes("mozzarella"))) {
      return make(
        "Pita toastée Mozza",
        "Tu dois préparer ou annoncer “Pita toastée Mozza”. Quels éléments principaux retenir en plus de la mozzarella ?",
        ingredients.filter((ingredient) => !containsAnyText(ingredient, ["pita toastee", "mozzarella"])))
      ;
    }

    if (normalized.includes("pita toastee") && normalized.includes("saumon")) {
      return make(
        "Pita toastée Saumon",
        "Tu dois préparer ou annoncer “Pita toastée Saumon”. Quels éléments principaux retenir avec le saumon ?",
        ingredients.filter((ingredient) => !containsAnyText(ingredient, ["pita toastee", "saumon fume"])))
      ;
    }

    const leakCount = ingredientLeakCount(item, ingredients);
    if (ingredients.length <= 4 && leakCount >= Math.max(2, ingredients.length - 1)) {
      return null;
    }

    return make(
      name,
      `Tu dois préparer ou annoncer “${name}”. Quels éléments principaux dois-tu retenir ?`,
      ingredients
    );
  }

  function buildDynamicQuestions(items, onlyWeak = false) {
    const source = onlyWeak ? items.filter((item) => getProgress(item.id) === "review") : items;
    const bank = [];
    const eligible = source.filter(isGoodCompositionQuizItem);

    eligible.forEach((item) => {
      const ingredients = compactIngredients(item, 8);

      if (ingredients.length >= 3) {
        const compositionQuiz = makeCompositionQuiz(item, ingredients);
        if (compositionQuiz && compositionQuiz.answer) {
          bank.push(question(
            `composition__${item.id}`,
            item.categoryLabel,
            "Composition",
            ingredients.length >= 6 ? "Difficile" : "Moyen",
            compositionQuiz.questionText,
            compositionQuiz.answer,
            item.id
          ));
        }
      }

      const traps = getTrapNotes(item).filter((note) => !containsAnyText(note, [
        "alcool rhum",
        "alcool tequila",
        "alcool gin",
        "rhum bacardi",
        "tequila camino",
        "gin bombay"
      ]));

      if (traps.length) {
        bank.push(question(
          `trap__${item.id}`,
          item.categoryLabel,
          "Point de vigilance",
          "Difficile",
          `À quoi faire attention avec “${cleanItemName(item.name)}” ?`,
          traps.join(" · "),
          item.id
        ));
      }

      const allergens = getRevisionAllergens(item);
      const hiddenAllergens = allergens.filter((allergen) => !hasObviousAllergenInName(item, [allergen]));
      const skipManualAllergen = containsAnyText(item.name, ["fish chips", "caesar au paradis", "banquise sauvage"]);

      if (!skipManualAllergen && hiddenAllergens.length >= 1 && allergens.length >= 2 && !containsAnyText(item.name, ["liste", "supplement", "parfums", "au choix"])) {
        bank.push(question(
          `allergens__${item.id}`,
          item.categoryLabel,
          "Vigilance allergènes",
          "Difficile",
          `Pour “${cleanItemName(item.name)}”, quelle vigilance allergène peut facilement être oubliée ?`,
          `${hiddenAllergens.join(" · ")}. Toujours confirmer avec la liste officielle et/ou la cuisine.`,
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
            `Quelle base alcoolisée dois-tu retenir pour “${cleanItemName(item.name)}” ?`,
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
        terms: ["gravlax"],
        q: "Où retrouve-t-on la sauce gravlax ?"
      },
      {
        id: "keyword__pistou",
        category: "Sauces",
        type: "Association",
        difficulty: "Moyen",
        terms: ["pistou"],
        q: "Dans quelles fiches dois-tu penser au pistou ?"
      },
      {
        id: "keyword__cheddar",
        category: "Fromage",
        type: "Association",
        difficulty: "Moyen",
        terms: ["cheddar"],
        q: "Sur quelles préparations le Cheddar apparaît-il ?"
      },
      {
        id: "keyword__sweet_chili",
        category: "Sauces",
        type: "Association",
        difficulty: "Difficile",
        terms: ["sweet chili"],
        q: "Quelle saveur d'assiette à composer est associée à la sauce sweet chili ?"
      },
      {
        id: "keyword__tom_yum",
        category: "Marmites",
        type: "Association",
        difficulty: "Difficile",
        terms: ["tom yum"],
        q: "Quelle marmite dois-tu associer à la sauce tom yum ?"
      },
      {
        id: "keyword__aneth",
        category: "Herbes",
        type: "Association",
        difficulty: "Moyen",
        terms: ["aneth"],
        q: "Quelles préparations sont liées à l'aneth ?"
      },
      {
        id: "keyword__chutney",
        category: "Condiments",
        type: "Association",
        difficulty: "Moyen",
        terms: ["chutney de tomates"],
        q: "Où retrouve-t-on le chutney de tomates ?"
      },
      {
        id: "keyword__spicy_mayo",
        category: "Sauces",
        type: "Association",
        difficulty: "Moyen",
        terms: ["spicy mayo"],
        q: "Sur quelles saveurs apparaît la sauce spicy mayo ?"
      },
      {
        id: "keyword__sauce_tartare",
        category: "Sauces",
        type: "Association",
        difficulty: "Moyen",
        terms: ["sauce tartare"],
        q: "Quelles fiches sont associées à la sauce tartare ?"
      },
      {
        id: "keyword__grana",
        category: "Fromage",
        type: "Association",
        difficulty: "Moyen",
        terms: ["grana padano"],
        q: "Dans quelles fiches retrouve-t-on le Grana Padano AOP ?"
      }
    ];

    return cases.map((entry) => {
      const matches = items
        .filter((item) => entry.terms.some((term) => has(item, term)))
        .filter((item) => !isUtilityQuizItem(item))
        .slice(0, 8);

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

    const bank = [...manual, ...keyword, ...dynamic].filter((entry) => {
      if (!entry || !entry.question || !entry.answer) return false;
      const q = normalizeText(entry.question);
      const a = normalizeText(entry.answer);
      if (!q || !a) return false;

      // Évite les questions inutiles où la réponse complète est déjà contenue dans l'énoncé.
      if (a.length > 18 && q.includes(a)) return false;

      return true;
    });

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
              <h2 class="h2">Teste tes connaissances</h2>
            </div>
          </div>
          <p class="muted">Le quiz mélange compositions, pièges, allergènes indicatifs, alcools, formules et reconnaissance d'ingrédients.</p>
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
        "Client : “Je suis végétarien, je veux un vrai plat, pas juste une salade.”",
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
        "Client : “Je veux du poisson ou fruits de mer.”",
        "🐟",
        "Moyen",
        "Réponse serveur : proposer thon, saumon, merlu, limande, crevettes, homard et sauces associées.",
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
        "Réponse serveur : expliquer simplement que c'est un accompagnement froid type salade de chou, carotte, pomme, citron, mayonnaise et raisins sec. Si le client parle d'allergie ou d'intolérance, on vérifie la fiche officielle.",
        [
          "Réponse simple : salade froide chou + carotte + citron + mayonnaise + raisins sec + pomme.",
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
        "Réponse serveur : proposer une logique en 4 choix clairs.\nCombo léger : Le Veggie + Mangue Énergie, frais et lisible.\nCombo rapide : Fish & Chips + Grand Soleil, simple à expliquer et efficace.\nCombo star : Goody Woody + Joséphine Baker et un magnifique dessert.\nCombo gourmand : Deli Mix / Paradis du paradis + Pink Spritz + Chocolat Mon Amour.",
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
