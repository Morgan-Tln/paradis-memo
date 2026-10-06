"use strict";

/*
 * js/core/ingredient-colors.js
 * Couleurs des pastilles d'ingrédients.
 */

function getIngredientStyle(name) {
  const lower = normalizeText(name);

  const style = (bg, color, border) =>
    `background:${bg};color:${color};border:1px solid ${border}`;

  if (lower.includes("pommes frites"))
    return style("#F4DDA1", "#7C5B0B", "#DFBE72");
  if (lower.includes("pomme de terre"))
    return style("#EFE0C4", "#775A27", "#D7BD8A");

  const rules = [
    // Fruits rouges / roses
    {
      keys: ["fraise senga", "fraises des bois"],
      css: style("#F8D9D7", "#9F2D3F", "#EDB3AE"),
    },
    {
      keys: ["fraise", "fraises"],
      css: style("#F7D7D3", "#A7333F", "#EBAFA8"),
    },
    {
      keys: ["framboise cranberry hibiscus", "framboise-cranberry-hibiscus"],
      css: style("#F2D4E4", "#9B2F61", "#E3A9C5"),
    },
    {
      keys: ["framboise", "framboises"],
      css: style("#F5D7E6", "#A8385F", "#E7B0CC"),
    },
    { keys: ["grenade"], css: style("#F4D6DC", "#8F2739", "#E4AEB8") },
    { keys: ["cranberry"], css: style("#F3D7E2", "#8E2F55", "#E2AFC2") },
    { keys: ["hibiscus"], css: style("#EED7EA", "#7E3A78", "#D8B0D2") },
    {
      keys: [
        "fruits rouges",
        "coulis de fruits",
        "coulis multi-fruits",
        "multi-fruits",
        "fruit de la passion",
      ],
      css: style("#F5DDE1", "#9A3448", "#E8B8C0"),
    },

    // Agrumes / fruits jaunes / orangés
    {
      keys: [
        "carottes jaunes et oranges",
        "brunoise de carottes",
        "julienne de carottes",
        "carotte",
        "carottes",
      ],
      css: style("#FBE1CE", "#B84A1A", "#EFBF9B"),
    },
    {
      keys: [
        "orange fraichement pressee",
        "orange ou pamplemousse",
        "orange",
      ],
      css: style("#F9D8BE", "#B94D18", "#EDB28C"),
    },
    {
      keys: ["clementine corse", "clémentine corse"],
      css: style("#FCE0B7", "#AD5A00", "#F0BE78"),
    },
    {
      keys: ["pamplemousse", "sirop de pamplemousse"],
      css: style("#F8D0C6", "#AC3F31", "#EAA497"),
    },
    { keys: ["citron vert"], css: style("#E8EDBD", "#60720F", "#D3DC86") },
    {
      keys: ["citron jaune", "citron confit", "citron presse", "citron"],
      css: style("#F9EDB2", "#846B05", "#E8D56F"),
    },
    {
      keys: ["ananas-verveine", "ananas verveine"],
      css: style("#F9E9B9", "#80690A", "#E8D98A"),
    },
    {
      keys: [
        "ananas poeles",
        "ananas frais",
        "decoupe d'ananas",
        "des d'ananas",
        "ananas",
      ],
      css: style("#F9E38E", "#7B6500", "#E6C852"),
    },
    {
      keys: ["banane caramelisee", "decoupe de banane", "banane"],
      css: style("#F8E8A4", "#806505", "#E7D06B"),
    },
    {
      keys: ["mangue alphonso", "puree de mangue", "mangue en des", "mangue"],
      css: style("#F9D693", "#9A5A00", "#EAB76A"),
    },
    { keys: ["abricot"], css: style("#F8CFA7", "#A85312", "#E8A977") },
    {
      keys: ["peche jaune", "pêche jaune"],
      css: style("#F8D7AD", "#9A5C12", "#E9B97F"),
    },
    {
      keys: ["melon jaune", "melon"],
      css: style("#F7E1A5", "#81660C", "#E5CC75"),
    },
    {
      keys: ["pasteque", "pastèque"],
      css: style("#F6CFCF", "#A5363B", "#E7A4A4"),
    },
    { keys: ["goyave"], css: style("#F6D3C9", "#A14535", "#E8A89A") },
    { keys: ["litchi"], css: style("#F7DEE5", "#8E3A55", "#E7B6C5") },
    { keys: ["myrtilles"], css: style("#E1DDF3", "#4B3C91", "#C7BFE9") },
    { keys: ["açai", "acai"], css: style("#E5D7F0", "#673A85", "#CDB2DF") },
    {
      keys: [
        "fruits de saison",
        "decoupe de fruits",
        "fruits prepares minute",
      ],
      css: style("#F3E6C9", "#745A18", "#E0C98D"),
    },

    // Fruits / légumes verts
    {
      keys: ["pomme bio", "pomme"],
      css: style("#DDEDCB", "#3F6F1D", "#BED9A2"),
    },
    { keys: ["kiwi"], css: style("#D9E9C7", "#4F6A1B", "#B9D394") },
    {
      keys: ["menthe fraiche", "feuilles de menthe", "menthe"],
      css: style("#D7E8D8", "#155C38", "#AFD0B6"),
    },
    { keys: ["basilic"], css: style("#DCEBD0", "#2F6B20", "#BBD8A7") },
    { keys: ["pistou"], css: style("#D5E8C9", "#27611E", "#ABD09A") },
    { keys: ["coriandre"], css: style("#D8EBD0", "#2D6E2D", "#B4D8A9") },
    { keys: ["persil"], css: style("#D9EAD3", "#28633A", "#B6D5B2") },
    { keys: ["ciboulette"], css: style("#DCEED5", "#356B33", "#BDDCB5") },
    {
      keys: ["herbes fraiches"],
      css: style("#DDEAD2", "#345F2A", "#BED8B2"),
    },
    {
      keys: ["avocat frais", "1/2 avocat", "demi avocat", "avocat"],
      css: style("#DCE6B7", "#506514", "#C4D28C"),
    },
    { keys: ["kale"], css: style("#D3E5CE", "#1F5E35", "#AACBA8") },
    {
      keys: ["epinard", "épinard", "pousses d'epinard"],
      css: style("#D8E8D3", "#285D36", "#B3D0AE"),
    },
    { keys: ["roquette"], css: style("#D7E6C9", "#3B641D", "#B5CF9D") },
    {
      keys: [
        "salade romaine",
        "meli-melo de salade",
        "mini salade",
        "mesclun",
        "salade",
      ],
      css: style("#E2ECCE", "#446A21", "#C4D5A2"),
    },
    { keys: ["concombre"], css: style("#DCEEDB", "#26714B", "#B9DBB8") },
    {
      keys: ["courgettes marinees", "courgette", "courgettes"],
      css: style("#DCE8C8", "#55711C", "#BDD2A0"),
    },
    { keys: ["haricots verts"], css: style("#D6E7C9", "#3C6622", "#B4D09F") },
    { keys: ["edamames"], css: style("#D7EBD0", "#2E6B2D", "#B4D7AA") },
    { keys: ["petits pois"], css: style("#DCEBC7", "#4D6D1E", "#BED69D") },
    { keys: ["plantes"], css: style("#E1EAD5", "#435D35", "#C5D5B7") },

    // Légumes / condiments
    {
      keys: [
        "tomates cerises mi-sechees",
        "tomates d'antan",
        "tomates multicolores",
        "chutney de tomates",
        "condiment tomate",
        "tomate",
        "tomates",
      ],
      css: style("#F5D6CE", "#A33D2C", "#E7A99B"),
    },
    {
      keys: ["poivron roti", "poivron", "poivrons"],
      css: style("#F6D9C8", "#A74721", "#E9AD91"),
    },
    { keys: ["aubergine"], css: style("#E7DBF0", "#68417A", "#CEB5DF") },
    { keys: ["mais", "maïs"], css: style("#F7E6A8", "#7F6408", "#E5CC70") },
    {
      keys: ["oignon rouge", "oignons rouges"],
      css: style("#EAD9EA", "#7B3E77", "#D4B1D4"),
    },
    { keys: ["oignons frits"], css: style("#F2DEC2", "#7D5422", "#DDBD92") },
    { keys: ["cornichons"], css: style("#DEE9C9", "#526820", "#C2D39B") },
    {
      keys: ["olives taggiasche"],
      css: style("#DFE2C6", "#5D6025", "#C6C992"),
    },
    {
      keys: ["coleslaw", "chou"],
      css: style("#EADFC8", "#6A5330", "#D2BF97"),
    },
    { keys: ["raisins"], css: style("#E8D9EF", "#673B75", "#CFB5DC") },
    {
      keys: ["celeri", "céleri", "tige de celeri"],
      css: style("#E1EBCF", "#4F6828", "#C4D6A4"),
    },
    { keys: ["gingembre"], css: style("#F2E2C5", "#805A1C", "#DBBF8D") },

    // Poissons / fruits de mer
    {
      keys: [
        "saumon fume",
        "tartinade de saumon",
        "brochettes de saumon",
        "saumon",
      ],
      css: style("#F6D7C9", "#B14D2E", "#E9AE98"),
    },
    {
      keys: ["tartinade de thon", "thon listao", "thon"],
      css: style("#E7EEF2", "#24566C", "#C4DAE4"),
    },
    {
      keys: ["merlu du cap", "dos de merlu", "merlu"],
      css: style("#DCEAF0", "#24536A", "#B8D4E0"),
    },
    { keys: ["limande"], css: style("#E0EDF2", "#2B5E72", "#BFDAE4") },
    {
      keys: ["crevettes panko", "crevettes"],
      css: style("#F5D7D2", "#A64234", "#E7ACA4"),
    },
    {
      keys: ["homard", "chair de homard"],
      css: style("#F4D3C8", "#A33B24", "#E4A798"),
    },
    { keys: ["poissons"], css: style("#DDECF2", "#27566E", "#BAD7E3") },

    // Viandes
    {
      keys: [
        "crispy de poulet",
        "poulet au citron",
        "poulet marine",
        "poulet miel",
        "brochettes de poulet",
        "cremeux de poulet",
        "poulet",
      ],
      css: style("#F3E0CC", "#7B4E23", "#E0BD94"),
    },
    {
      keys: [
        "chiffonnade de dinde fumee",
        "chiffonnade de dinde",
        "dinde fumee",
        "dinde",
      ],
      css: style("#EFE0D2", "#765031", "#D9BEA5"),
    },
    {
      keys: ["pastrami de boeuf", "pastrami", "boeuf", "bœuf"],
      css: style("#EAD7CE", "#78402D", "#D4AD9D"),
    },

    // Fromages / laitages
    {
      keys: ["cheddar fondu", "sauce cheddar", "cheddar"],
      css: style("#F6D58F", "#8A5500", "#E5B95E"),
    },
    {
      keys: ["mozzarella fior di latte", "mozzarella"],
      css: style("#F4ECD9", "#6F5A35", "#DDD0B0"),
    },
    { keys: ["burrata"], css: style("#F3ECD7", "#6A5B2E", "#DBD0A8") },
    { keys: ["feta"], css: style("#F1ECDC", "#5F6252", "#D8D1B7") },
    {
      keys: ["chevre", "chèvre"],
      css: style("#EFE7D8", "#665132", "#D8C6A8"),
    },
    { keys: ["cream cheese"], css: style("#EFE5EE", "#6F3F6F", "#D8C2D8") },
    {
      keys: [
        "creme liquide",
        "creme fraiche",
        "creme anglaise",
        "creme fouettee",
        "crème",
      ],
      css: style("#F3E7D9", "#765F40", "#DAC5AB"),
    },
    {
      keys: [
        "lait de coco",
        "lait chaud",
        "lait ou boisson vegetale",
        "base au lait",
        "lait",
      ],
      css: style("#EEE8F1", "#604C70", "#D6C6DF"),
    },
    {
      keys: ["yolita frozen yogurt", "frozen yogurt", "yolita", "yaourt"],
      css: style("#ECE3F1", "#6B3E72", "#D4BFE0"),
    },
    {
      keys: [
        "glace noix de coco",
        "noix de coco au lait de coco",
        "noix de coco",
      ],
      css: style("#EFEFE4", "#5E6148", "#D4D3BC"),
    },

    // Féculents / pains / céréales
    { keys: ["pommes frites"], css: style("#F4DDA1", "#7C5B0B", "#DFBE72") },
    {
      keys: ["pita toastee", "pita toastée", "pita"],
      css: style("#F0D6B5", "#76501F", "#D7AF7F"),
    },
    {
      keys: ["focaccia toastee", "focaccia au pistou", "focaccia"],
      css: style("#EED5B7", "#73511F", "#D5B184"),
    },
    {
      keys: ["blini chaud", "blini"],
      css: style("#EEDAB8", "#75541F", "#D7B987"),
    },
    {
      keys: ["toasts croustillants", "toast"],
      css: style("#EBD0AA", "#74511E", "#D3A976"),
    },
    {
      keys: ["pain au curcuma", "pain brioche", "pain"],
      css: style("#EED2AA", "#76501E", "#D5A975"),
    },
    { keys: ["brioche"], css: style("#EFCFA3", "#79511B", "#D9A96F") },
    {
      keys: ["croutons", "croûtons"],
      css: style("#EAD0A6", "#6F4D1B", "#D0A56E"),
    },
    { keys: ["gnocchis"], css: style("#EFE0C4", "#775A27", "#D7BD8A") },
    {
      keys: ["riz vapeur", "riz"],
      css: style("#F0E6CE", "#6F5D38", "#D9C7A0"),
    },
    { keys: ["quinoa"], css: style("#EAD9B6", "#735A22", "#D0B37A") },
    { keys: ["boulgour"], css: style("#E4D0A6", "#70531B", "#C8A86F") },
    { keys: ["muesli"], css: style("#E8D3AE", "#70511E", "#CFAE7A") },
    {
      keys: [
        "multigraines",
        "graines de sesame",
        "sésame",
        "sesame",
        "amandes coco crunch",
      ],
      css: style("#E8D7B7", "#765A27", "#CDB58A"),
    },
    {
      keys: ["gaufres", "gaufre"],
      css: style("#EECF9F", "#815316", "#D9A96D"),
    },
    { keys: ["pancakes"], css: style("#F0D5A8", "#7C551C", "#DAB177") },

    // Sauces / assaisonnements
    {
      keys: ["vinaigrette aux agrumes"],
      css: style("#F2DFA8", "#7A610A", "#DDC170"),
    },
    { keys: ["sauce caesar"], css: style("#E8DAC1", "#6C5630", "#D0B993") },
    { keys: ["sauce tartare"], css: style("#E7E4C9", "#5F6530", "#CCCAA0") },
    {
      keys: ["sauce thai", "sauce thaï"],
      css: style("#F0D9BF", "#8A4C1D", "#D9B08A"),
    },
    { keys: ["sauce tom yum"], css: style("#F4D2C7", "#A33E28", "#E3A396") },
    {
      keys: ["sauce spicy mayo"],
      css: style("#F5D5C3", "#A34A1E", "#E6A884"),
    },
    {
      keys: ["sauce sweet chili"],
      css: style("#F5D3C7", "#A23C27", "#E6A396"),
    },
    { keys: ["sauce gravlax"], css: style("#E7E3C4", "#68642D", "#CFC991") },
    {
      keys: ["mayonnaise homard", "mayonnaise"],
      css: style("#EFE0C2", "#755A28", "#D7BD89"),
    },
    {
      keys: ["moutarde au miel", "miel"],
      css: style("#F3DF9E", "#7C6308", "#DEC46B"),
    },
    { keys: ["sauce barbecue"], css: style("#EACFC0", "#7E3E23", "#D3A48F") },
    {
      keys: ["sucre en poudre", "sucree", "sucrée"],
      css: style("#EFE8D6", "#655A42", "#D7C9AA"),
    },
    { keys: ["american syrup"], css: style("#EAD0AC", "#7B4E19", "#D3A879") },

    // Chocolat / gourmandises
    {
      keys: [
        "chocolat noir guanaja",
        "glace chocolat",
        "chocolat chaud valrhona",
        "chocolat chaud",
        "chocolat",
      ],
      css: style("#E7D4C4", "#5C3320", "#CDAA92"),
    },
    { keys: ["nutella"], css: style("#E9D3C2", "#60361F", "#D0A78E") },
    {
      keys: ["sauce choco-noisette", "sauce choco-nutella"],
      css: style("#E5CDBB", "#5B321F", "#C99F86"),
    },
    {
      keys: ["caramelito", "carambar", "caramel"],
      css: style("#EBCDA4", "#80511A", "#D6A870"),
    },
    { keys: ["nougat"], css: style("#EEE2CA", "#735C35", "#D5C09A") },
    {
      keys: ["vanille de madagascar", "vanille"],
      css: style("#F1E6C9", "#725D2D", "#D9C694"),
    },
    {
      keys: ["pistache de sicile", "pistache crunch", "pistache"],
      css: style("#DCE8C5", "#566F22", "#BED29A"),
    },
    { keys: ["chamallows"], css: style("#F4DEE4", "#8B3F56", "#E1B5C3") },
    { keys: ["smarties"], css: style("#E3DDF2", "#51458B", "#C8BFE7") },
    {
      keys: [
        "fondant au chocolat sans gluten",
        "fondant choco",
        "gateau au chocolat",
      ],
      css: style("#E6D0BD", "#5A321E", "#C9A58D"),
    },
    {
      keys: ["tarte au citron"],
      css: style("#F5E6AA", "#7B620A", "#DDC573"),
    },
    {
      keys: ["tarte caramelisee"],
      css: style("#EBD0A8", "#7B501A", "#D3A877"),
    },
    { keys: ["cheesecake"], css: style("#EFE4CF", "#6F5730", "#D8C2A0") },
    { keys: ["meringue"], css: style("#F2E9D8", "#655945", "#D8CBB0") },
    {
      keys: ["p'tit chou", "chou xxl"],
      css: style("#E9D0B0", "#76501E", "#D0A778"),
    },
    { keys: ["esquimau"], css: style("#E8DFF0", "#5E4570", "#D0BEE0") },

    // Boissons chaudes / froides / alcool
    {
      keys: [
        "eau petillante san pellegrino",
        "eau minerale vittel",
        "eau petillante",
        "eau",
      ],
      css: style("#DCEAF2", "#25566D", "#B7D4E2"),
    },
    {
      keys: ["tonic", "touche d'amertume"],
      css: style("#E8E7C7", "#666628", "#CFCD92"),
    },
    {
      keys: ["thé vert glace", "the vert glace", "thé vert", "the vert"],
      css: style("#DCE9D0", "#3F682A", "#BED7AA"),
    },
    {
      keys: ["the noir", "thé noir", "thes noirs", "thés noirs"],
      css: style("#E4D6C7", "#5D4630", "#CBB19B"),
    },
    { keys: ["matcha"], css: style("#D8E6C3", "#516B22", "#B7CC91") },
    { keys: ["rooibos"], css: style("#ECD2BF", "#805034", "#D6A98D") },
    {
      keys: ["bergamote", "fleur d'oranger"],
      css: style("#F2DAB5", "#805511", "#DDBC82"),
    },
    {
      keys: ["infusion", "latte", "cappuccino", "cafe", "café", "expresso"],
      css: style("#E5D6C8", "#5C4532", "#CDB49D"),
    },
    {
      keys: ["gin bombay sapphire"],
      css: style("#D9E9EA", "#1F5D64", "#AED2D5"),
    },
    {
      keys: ["rhum bacardi carta oro"],
      css: style("#EBD0A4", "#835319", "#D4AA71"),
    },
    {
      keys: ["tequila camino real"],
      css: style("#EBD7A8", "#7E5A11", "#D4B875"),
    },
    { keys: ["aperol"], css: style("#F5CFB8", "#A54A16", "#E3A27E") },
    {
      keys: ["prosecco martini"],
      css: style("#F0E2A9", "#7B6410", "#D9C474"),
    },
    {
      keys: ["liqueur st-germain"],
      css: style("#E8DDF1", "#604479", "#CFBDE0"),
    },
    { keys: ["triple sec"], css: style("#F0DDB0", "#7C5B12", "#D8BF7E") },
    { keys: ["vin blanc"], css: style("#F0E7C8", "#725F22", "#D9CB97") },
    { keys: ["vin rouge"], css: style("#E7D0D7", "#783044", "#CFA7B3") },
    {
      keys: ["vin rose", "rosé"],
      css: style("#F2D2D3", "#934244", "#DEA8AA"),
    },
    {
      keys: ["biere ipa", "biere blonde", "bière", "ipa"],
      css: style("#EED59A", "#7E580A", "#D8B765"),
    },
    { keys: ["cidre"], css: style("#ECD8A3", "#795D0F", "#D5BC71") },
    { keys: ["sans alcool"], css: style("#DCE9EF", "#285B6D", "#B8D3DE") },

    // Formats / formules
    {
      keys: ["plateau geant", "8 saveurs"],
      css: style("#E8DCC8", "#685132", "#D0BB94"),
    },
    {
      keys: [
        "saveurs au choix",
        "saveur au choix",
        "parfums au choix",
        "parfum au choix",
        "toppings au choix",
        "accompagnement au choix",
      ],
      css: style("#E8E2CF", "#5F5A43", "#D1C7A6"),
    },
    {
      keys: ["a partager", "à partager"],
      css: style("#E9DCCB", "#6D5135", "#D0B999"),
    },
    {
      keys: ["cl", "1l", "5,8", "6°", "aop", "chapoutier"],
      css: style("#E4E2D4", "#52594A", "#CBC7B1"),
    },
  ];

  const match = rules.find((rule) =>
    rule.keys.some((key) => lower.includes(normalizeText(key))),
  );
  if (match) return match.css;

  const fallbackPalette = [
    style("#E6DFF0", "#574571", "#CCBFE1"),
    style("#F0DED2", "#724B35", "#D9BAA7"),
    style("#DFE9D2", "#455F2C", "#C0D4AA"),
    style("#F0E2C2", "#705823", "#D7BF88"),
    style("#DDE9ED", "#2E5967", "#BCD4DC"),
    style("#F1DADC", "#83424A", "#DDB2B8"),
    style("#E6E1CC", "#5B5F3D", "#CDC79E"),
    style("#E9DDC8", "#664F31", "#D0BA94"),
  ];

  let hash = 0;
  for (const char of lower) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return fallbackPalette[hash % fallbackPalette.length];
}
