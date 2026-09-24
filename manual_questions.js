(function () {
  "use strict";

  /*
   * ============================================================
   * BANQUE MANUELLE DU QUIZ
   * ============================================================
   *
   * 50 questions exactement.
   *
   * Ce fichier ne génère PAS automatiquement de questions.
   * Toutes les questions sont écrites à la main.
   *
   * app.js se chargera ensuite de :
   * - récupérer ces 50 questions
   * - les mélanger
   * - en sélectionner 40
   *
   * ============================================================
   */

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function findItem(items, terms) {
    const normalizedTerms = terms.map(normalize);

    return (
      items.find((item) => {
        const name = normalize(item.name);

        return normalizedTerms.some((term) => name.includes(term));
      }) || null
    );
  }

  function makeQuestion(
    qid,
    category,
    type,
    difficulty,
    questionText,
    answer,
    source,
  ) {
    return {
      id: source ? source.id : qid,
      qid,
      category,
      type,
      difficulty,
      question: questionText,
      answer,
    };
  }

  window.buildManualQuestions = function (items) {
    /*
     * ----------------------------------------------------------
     * Références vers les fiches de data.js
     * ----------------------------------------------------------
     */

    const refs = {
      thon: findItem(items, ["tartinade de thon au citron confit"]),
      pitaDinde: findItem(items, ["dinde fumee pomme et cheddar"]),
      pitaSaumon: findItem(items, ["saumon fume cream cheese et aneth"]),
      pitaChevre: findItem(items, ["cremeux de chevre miel noix"]),
      pitaPoulet: findItem(items, ["cremeux de poulet miel curry"]),
      pitaMozza: findItem(items, ["mozzarella fior di latte pistou poivron"]),

      avocadoVeggie: findItem(items, ["le veggie"]),
      avocadoSaumon: findItem(items, ["le saumon"]),

      bonheur: findItem(items, ["paradis bonheur"]),
      caesar: findItem(items, ["caesar au paradis"]),
      tutti: findItem(items, ["tutti salata"]),
      mamaSaumon: findItem(items, ["mama saumon"]),
      pistouPresto: findItem(items, ["pistou presto"]),

      goody: findItem(items, ["goody woody"]),
      cbon: findItem(items, ["c bon"]),
      banquise: findItem(items, ["banquise sauvage"]),
      deli: findItem(items, ["deli mix pastrami"]),

      fish: findItem(items, ["fish chips"]),
      pastramiBurger: findItem(items, ["pastrami burger"]),
      veggieBurger: findItem(items, ["veggie burger"]),
      lobster: findItem(items, ["sir homard lobster"]),

      dolce: findItem(items, ["dolce paradisio"]),
      citronBeldi: findItem(items, ["citron beldi"]),
      mamaCorail: findItem(items, ["mama corail"]),

      miniFish: findItem(items, ["mini fish chips limande"]),
      coleslaw: findItem(items, ["coleslaw"]),

      adam: findItem(items, ["adam eve"]),
      terrestre: findItem(items, ["paradis terrestre"]),
      celeste: findItem(items, ["paradis celeste"]),
      paradisParadis: findItem(items, ["paradis du paradis"]),

      pommeBio: findItem(items, ["double force"]),
      detox: findItem(items, ["veggie detox"]),

      vitamine: findItem(items, ["vitamine"]),
      rougeParfait: findItem(items, ["rouge parfait"]),
      yoyoCorail: findItem(items, ["yoyo corail"]),
      mangueEnergie: findItem(items, ["mangue energie"]),
      panthere: findItem(items, ["panthere rose"]),
      josephine: findItem(items, ["josephine baker"]),

      bulle: findItem(items, ["dans ta bulle"]),

      spritz: findItem(items, ["spritz original"]),
      hugo: findItem(items, ["hugo spritz"]),
      margarita: findItem(items, ["margarita originale"]),
      mojito: findItem(items, ["mojito 27cl"]),
      pina: findItem(items, ["pina colada originale"]),
      basilic: findItem(items, ["basilic instinct"]),

      fondant: findItem(items, ["fondant coeur coulant"]),
      mangueDessert: findItem(items, ["ma jolie mangue"]),
      acai: findItem(items, ["acai bowl paradisiaque"]),
      ileMeringuee: findItem(items, ["ile meringuee"]),
      tatin: findItem(items, ["ta tatin"]),
      cheesecake: findItem(items, ["new york cheesecake"]),
    };

    return [
      /*
       * ========================================================
       * 01 → 10
       * PIÈGES / ALLERGÈNES / CONNAISSANCE CARTE
       * ========================================================
       */

      makeQuestion(
        "manual__01",
        "Pièges carte",
        "Comparaison",
        "Difficile",
        "Deux versions de Fish & Chips existent sur la carte. Quelle différence essentielle dois-tu connaître ?",
        "Le Fish & Chips en plat utilise du merlu du Cap croustillant avec pommes frites, mesclun et sauce tartare. La saveur Mini Fish & Chips utilise de la limande avec sauce tartare.",
        refs.fish,
      ),

      makeQuestion(
        "manual__02",
        "Pièges carte",
        "Composition",
        "Difficile",
        "Un client commande la Tartinade de thon au citron confit. Quels éléments dois-tu pouvoir restituer ?",
        "Pita toastée, thon Listao, citron confit, céleri et poivron.",
        refs.thon,
      ),

      makeQuestion(
        "manual__03",
        "Allergènes",
        "Vigilance",
        "Difficile",
        "Pourquoi la Tartinade de thon mérite-t-elle une vigilance particulière pour un client allergique au céleri ?",
        "Parce que la recette contient explicitement du céleri, en plus du thon Listao, du citron confit et du poivron.",
        refs.thon,
      ),

      makeQuestion(
        "manual__04",
        "Salades",
        "Composition",
        "Difficile",
        "Restitue les éléments spécifiques de la Caesar au Paradis en plus du méli-mélo de salade.",
        "Crispy de poulet, œuf dur, croûtons de focaccia, Grana Padano AOP et sauce Caesar.",
        refs.caesar,
      ),

      makeQuestion(
        "manual__05",
        "Allergènes",
        "Vigilance sauce",
        "Difficile",
        "Dans une Caesar, quel allergène moins évident doit inciter à vérifier précisément la sauce ?",
        "Le poisson peut être présent via l'anchois dans une sauce Caesar. En situation réelle d'allergie, il faut toujours vérifier la fiche allergènes officielle.",
        refs.caesar,
      ),

      makeQuestion(
        "manual__06",
        "Chaud le Toast",
        "Composition",
        "Difficile",
        "Quelle est la composition principale de la Banquise Sauvage ?",
        "Toasts croustillants, tartinade de saumon à l'aneth, saumon fumé, pousses d'épinard, œuf poché et pommes frites.",
        refs.banquise,
      ),

      makeQuestion(
        "manual__07",
        "Chaud le Toast",
        "Comparaison",
        "Difficile",
        "Quelle différence majeure permet de distinguer C'Bon de Goody Woody ?",
        "C'Bon est construit autour de la tartinade de thon, mozzarella, pistou, courgette et poivron rôti. Goody Woody est construit autour du crémeux de poulet miel & curry avec épinard, tomates mi-séchées, poivrons, maïs et cheddar.",
        refs.cbon,
      ),

      makeQuestion(
        "manual__08",
        "Street Paradis",
        "Composition",
        "Difficile",
        "Quels éléments composent le Pastrami Burger ?",
        "Pain au curcuma et aux graines, pastrami de bœuf aux épices douces, sauce cheddar, tomate, oignon rouge, mesclun, sauce tartare, sauce barbecue et pommes frites.",
        refs.pastramiBurger,
      ),

      makeQuestion(
        "manual__09",
        "Street Paradis",
        "Composition",
        "Difficile",
        "Quels éléments différencient le Veggie Burger d'un burger classique à la viande ?",
        "Il contient une galette de petits pois avec tomate, salade romaine, cheddar, avocat, oignon rouge et sauce tartare, dans un pain au curcuma et aux graines, avec pommes frites.",
        refs.veggieBurger,
      ),

      makeQuestion(
        "manual__10",
        "Street Paradis",
        "Composition",
        "Très difficile",
        "Restitue la composition du Sir Homard Lobster.",
        "Pain brioché, chair de homard américain, poissons, coleslaw, avocat, pousses d'épinard, mayonnaise homard et pommes frites.",
        refs.lobster,
      ),

      /*
       * ========================================================
       * 11 → 20
       * PITAS / AVOCADO / SALADES
       * ========================================================
       */

      makeQuestion(
        "manual__11",
        "Pitas",
        "Composition",
        "Moyen",
        "Que contient la pita Dinde fumée, pomme et Cheddar fondu ?",
        "Pita toastée, chiffonnade de dinde fumée, pomme et cheddar fondu.",
        refs.pitaDinde,
      ),

      makeQuestion(
        "manual__12",
        "Pitas",
        "Composition",
        "Moyen",
        "Que faut-il retenir de la pita Saumon fumé, Cream Cheese et aneth ?",
        "Pita toastée, saumon fumé, Cream Cheese et aneth.",
        refs.pitaSaumon,
      ),

      makeQuestion(
        "manual__13",
        "Pitas",
        "Composition",
        "Moyen",
        "Quels sont les quatre éléments caractéristiques de la pita au chèvre en plus de la pita toastée ?",
        "Crémeux de chèvre, miel, noix et pousses d'épinard.",
        refs.pitaChevre,
      ),

      makeQuestion(
        "manual__14",
        "Pitas",
        "Composition",
        "Moyen",
        "Quels éléments accompagnent le crémeux de poulet miel & curry dans sa pita ?",
        "Poivrons et cheddar fondu, dans une pita toastée.",
        refs.pitaPoulet,
      ),

      makeQuestion(
        "manual__15",
        "Pitas",
        "Composition",
        "Difficile",
        "Restitue la pita Mozzarella Fior di Latte, pistou et poivron rôti.",
        "Pita toastée, Mozzarella Fior di Latte, pistou, poivron rôti, roquette et chutney de tomates.",
        refs.pitaMozza,
      ),

      makeQuestion(
        "manual__16",
        "Avocado Toast",
        "Composition",
        "Difficile",
        "Que contient l'Avocado Toast Le Veggie ?",
        "Double tartines de focaccia, avocat frais en tranches, 2 œufs pochés, feta, grenade, multigraines, mesclun de salades et vinaigrette aux agrumes.",
        refs.avocadoVeggie,
      ),

      makeQuestion(
        "manual__17",
        "Avocado Toast",
        "Comparaison",
        "Difficile",
        "Qu'est-ce qui caractérise l'Avocado Toast Le Saumon par rapport au Veggie ?",
        "Le Saumon associe focaccia, avocat, courgettes marinées, Cream Cheese à l'aneth et saumon fumé. Le Veggie contient notamment œufs pochés, feta, grenade et multigraines.",
        refs.avocadoSaumon,
      ),

      makeQuestion(
        "manual__18",
        "Salades",
        "Composition",
        "Difficile",
        "Quels éléments donnent son profil exotique au Paradis Bonheur ?",
        "Poulet mariné aux 4 épices, ananas, sésame, oignons frits, menthe et sauce thaï, sur la base méli-mélo.",
        refs.bonheur,
      ),

      makeQuestion(
        "manual__19",
        "Salades",
        "Composition",
        "Très difficile",
        "Quels fruits trouve-t-on dans la Tutti Salata et quel fromage les accompagne ?",
        "Melon, pastèque, ananas, fruit de la passion et grenade. Ils sont accompagnés de feta marinée et de vinaigrette aux agrumes.",
        refs.tutti,
      ),

      makeQuestion(
        "manual__20",
        "Salades",
        "Comparaison",
        "Difficile",
        "Comment distinguer Mama Saumon de Pistou Presto ?",
        "Mama Saumon contient 2 brochettes de saumon, ananas, grenade et sauce gravlax. Pistou Presto contient burrata, tomates d'antan, courgettes marinées, pistou et focaccia.",
        refs.mamaSaumon,
      ),

      /*
       * ========================================================
       * 21 → 30
       * MARMITES / ASSIETTES À COMPOSER / SERVICE
       * ========================================================
       */

      makeQuestion(
        "manual__21",
        "Marmites",
        "Composition",
        "Très difficile",
        "Quels éléments principaux composent Dolce Paradisio ?",
        "Gnocchis de pomme de terre, chutney de tomates, crème liquide, Mozzarella Fior di Latte, carottes, courgettes, tomates cerises mi-séchées, Grana Padano AOP, olives Taggiasche, mesclun et vinaigrette aux agrumes.",
        refs.dolce,
      ),

      makeQuestion(
        "manual__22",
        "Marmites",
        "Composition",
        "Très difficile",
        "Restitue les éléments caractéristiques de Citron Beldi.",
        "Poulet au citron confit, poivron, aubergine, courgette, olives Taggiasche, amandes effilées, persil, quinoa & boulgour à la menthe fraîche et sauce thaï.",
        refs.citronBeldi,
      ),

      makeQuestion(
        "manual__23",
        "Marmites",
        "Composition",
        "Très difficile",
        "Que contient Mama Corail ?",
        "Dos de merlu, crevettes, sauce tom yum, ananas poêlés, haricots verts, carottes jaunes et oranges, courgette, amandes effilées et riz vapeur aux petits légumes.",
        refs.mamaCorail,
      ),

      makeQuestion(
        "manual__24",
        "Marmites",
        "Comparaison",
        "Difficile",
        "Un client hésite entre Citron Beldi et Mama Corail. Quelle différence centrale peux-tu lui expliquer ?",
        "Citron Beldi est centré sur le poulet au citron confit avec légumes, olives, amandes et quinoa-boulgour. Mama Corail est une marmite de la mer avec merlu et crevettes, sauce tom yum, ananas poêlé et riz vapeur.",
        refs.citronBeldi,
      ),

      makeQuestion(
        "manual__25",
        "Assiettes à composer",
        "Formules",
        "Facile",
        "Combien de saveurs et d'accompagnements comporte Adam & Eve ?",
        "Adam & Eve = 2 saveurs + 1 accompagnement.",
        refs.adam,
      ),

      makeQuestion(
        "manual__26",
        "Assiettes à composer",
        "Formules",
        "Facile",
        "Combien de saveurs comporte Paradis Terrestre ?",
        "Paradis Terrestre = 3 saveurs + 1 accompagnement.",
        refs.terrestre,
      ),

      makeQuestion(
        "manual__27",
        "Assiettes à composer",
        "Formules",
        "Facile",
        "Combien de saveurs comporte Paradis Céleste ?",
        "Paradis Céleste = 4 saveurs + 1 accompagnement.",
        refs.celeste,
      ),

      makeQuestion(
        "manual__28",
        "Assiettes à composer",
        "Formules",
        "Moyen",
        "Quelle est la particularité du Paradis du Paradis ?",
        "Il comprend 8 saveurs avec frites et coleslaw et est présenté comme idéal pour 2 personnes.",
        refs.paradisParadis,
      ),

      makeQuestion(
        "manual__29",
        "Assiettes à composer",
        "Comparaison",
        "Moyen",
        "Résume les quatre formats d'assiettes à composer du plus petit au plus grand.",
        "Adam & Eve : 2 saveurs + 1 accompagnement. Paradis Terrestre : 3 + 1. Paradis Céleste : 4 + 1. Paradis du Paradis : 8 saveurs avec frites et coleslaw, idéal pour 2.",
        refs.paradisParadis,
      ),

      makeQuestion(
        "manual__30",
        "Service client",
        "Vigilance",
        "Difficile",
        "Pourquoi faut-il être prudent lorsqu'un client demande simplement « quelque chose de vegan » ?",
        "Parce que végétarien ne signifie pas vegan. Plusieurs recettes peuvent contenir œuf, fromage, crème, miel ou sauces non vegan. Il faut vérifier précisément la composition avant de confirmer.",
        refs.veggieBurger,
      ),

      /*
       * ========================================================
       * 31 → 40
       * BOISSONS / JUS / COCKTAILS SANS ALCOOL
       * ========================================================
       */

      makeQuestion(
        "manual__31",
        "Boissons",
        "Composition",
        "Moyen",
        "Quelle est la composition du Vitaminé ?",
        "Citron, orange, pamplemousse et kiwi.",
        refs.vitamine,
      ),

      makeQuestion(
        "manual__32",
        "Boissons",
        "Composition",
        "Facile",
        "Quels trois fruits composent le Rouge Parfait ?",
        "Framboise, fraise et ananas.",
        refs.rougeParfait,
      ),

      makeQuestion(
        "manual__33",
        "Boissons",
        "Piège",
        "Moyen",
        "Quel ingrédient distingue Yoyo Corail d'un simple cocktail de fruits ?",
        "Le Yolita, une glace goût yaourt. Le cocktail contient aussi banane, mangue et fraise.",
        refs.yoyoCorail,
      ),

      makeQuestion(
        "manual__34",
        "Boissons",
        "Composition",
        "Moyen",
        "Que contient Mangue Énergie ?",
        "Mangue, clémentine corse et citron vert.",
        refs.mangueEnergie,
      ),

      makeQuestion(
        "manual__35",
        "Boissons",
        "Composition",
        "Moyen",
        "Quels fruits composent La Panthère Rose ?",
        "Framboise, litchi et grenade.",
        refs.panthere,
      ),

      makeQuestion(
        "manual__36",
        "Boissons",
        "Composition",
        "Moyen",
        "Quelle est la composition de Joséphine Baker ?",
        "Fruit de la passion, mangue et noix de coco.",
        refs.josephine,
      ),

      makeQuestion(
        "manual__37",
        "Boissons",
        "Explication client",
        "Difficile",
        "Comment expliquer simplement « Dans ta Bulle XXL » à un client ?",
        "C'est une boisson XXL de 45 cl à base de tonic avec une touche d'amertume. Plusieurs déclinaisons existent, notamment citron jaune, concombre, orange fraîchement pressée, ananas-verveine et framboise-cranberry-hibiscus.",
        refs.bulle,
      ),

      makeQuestion(
        "manual__38",
        "Boissons",
        "Piège composition",
        "Difficile",
        "Pourquoi ne faut-il pas présenter automatiquement Veggie Detox comme une boisson totalement sans sucre ?",
        "Parce qu'il contient du jus d'aloe vera avec présence de sucre. Sa composition comprend concombre, kale, menthe et jus d'aloe vera.",
        refs.detox,
      ),

      makeQuestion(
        "manual__39",
        "Boissons",
        "Service",
        "Difficile",
        "Quel détail de service accompagne plusieurs jus construits autour de la pomme Bio ?",
        "Une tige de céleri accompagne plusieurs de ces jus. Il faut donc être vigilant notamment lorsqu'un client signale une allergie au céleri.",
        refs.pommeBio,
      ),

      makeQuestion(
        "manual__40",
        "Boissons",
        "Comparaison",
        "Difficile",
        "Un client veut quelque chose de très tropical sans alcool. Entre Joséphine Baker et Mangue Énergie, comment les distinguer ?",
        "Joséphine Baker est passion, mangue et noix de coco, donc plus tropicale et ronde. Mangue Énergie associe mangue, clémentine corse et citron vert, avec un profil davantage agrume.",
        refs.josephine,
      ),

      /*
       * ========================================================
       * 41 → 45
       * MIXOLOGIE
       * ========================================================
       */

      makeQuestion(
        "manual__41",
        "Mixologie",
        "Alcools",
        "Difficile",
        "Quelle base alcoolisée faut-il associer à la Margarita ?",
        "La Margarita est construite autour de la tequila. Sur la carte, la base indiquée est la tequila Camino Real.",
        refs.margarita,
      ),

      makeQuestion(
        "manual__42",
        "Mixologie",
        "Alcools",
        "Difficile",
        "Quelle famille d'alcool faut-il associer au Mojito et à la Pina Colada ?",
        "Le rhum. Les recettes de la carte utilisent notamment le Bacardi Carta Oro.",
        refs.mojito,
      ),

      makeQuestion(
        "manual__43",
        "Mixologie",
        "Comparaison",
        "Très difficile",
        "Quelle différence de base alcoolisée faut-il retenir entre un Spritz Original et un Hugo Spritz ?",
        "Le Spritz Original repose sur Apérol et Prosecco. Le Hugo Spritz utilise St-Germain et Prosecco.",
        refs.hugo,
      ),

      makeQuestion(
        "manual__44",
        "Mixologie",
        "Alcools",
        "Difficile",
        "Quel alcool faut-il associer au Basilic Instinct ?",
        "Le gin Bombay Sapphire.",
        refs.basilic,
      ),

      makeQuestion(
        "manual__45",
        "Mixologie",
        "Conseil client",
        "Très difficile",
        "Un client demande un cocktail alcoolisé et fruité. Cite plusieurs propositions cohérentes de la carte.",
        "Par exemple : Pink Spritz, Passion Spritz, Hugo Spritz, Mojito Fruit, Pina Colada La Fragola, Margarita Mangue, Danse Joséphine ou Daiquiri Passion & Framboise.",
        refs.hugo,
      ),

      /*
       * ========================================================
       * 46 → 50
       * DESSERTS
       * ========================================================
       */

      makeQuestion(
        "manual__46",
        "Desserts",
        "Composition",
        "Moyen",
        "Que contient le Fondant Cœur Coulant et quelle particularité est indiquée sur sa fiche ?",
        "Fondant au chocolat sans gluten, crème anglaise et crème fouettée. La fiche l'indique naturellement sans gluten.",
        refs.fondant,
      ),

      makeQuestion(
        "manual__47",
        "Desserts",
        "Composition",
        "Moyen",
        "Que contient Ma Jolie Mangue ?",
        "Mangue en dés, pulpe de passion et sorbet mangue Alphonso d'Inde.",
        refs.mangueDessert,
      ),

      makeQuestion(
        "manual__48",
        "Desserts",
        "Piège composition",
        "Difficile",
        "Pourquoi l'Açaï Bowl Paradisiaque n'est-il pas simplement un bol de fruits et d'açaï ?",
        "Parce qu'il contient aussi du yaourt et du muesli croustillant, en plus de l'açaï, fraises, framboises, myrtilles et banane.",
        refs.acai,
      ),

      makeQuestion(
        "manual__49",
        "Desserts",
        "Composition",
        "Difficile",
        "Quels sont les trois éléments de l'Île Meringuée ?",
        "Tarte au citron, meringue à l'italienne et cœur glacé framboise-passion.",
        refs.ileMeringuee,
      ),

      makeQuestion(
        "manual__50",
        "Desserts",
        "Comparaison",
        "Très difficile",
        "Un client hésite entre Ta-Tatin et New York Cheesecake. Comment distinguer précisément les deux desserts ?",
        "Ta-Tatin : tarte caramélisée aux pommes, crème fraîche et sauce caramel-vanille Paradis. New York Cheesecake : cheesecake, purée de mangue, sauce caramel-vanille Paradis et crème fouettée.",
        refs.cheesecake,
      ),
    ];
  };
})();
