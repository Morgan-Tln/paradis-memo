(function () {
  "use strict";

  /*
   * ============================================================
   * BANQUE DU QUIZZ EN QCM : 4 CATÉGORIES × 40 QUESTIONS
   * ============================================================
   *
   * Questions écrites à la main à partir de data/menu.js et data/allergens.js.
   *
   * Format :
   *   q("Thème", "Question", "Bonne réponse", ["Piège 1", "Piège 2", "Piège 3"], "fiche liée")
   *
   * - Les 4 réponses sont mélangées à chaque partie.
   * - La fiche liée (optionnelle) est un morceau du nom de la fiche dans
   *   data/menu.js : répondre juste ou faux met aussi à jour le statut de la carte.
   * - La console (F12) signale une catégorie qui n'a pas 40 questions,
   *   une question sans 3 pièges, ou une fiche liée introuvable.
   * ============================================================
   */

  function q(theme, question, good, bad, ref) {
    return { theme, question, good, bad: bad || [], ref: ref || "" };
  }

  window.QUIZ_CATEGORIES = [
    /* ==========================================================
     * SALLE
     * ========================================================== */
    {
      key: "salle",
      label: "Salle",
      emoji: "🛎️",
      hue: 212,
      description: "Formules, saveurs, conseil client et allergènes",
      questions: [
        q("Formules", "Que comprend la formule Adam & Eve ?", "2 saveurs + 1 accompagnement", ["3 saveurs + 1 accompagnement", "2 saveurs + 2 accompagnements", "1 saveur + 1 accompagnement"], "adam eve"),
        q("Formules", "Que comprend la formule Paradis Terrestre ?", "3 saveurs + 1 accompagnement", ["2 saveurs + 1 accompagnement", "4 saveurs + 1 accompagnement", "3 saveurs + 2 accompagnements"], "paradis terrestre"),
        q("Formules", "Que comprend la formule Paradis Céleste ?", "4 saveurs + 1 accompagnement", ["3 saveurs + 1 accompagnement", "5 saveurs + 1 accompagnement", "4 saveurs + 2 accompagnements"], "paradis celeste"),
        q("Formules", "Qu'est-ce que le Paradis du Paradis ?", "8 saveurs, pommes frites et coleslaw, idéal pour 2", ["6 saveurs, frites et mesclun, idéal pour 2", "8 saveurs et 2 accompagnements au choix, pour 4", "10 saveurs, frites et coleslaw, pour 3"], "paradis du paradis"),
        q("Formules", "Quand la formule midi est-elle disponible ?", "De 11h30 à 15h, du lundi au vendredi, hors jours fériés", ["De 12h à 14h30, du lundi au samedi", "De 11h30 à 15h, 7 jours sur 7", "De 11h à 16h, du lundi au vendredi, jours fériés compris"], "formule midi"),
        q("Formules", "Quelle boisson est comprise dans la formule midi ?", "Une Dans ta Bulle 45 cl", ["Un pressé Grand Soleil 40 cl", "Un Cocktail Star 35 cl", "Une eau Vittel 50 cl"], "formule midi"),
        q("Accompagnements", "Quel est l'accompagnement n°5 ?", "Haricots verts croustillants cajun", ["Coleslaw", "Quinoa & boulgour à la menthe fraîche", "Riz vapeur aux petits légumes"], "liste des accompagnements"),
        q("Accompagnements", "Quel est l'accompagnement n°2 ?", "Riz vapeur aux petits légumes", ["Pommes frites", "Mesclun et vinaigrette aux agrumes", "Coleslaw"], "liste des accompagnements"),
        q("Accompagnements", "Un client veut l'accompagnement le plus léger. Que proposes-tu ?", "Le 4 : mesclun et vinaigrette aux agrumes", ["Le 3 : coleslaw", "Le 5 : haricots verts cajun", "Le 1 : pommes frites"], "mesclun et vinaigrette"),
        q("Accompagnements", "Quel accompagnement contient du boulgour ?", "Quinoa & boulgour à la menthe fraîche", ["Mesclun et vinaigrette aux agrumes", "Riz vapeur aux petits légumes", "Coleslaw"], "quinoa"),
        q("Accompagnements", "Quelle option gourmande peux-tu proposer avec les pommes frites ?", "Une sauce cheddar", ["Une sauce tartare", "Une mayonnaise à la truffe", "Une sauce barbecue"], "1 pommes frites"),
        q("Pièges", "Quel poisson est utilisé dans la saveur 17, Mini Fish & Chips ?", "Limande", ["Merlu du Cap", "Cabillaud", "Saumon"], "mini fish chips"),
        q("Pitas", "Comment fonctionne la Planche de 3 Pitas ?", "3 pitas au choix parmi les recettes Bonjour Paradis", ["3 pitas imposées par la cuisine", "3 mini pitas des saveurs", "3 pitas et 1 accompagnement au choix"], "planche de 3 pitas"),
        q("Allergènes", "Lequel de ces plats contient du céleri (fiche officielle) ?", "C'Bon", ["Goody Woody", "Pastrami Burger", "Dolce Paradisio"], "c bon"),
        q("Allergènes", "Lequel de ces plats contient des crustacés (fiche officielle) ?", "Mama Corail", ["Citron Beldi", "Mama Saumon", "Fish & Chips"], "mama corail"),
        q("Allergènes", "Lequel de ces plats n'a pas de gluten sur sa fiche officielle ?", "Mama Corail", ["Citron Beldi", "Dolce Paradisio", "Pistou Presto"], "mama corail"),
        q("Allergènes", "Quel allergène peu évident contient la Caesar au Paradis ?", "Poisson", ["Crustacés", "Fruits à coque", "Céleri"], "caesar au paradis"),
        q("Allergènes", "Lequel de ces plats contient des fruits à coque (fiche officielle) ?", "Citron Beldi", ["Dolce Paradisio", "Paradis Bonheur", "Goody Woody"], "citron beldi"),
        q("Allergènes", "Lequel de ces plats contient du sésame (fiche officielle) ?", "Paradis Bonheur", ["Caesar au Paradis", "Tutti Salata", "Pistou Presto"], "paradis bonheur"),
        q("Allergènes", "Combien d'allergènes compte la fiche du Sir Homard Lobster ?", "9", ["6", "7", "11"], "sir homard lobster"),
        q("Allergènes", "Quel dessert est indiqué sans gluten sur la carte ?", "Fondant Cœur Coulant", ["Ta-Tatin", "New York Cheesecake", "Île Meringuée"], "fondant coeur coulant"),
        q("Conseil client", "Un client demande un plat vegan. Quelle est la bonne réaction ?", "Vérifier la composition : végétarien ne veut pas dire vegan", ["Proposer le Veggie Burger, il est vegan", "Proposer n'importe quelle salade", "Dire que tous les plats sans viande sont vegan"]),
        q("Conseil client", "Lequel de ces plats ne contient ni viande ni poisson ?", "Pistou Presto", ["Caesar au Paradis", "Paradis Bonheur", "Mama Saumon"], "pistou presto"),
        q("Conseil client", "Quelle option est proposée sur la Banquise Sauvage ?", "Saumon fumé en plus, encore meilleur avec avocat", ["Double pastrami", "Sauce cheddar en plus", "Œuf poché supplémentaire"], "banquise sauvage"),
        q("Conseil client", "Quelle option est proposée sur le Deli Mix Pastrami ?", "Double pastrami", ["Sauce cheddar en plus", "Saumon fumé en plus", "Avocat en plus"], "deli mix pastrami"),
        q("Street Paradis", "Avec quoi sont servis tous les plats Street Paradis ?", "Des pommes frites", ["Du riz vapeur", "Du coleslaw", "Uniquement du mesclun"]),
        q("Brunch", "Que comprend le Super All Day Brunch ?", "Brouillade d'œufs + pancakes minute", ["Brouillade d'œufs + découpe d'ananas", "Pancakes minute + gaufre", "Avocado toast + pancakes minute"], "super all day brunch"),
        q("Brunch", "Avec quoi peut-on accompagner la brouillade d'œufs du brunch ?", "Saumon fumé, pastrami ou avocat", ["Bacon, saumon ou avocat", "Jambon, pastrami ou feta", "Saumon fumé, thon ou cheddar"], "brouillade"),
        q("Brunch", "Que comprennent les pancakes minute du brunch ?", "2 pancakes, sauce choco-Nutella et American Syrup", ["3 pancakes, sirop d'érable et crème fouettée", "2 pancakes, caramel-vanille et banane", "3 pancakes, Nutella et fruits rouges"], "pancakes minute du paradis"),
        q("Brunch", "Quel jus est proposé au brunch ?", "Orange ou pamplemousse pressé, 27 cl", ["Orange ou pomme pressée, 25 cl", "Orange pressée uniquement, 40 cl", "Pamplemousse ou citron pressé, 27 cl"], "jus d orange"),
        q("Desserts", "Un groupe veut un dessert à partager. Que proposes-tu ?", "Gaufres Géantes à partager", ["Nutella Lover", "Ta-Tatin", "Igloo"], "gaufres geantes"),
        q("Desserts", "Que contient le Café ou Thé Gourmand Light ?", "Dés d'ananas, dés de kiwi et Yolita", ["Fondant choco, crème de nougat et glace", "Salade de fruits et sorbet", "Dés de mangue, fraises et Yolita"], "cafe ou the gourmand light"),
        q("Desserts", "Qu'est-ce que le Yolita d'Amour ?", "Un frozen yogurt à composer avec 2 toppings", ["Une glace vanille avec 3 toppings", "Un yaourt nature avec du miel", "Un sorbet aux fruits avec 1 topping"], "la mome"),
        q("Desserts", "Quel topping Yolita est facturé avec un supplément ?", "Framboise", ["Mangue", "Muesli croustillant", "Miel"], "toppings yolita"),
        q("Desserts", "Que contient l'Igloo ?", "Esquimau vanille ou coco, coque au chocolat au lait, Smarties", ["Glace vanille, chantilly, Smarties", "Esquimau chocolat, coque caramel, M&M's", "Sorbet fraise, coque chocolat blanc, Smarties"], "igloo"),
        q("Saveurs", "Quelle saveur contient de la truffe ?", "La 7 : œufs durs, mayonnaise à la truffe d'été", ["La 1 : camembert croustillant", "La 12 : mini salade Caesar", "La 19 : saumon fumé, sauce à l'aneth"], "7 oeufs durs"),
        q("Saveurs", "Laquelle de ces saveurs est servie avec un blini chaud ?", "La 4 : tartinade de saumon à l'aneth", ["La 3 : crémeux de poulet miel & curry", "La 15 : demi avocat", "La 22 : brochettes de saumon au sésame"], "4 tartinade de saumon"),
        q("Saveurs", "Avec quelle sauce sont servies les crevettes panko (saveur 20) ?", "Sweet chili", ["Spicy mayo", "Tartare", "Gravlax"], "crevettes panko"),
        q("Saveurs", "Quelle saveur est servie avec une sauce spicy mayo ?", "La 8 : crispy de poulet aux céréales", ["La 17 : Mini Fish & Chips", "La 22 : brochettes de saumon", "La 20 : crevettes panko"], "crispy de poulet aux cereales"),
        q("Saveurs", "Quelle saveur est fraîche, idéale pour l'été ?", "La 13 : pastèque, feta marinée, menthe", ["La 1 : camembert croustillant", "La 8 : crispy de poulet", "La 11 : brochettes de poulet"], "pasteque"),
      ],
    },

    /* ==========================================================
     * BAR
     * ========================================================== */
    {
      key: "bar",
      label: "Bar",
      emoji: "🍹",
      hue: 268,
      description: "Pressés, cocktails, alcools et coffee shop",
      questions: [
        q("Cocktails Stars", "Quelle est la composition du Vitaminé ?", "Citron, orange, pamplemousse, kiwi", ["Citron, orange, mangue, kiwi", "Orange, pamplemousse, fraise, kiwi", "Citron vert, orange, pamplemousse, ananas"], "vitamine"),
        q("Cocktails Stars", "Quels fruits composent le Rouge Parfait ?", "Framboise, fraise, ananas", ["Framboise, fraise, banane", "Fraise, grenade, ananas", "Framboise, cerise, ananas"], "rouge parfait"),
        q("Cocktails Stars", "Que contient le Yoyo Corail ?", "Banane, mangue, fraise, Yolita", ["Banane, mangue, fraise, lait", "Banane, ananas, fraise, Yolita", "Mangue, passion, fraise, Yolita"], "yoyo corail"),
        q("Cocktails Stars", "Quelle est la composition du Rose Paradis ?", "Fraise, banane, orange, citron", ["Fraise, framboise, orange, citron", "Fraise, banane, pomme, citron vert", "Fraise, litchi, orange, citron"], "rose paradis"),
        q("Cocktails Stars", "Que contient le Mangue Énergie ?", "Mangue, clémentine corse, citron vert", ["Mangue, orange, citron jaune", "Mangue, passion, citron vert", "Mangue, clémentine corse, gingembre"], "mangue energie"),
        q("Cocktails Stars", "Quels fruits composent La Panthère Rose ?", "Framboise, litchi, grenade", ["Framboise, fraise, grenade", "Fraise, litchi, cranberry", "Framboise, litchi, pêche"], "panthere rose"),
        q("Cocktails Stars", "Quelle est la composition du Verger Tropical ?", "Pêche jaune, abricot, fruit de la passion", ["Pêche jaune, mangue, fruit de la passion", "Pomme, abricot, ananas", "Pêche blanche, abricot, noix de coco"], "verger tropical"),
        q("Cocktails Stars", "Que contient la Caresse Antillaise ?", "Goyave, ananas-verveine, citron vert", ["Goyave, noix de coco, citron vert", "Mangue, ananas-verveine, citron jaune", "Goyave, passion, orange"], "caresse antillaise"),
        q("Cocktails Stars", "Que contient le Fleur d'Asie ?", "Litchi, framboise-cranberry-hibiscus", ["Litchi, rose, framboise", "Litchi, ananas-verveine", "Fraise, framboise-cranberry-hibiscus"], "fleur d asie"),
        q("Cocktails Stars", "Quelle est la composition du Joséphine Baker ?", "Fruit de la passion, mangue, noix de coco", ["Fruit de la passion, ananas, noix de coco", "Mangue, banane, noix de coco", "Fruit de la passion, mangue, citron vert"], "josephine baker"),
        q("Cocktails Stars", "En quelles tailles sont servis les Cocktails Stars ?", "35 cl ou 45 cl, sans alcool", ["25 cl, avec alcool", "40 cl uniquement, sans alcool", "33 cl ou 50 cl, sans alcool"]),
        q("À composer", "Quelle est la base du Yoyo à composer ?", "Yolita Frozen Yogurt", ["Lait", "Boisson végétale", "Glace vanille"], "yoyo a composer"),
        q("À composer", "Quelle est la base du Vegan à composer ?", "Boisson végétale", ["Yolita Frozen Yogurt", "Eau pétillante", "Base au lait"], "vegan a composer"),
        q("À composer", "Combien de parfums peut-on choisir pour un cocktail à composer ?", "19", ["12", "15", "23"], "parfums a composer"),
        q("Pressés", "Lequel de ces pressés n'est PAS servi avec une tige de céleri ?", "Caro'T Detox", ["Apple Bunny", "Green Attitude", "Potion Magique"], "caro t detox"),
        q("Pressés", "Que contient le Double Force ?", "Pomme Bio, ananas, basilic", ["Pomme Bio, ananas, menthe", "Pomme Bio, kiwi, basilic", "Pomme Bio, carotte, gingembre"], "double force"),
        q("Pressés", "Que veut dire Apple Bunny, et que contient-il ?", "Pomme Lapin : pomme Bio et carotte", ["Pomme Lapin : pomme Bio et concombre", "Pomme d'amour : pomme Bio et fraise", "Pomme verte : pomme Bio et kiwi"], "apple bunny"),
        q("Pressés", "Quelle est la composition du Tornade Santé ?", "Pomme Bio, concombre, menthe", ["Pomme Bio, kiwi, menthe", "Concombre, kale, menthe", "Pomme Bio, concombre, basilic"], "tornade sante"),
        q("Pressés", "Que contient la Potion Magique ?", "Carotte, ananas, coriandre", ["Carotte, orange, gingembre", "Carotte, ananas, menthe", "Carotte, pomme Bio, coriandre"], "potion magique"),
        q("Pressés", "Que contient le Caro'T Detox ?", "Carotte, orange, gingembre", ["Carotte, ananas, coriandre", "Carotte, pomme Bio, gingembre", "Carotte, orange, citron"], "caro t detox"),
        q("Pressés", "Quelle est la composition du Green Attitude ?", "Pomme Bio, kiwi, menthe", ["Pomme Bio, concombre, menthe", "Kiwi, kale, menthe", "Pomme Bio, kiwi, basilic"], "green attitude"),
        q("Pressés", "Que contient le Super Green ?", "Épinard, kale, pomme Bio, persil", ["Épinard, concombre, pomme Bio, menthe", "Kale, kiwi, pomme Bio, persil", "Épinard, kale, concombre, coriandre"], "super green"),
        q("Pressés", "Pourquoi le Veggie Detox n'est-il pas totalement sans sucre ?", "Le jus d'aloe vera contient du sucre", ["Il contient du miel", "Il contient du sirop de pamplemousse", "Il est sucré au sucre de canne"], "veggie detox"),
        q("Pressés", "Qu'est-ce que le Grand Soleil ?", "Orange ou pamplemousse pressé, sans sucre ajouté", ["Orange et citron pressés, avec sucre", "Orange ou pomme pressée, avec sirop", "Pamplemousse pressé et eau pétillante"], "grand soleil"),
        q("Vins", "Quel vin rosé propose la carte ?", "Orsuro, AOP Côtes de Provence", ["Belleruche, AOP Côtes du Rhône", "Whispering Angel, Côtes de Provence", "Minuty, Côtes de Provence"], "vin rose orsuro"),
        q("Bulles", "Sur quelle base est faite une Dans ta Bulle XXL ?", "Tonic avec une touche d'amertume, 45 cl", ["Eau pétillante et sirop, 45 cl", "Limonade et citron, 40 cl", "Tonic et gin, 25 cl"], "bulle citron jaune"),
        q("Granités", "Que contient le granité Lemon Nana ?", "Citron jaune et menthe", ["Citron vert et menthe", "Citron jaune et gingembre", "Fruit de la passion et citron vert"], "lemon nana"),
        q("Bières", "Quelle bière est une blonde non filtrée ?", "Gallia Champ Libre (33 cl, 5,8°)", ["Gallia Nouveau Western IPA (25 cl, 6°)", "Leffe blonde (33 cl, 6,6°)", "Heineken (25 cl, 5°)"], "gallia champ libre"),
        q("Coffee Shop", "Quel ingrédient original trouve-t-on dans le Caramelito ?", "Un Carambar", ["Des Smarties", "Des chamallows", "Un Kinder"], "caramelito"),
        q("Spritz", "Quelle liqueur remplace l'Aperol dans le Hugo Spritz ?", "Liqueur St-Germain (sureau)", ["Campari", "Limoncello", "Triple sec"], "hugo spritz"),
        q("Spritz", "Quel ingrédient donne son nom au Pink Spritz ?", "Le sirop de pamplemousse", ["Le sirop de framboise", "Le fruit de la passion", "Le sirop de grenadine"], "pink spritz"),
        q("Spritz", "Quel prosecco est utilisé dans les spritz ?", "Prosecco Martini", ["Prosecco Mionetto", "Prosecco La Marca", "Champagne brut"]),
        q("Margaritas", "Quelle est la composition de la Margarita Originale ?", "Tequila Camino Real, triple sec, citron vert", ["Tequila José Cuervo, triple sec, citron vert", "Tequila Camino Real, sirop de sucre, citron jaune", "Rhum Bacardi, triple sec, citron vert"], "margarita originale"),
        q("Margaritas", "Que contient la Margarita Mangue ?", "Tequila et sorbet mangue Alphonso d'Inde", ["Tequila, purée de mangue et triple sec", "Rhum et sorbet mangue Alphonso d'Inde", "Tequila, mangue fraîche et citron vert"], "margarita mangue"),
        q("Daïquiris", "Que contient le Daiquiri Coco ?", "Rhum Bacardi Carta Oro, glace noix de coco, lait de coco", ["Rhum blanc, crème de coco, ananas", "Rhum Bacardi Carta Oro, sorbet coco, citron vert", "Tequila, glace noix de coco, lait de coco"], "daiquiri coco"),
        q("Cocktails", "Qu'est-ce que la Danse Joséphine ?", "La version alcoolisée du Joséphine Baker, au rhum", ["La version alcoolisée du Joséphine Baker, à la tequila", "Un spritz à la passion", "Une Pina Colada à la mangue"], "danse josephine"),
        q("Mojitos", "Quelle différence entre l'Apple Virgin Mojito et le Mojito ?", "Virgin : 35 cl sans alcool, à la pomme. Mojito : 27 cl au rhum", ["Virgin : 27 cl. Mojito : 35 cl au rhum blanc", "Les deux contiennent du rhum, le Virgin en moins", "Virgin : 35 cl au cidre. Mojito : 27 cl au rhum"], "apple virgin mojito"),
        q("Pina Coladas", "Qu'ajoute la Pina Colada La Fragola à l'Originale ?", "De la fraise", ["De la framboise", "De la mangue", "Du fruit de la passion"], "la fragola"),
        q("Mixologie", "Quel gin est utilisé dans le Basilic Instinct ?", "Gin Bombay Sapphire", ["Gin Hendrick's", "Gin Tanqueray", "Gin Gordon's"], "basilic instinct"),
        q("Coffee Shop", "Laquelle de ces boissons chaudes ne contient pas de lait ?", "Double Expresso", ["Café noisette", "Matcha", "Chaï Latté"], "double expresso"),
      ],
    },

    /* ==========================================================
     * CUISINE
     * ========================================================== */
    {
      key: "cuisine",
      label: "Cuisine",
      emoji: "🍳",
      hue: 22,
      description: "Compositions précises, sauces et desserts",
      questions: [
        q("Pitas", "Que contient la pita Tartinade de thon au citron confit ?", "Thon Listao, citron confit, céleri, poivron", ["Thon Listao, citron confit, oignon rouge, poivron", "Thon albacore, citron confit, céleri, câpres", "Thon Listao, mayonnaise, céleri, cornichon"], "tartinade de thon au citron confit"),
        q("Pitas", "Que contient la pita à la dinde ?", "Dinde fumée, pomme, cheddar fondu", ["Dinde fumée, poire, cheddar fondu", "Jambon, pomme, cheddar fondu", "Dinde fumée, pomme, chèvre"], "dinde fumee pomme"),
        q("Pitas", "Que contient la pita au saumon ?", "Saumon fumé, cream cheese, aneth", ["Saumon fumé, cream cheese, ciboulette", "Saumon fumé, feta, aneth", "Truite fumée, cream cheese, aneth"], "saumon fume cream cheese et aneth"),
        q("Pitas", "Que contient la pita au chèvre ?", "Crémeux de chèvre, miel, noix, pousses d'épinard", ["Crémeux de chèvre, miel, amandes, roquette", "Chèvre frais, confiture de figue, noix, épinards", "Crémeux de chèvre, miel, noisettes, pousses d'épinard"], "cremeux de chevre"),
        q("Pitas", "Que contient la pita mozzarella ?", "Mozzarella, pistou, poivron rôti, roquette, chutney de tomates", ["Mozzarella, pistou, tomates séchées, roquette, olives", "Burrata, pistou, poivron rôti, épinards, chutney de tomates", "Mozzarella, pesto rouge, poivron rôti, roquette, oignon"], "mozzarella fior di latte pistou poivron roti"),
        q("Avocado Toast", "Dans l'Avocado Toast Le Veggie, combien d'œufs pochés et quel fromage ?", "2 œufs pochés et feta", ["1 œuf poché et feta", "2 œufs pochés et chèvre", "1 œuf poché et mozzarella"], "le veggie"),
        q("Avocado Toast", "Que contient l'Avocado Toast Le Saumon, en plus de l'avocat ?", "Courgettes marinées, cream cheese à l'aneth, saumon fumé", ["Concombre, cream cheese à l'aneth, saumon fumé", "Courgettes marinées, feta, saumon fumé", "Œuf poché, cream cheese, saumon fumé"], "le saumon"),
        q("Salades", "Lequel de ces ingrédients ne fait PAS partie de la base méli-mélo ?", "Concombre", ["Edamames", "Julienne de carottes", "Focaccia au pistou"], "base meli melo"),
        q("Salades", "Quel poulet et quelle sauce dans la Paradis Bonheur ?", "Poulet mariné aux 4 épices et sauce thaï", ["Crispy de poulet et sauce Caesar", "Poulet au curry et sauce sweet chili", "Poulet mariné aux 4 épices et sauce gravlax"], "paradis bonheur"),
        q("Salades", "Que contient la Caesar au Paradis, en plus du méli-mélo ?", "Crispy de poulet, œuf dur, croûtons de focaccia, Grana Padano", ["Poulet grillé, œuf poché, croûtons de pain, parmesan", "Crispy de poulet, bacon, croûtons, Grana Padano", "Crispy de poulet, œuf dur, tomates, mozzarella"], "caesar au paradis"),
        q("Salades", "Quel fromage trouve-t-on dans la Tutti Salata ?", "Feta marinée", ["Burrata", "Mozzarella Fior di Latte", "Crémeux de chèvre"], "tutti salata"),
        q("Salades", "Que contient la Mama Saumon ?", "2 brochettes de saumon, ananas, grenade, sauce gravlax", ["Saumon fumé, ananas, grenade, sauce gravlax", "2 brochettes de saumon, mangue, grenade, sauce thaï", "2 brochettes de saumon, avocat, sésame, sauce tartare"], "mama saumon"),
        q("Salades", "Que contient la Pistou Presto ?", "Burrata, tomates d'antan, courgettes marinées, pistou, focaccia", ["Mozzarella, tomates cerises, aubergines, pistou, focaccia", "Burrata, tomates d'antan, poivrons, pesto rouge, pita", "Burrata, roquette, courgettes, pistou, croûtons"], "pistou presto"),
        q("Chaud le Toast", "Sur quelle garniture principale repose le Goody Woody ?", "Crémeux de poulet miel & curry", ["Tartinade de thon", "Tartinade de saumon à l'aneth", "Pastrami de bœuf"], "goody woody"),
        q("Chaud le Toast", "Quels éléments principaux composent le C'Bon ?", "Tartinade de thon, mozzarella, pistou", ["Crémeux de poulet, cheddar, maïs", "Tartinade de saumon, œuf poché, épinards", "Dinde, pastrami, cheddar"], "c bon"),
        q("Chaud le Toast", "Que contient la Banquise Sauvage ?", "Tartinade de saumon à l'aneth, saumon fumé, épinards, œuf poché", ["Tartinade de thon, saumon fumé, épinards, œuf poché", "Tartinade de saumon à l'aneth, avocat, roquette, œuf dur", "Saumon fumé, cream cheese, épinards, œuf poché"], "banquise sauvage"),
        q("Chaud le Toast", "Quels condiments trouve-t-on dans le Deli Mix Pastrami ?", "Cornichons, oignons rouges, moutarde au miel", ["Cornichons, câpres, mayonnaise", "Oignons frits, moutarde à l'ancienne, ketchup", "Pickles, oignons rouges, sauce barbecue"], "deli mix pastrami"),
        q("Street Paradis", "Avec quelle sauce est servi le Fish & Chips ?", "Sauce tartare", ["Sauce gravlax", "Mayonnaise homard", "Sauce spicy mayo"], "fish chips"),
        q("Street Paradis", "Quelles sauces trouve-t-on dans le Pastrami Burger ?", "Sauce cheddar, sauce tartare et sauce barbecue", ["Sauce cheddar et ketchup", "Sauce barbecue et mayonnaise", "Sauce tartare et moutarde au miel"], "pastrami burger"),
        q("Street Paradis", "Quelle galette compose le Veggie Burger ?", "Galette de petits pois", ["Galette de pois chiches", "Galette de légumes grillés", "Steak de soja"], "veggie burger"),
        q("Pains", "Quel pain est utilisé pour le Sir Homard Lobster ?", "Pain brioché", ["Pain au curcuma et aux graines", "Focaccia", "Pita toastée"], "sir homard lobster"),
        q("Pains", "Quel pain est utilisé pour le Pastrami Burger et le Veggie Burger ?", "Pain au curcuma et aux graines", ["Pain brioché", "Pain aux céréales", "Bun au sésame"], "pastrami burger"),
        q("Street Paradis", "Avec quelle sauce est servi le Sir Homard Lobster ?", "Mayonnaise homard", ["Sauce tartare", "Sauce cocktail", "Beurre citronné"], "sir homard lobster"),
        q("Marmites", "Sur quelle base est faite Dolce Paradisio ?", "Gnocchis de pomme de terre", ["Penne", "Risotto", "Raviolis"], "dolce paradisio"),
        q("Marmites", "Quelles olives trouve-t-on dans Dolce Paradisio et Citron Beldi ?", "Olives Taggiasche", ["Olives de Kalamata", "Olives Picholine", "Olives noires de Nyons"], "dolce paradisio"),
        q("Marmites", "Avec quelle céréale est servi Citron Beldi ?", "Quinoa & boulgour à la menthe fraîche", ["Riz vapeur aux petits légumes", "Semoule aux raisins", "Lentilles corail"], "citron beldi"),
        q("Marmites", "Quelle sauce accompagne Mama Corail ?", "Sauce tom yum", ["Sauce thaï", "Curry au lait de coco", "Sauce sweet chili"], "mama corail"),
        q("Marmites", "Avec quoi est servie Mama Corail ?", "Riz vapeur aux petits légumes", ["Quinoa & boulgour", "Nouilles de riz", "Gnocchis"], "mama corail"),
        q("Accompagnements", "Lequel de ces ingrédients n'est PAS dans le coleslaw ?", "Oignon rouge", ["Raisins secs", "Pomme", "Citron"], "3 coleslaw"),
        q("Sauces", "Lequel de ces plats contient de la sauce thaï ?", "Citron Beldi", ["Mama Corail", "Caesar au Paradis", "Mama Saumon"], "citron beldi"),
        q("Sauces", "Avec quelle sauce sont servies les brochettes de saumon (saveur 22) ?", "Sauce gravlax", ["Sauce sweet chili", "Sauce spicy mayo", "Sauce tartare"], "brochettes de saumon"),
        q("Ingrédients", "Quels plats contiennent des amandes effilées ?", "Citron Beldi et Mama Corail", ["Citron Beldi et Dolce Paradisio", "Mama Corail et Paradis Bonheur", "Tutti Salata et Citron Beldi"]),
        q("Saveurs", "Avec quel condiment est servie la saveur 16 (mozzarella, tomates multicolores) ?", "Condiment tomate-aneth", ["Pistou", "Vinaigrette aux agrumes", "Pesto rouge"], "tomates multicolores"),
        q("Saveurs", "Qu'est-ce qui distingue la saveur 19 de la saveur 4 ?", "La 19 : saumon fumé et sauce crémeuse à l'aneth. La 4 : tartinade de saumon", ["La 19 : tartinade de saumon. La 4 : saumon fumé et sauce aneth", "La 19 est servie avec focaccia, la 4 avec blini", "La 19 contient du cream cheese, la 4 de la feta"], "19 saumon fume"),
        q("Desserts", "Avec quoi est servi le Fondant Cœur Coulant ?", "Crème anglaise et crème fouettée", ["Glace vanille et coulis", "Crème fraîche et caramel", "Sorbet framboise et chantilly"], "fondant coeur coulant"),
        q("Desserts", "Quels sont les éléments de l'Île Meringuée ?", "Tarte au citron, meringue italienne, cœur glacé framboise-passion", ["Tarte au citron, meringue française, coulis de fraise", "Île flottante, crème anglaise, caramel", "Tarte au citron vert, meringue italienne, sorbet mangue"], "ile meringuee"),
        q("Desserts", "Avec quoi est servi le New York Cheesecake ?", "Purée de mangue, caramel-vanille Paradis, crème fouettée", ["Coulis de fruits rouges et crème fouettée", "Purée de passion, chocolat, crème fouettée", "Caramel beurre salé et spéculoos"], "new york cheesecake"),
        q("Desserts", "Que contient le Trop Choux À la Folie ?", "Sorbet mangue Alphonso et purée de mangue", ["Sorbet fraises Senga et fraises des bois", "Sorbet framboise-passion et coulis multi-fruits", "Glace vanille et sauce chocolat"], "a la folie"),
        q("Desserts", "Quel crunch trouve-t-on sur les pancakes Le Gourmand ?", "Pistache crunch", ["Amandes coco crunch", "Pépites caramélisées", "Noisettes grillées"], "le gourmand"),
        q("Desserts", "Combien de choux dans la Profiterole Très Folle ?", "Un unique chou XXL", ["3 petits choux", "5 profiteroles", "2 choux moyens"], "profiterole tres folle"),
      ],
    },

    /* ==========================================================
     * GÉNÉRAL
     * ========================================================== */
    {
      key: "general",
      label: "Général",
      emoji: "🍍",
      hue: 142,
      description: "Structure de la carte, produits phares et réflexes",
      questions: [
        q("Carte", "Combien de saveurs pour assiettes compte la carte ?", "23", ["18", "20", "25"]),
        q("Carte", "Laquelle de ces familles ne fait PAS partie des Plats ?", "Trop Choux !", ["Street Paradis", "Chaud le Toast !", "Les Marmites Magiques !"]),
        q("Allergènes", "Combien y a-t-il d'allergènes réglementaires ?", "14", ["10", "12", "16"]),
        q("Allergènes", "Lequel n'est PAS un allergène réglementaire ?", "Tomate", ["Lupin", "Mollusques", "Sulfites"]),
        q("Allergènes", "Un client signale une allergie. Quel est le bon réflexe ?", "Vérifier la fiche officielle et prévenir la cuisine", ["Répondre de mémoire si on connaît bien le plat", "Retirer l'ingrédient et servir", "Conseiller un plat sans regarder la fiche"]),
        q("Glaces", "D'où viennent les glaces artisanales ?", "Un atelier artisanal français, au lait entier de la ferme Marg'Aude", ["Un glacier italien, au lait de la ferme Marg'Aude", "Elles sont fabriquées sur place au restaurant", "Un atelier artisanal belge, au lait demi-écrémé"], "glaces artisanales"),
        q("Glaces", "Lequel n'est PAS un parfum de glace artisanale ?", "Caramel beurre salé", ["Pistache de Sicile", "Nougat de Montélimar", "Chocolat noir Guanaja"], "glaces artisanales"),
        q("Glaces", "Lequel est un sorbet artisanal de la carte ?", "Mangue Alphonso d'Inde", ["Citron de Menton", "Cassis de Bourgogne", "Poire Williams"], "sorbets artisanaux"),
        q("Produits", "Quelle truffe est utilisée à la carte ?", "Truffe d'été (Tuber aestivum)", ["Truffe noire (Tuber melanosporum)", "Truffe blanche d'Alba", "Truffe de Bourgogne (Tuber uncinatum)"], "7 oeufs durs"),
        q("Vocabulaire", "Que veut dire « Crazy » dans Le Crazy Fruit ?", "Dingue", ["Croquant", "Coloré", "Géant"], "le crazy fruit"),
        q("Produits", "Quel thon est utilisé dans la tartinade ?", "Thon Listao", ["Thon albacore", "Thon rouge", "Thon germon"], "tartinade de thon au citron confit"),
        q("Produits", "Quel plat associe merlu et crevettes ?", "Mama Corail", ["Fish & Chips", "Sir Homard Lobster", "Citron Beldi"], "mama corail"),
        q("Alcools", "Quelle tequila est utilisée dans les margaritas ?", "Camino Real", ["José Cuervo", "Patrón", "Sierra"]),
        q("Alcools", "Quel rhum est utilisé dans les cocktails ?", "Bacardi Carta Oro", ["Bacardi Carta Blanca", "Havana Club 3 ans", "Captain Morgan"]),
        q("Alcools", "Lequel de ces cocktails ne contient PAS de rhum ?", "Margarita Mangue", ["Pina Colada La Fragola", "Daiquiri Coco", "Danse Joséphine"], "margarita mangue"),
        q("Produits", "Lequel de ces produits contient du Yolita ?", "Café ou Thé Gourmand Light", ["Café ou Thé Gourmand", "Açaï Bowl Paradisiaque", "Rose Paradis"], "cafe ou the gourmand light"),
        q("Produits", "Laquelle de ces recettes contient la sauce caramel-vanille Paradis ?", "Ta-Tatin", ["Nutella Lover", "Ramène ta Fraise", "Fondant Cœur Coulant"], "ta tatin"),
        q("Coupes glacées", "Quelle coupe contient de la crème de nougat Paradis ?", "Double Choco", ["Fraise Melba Très Fraise", "Banana Split Vintage", "Igloo"], "double choco"),
        q("Coupes glacées", "Quelle coupe ne contient PAS de glace vanille de Madagascar ?", "Pistachio", ["Nougatella", "Aphrodite", "Banana Split Vintage"], "pistachio"),
        q("Coupes glacées", "Quels parfums trouve-t-on dans le Banana Split Vintage ?", "Vanille, chocolat Guanaja et sorbet fraise", ["Vanille, pistache et sorbet mangue", "Chocolat, nougat et sorbet framboise", "Vanille, coco et sorbet fraise"], "banana split vintage"),
        q("Formats", "Quelle recette existe en formats La Môme et La Très Belle ?", "Fondue de Fruits Très Chocolat", ["Gaufres Géantes à partager", "Chocolat Mon Amour", "Profiterole Très Folle"], "fondue de fruits"),
        q("Desserts", "Que contient l'Açaï Bowl en plus des fruits et de l'açaï ?", "Du yaourt et du muesli croustillant", ["Du lait de coco et des noix", "De la crème fouettée", "Du miel et des amandes"], "acai bowl"),
        q("Desserts", "Laquelle n'est PAS une gaufre de la carte ?", "Speculoos Dream", ["Nutella Lover", "Dolce Banana", "Ramène ta Fraise"]),
        q("Desserts", "Combien de pancakes dans les assiettes Pancakes du Paradis ?", "3", ["2", "4", "5"]),
        q("Desserts", "Avec quoi sont servis les pancakes L'Original ?", "American Syrup et crème fouettée", ["Sirop d'érable et beurre", "Nutella et banane", "Caramel-vanille et crème fouettée"], "l original"),
        q("Coupes glacées", "Combien de coupes glacées compte la carte ?", "9", ["6", "7", "12"]),
        q("Coupes glacées", "Que contient la Pistachio ?", "Glace pistache de Sicile, pistache crunch, fondant choco, sauce choco-noisette", ["Glace pistache, amandes grillées, nougat, caramel", "Glace pistache, framboises, coulis, crème fouettée", "Glace vanille, pistache crunch, Nutella, banane"], "pistachio"),
        q("Produits", "Lequel de ces plats contient de l'avocat ?", "Veggie Burger", ["Pastrami Burger", "Fish & Chips", "Deli Mix Pastrami"], "veggie burger"),
        q("Pitas", "Combien de recettes de pitas toastées compte Bonjour Paradis ?", "6 recettes, plus la Planche de 3", ["5 recettes", "7 recettes", "8 recettes"]),
        q("Carte", "Lequel n'est PAS un Chaud le Toast ?", "Pistou Presto", ["Goody Woody", "C'Bon", "Banquise Sauvage"]),
        q("Carte", "Laquelle n'est PAS une Marmite Magique ?", "Mama Saumon", ["Dolce Paradisio", "Citron Beldi", "Mama Corail"]),
        q("Carte", "Combien de salades composées compte la carte (hors base méli-mélo) ?", "5", ["4", "6", "7"]),
        q("Carte", "Lequel n'est PAS un plat Street Paradis ?", "Deli Mix Pastrami", ["Fish & Chips", "Veggie Burger", "Sir Homard Lobster"]),
        q("Produits", "Où trouve-t-on du Grana Padano AOP ?", "Caesar au Paradis", ["Pistou Presto", "Tutti Salata", "Goody Woody"], "caesar au paradis"),
        q("Produits", "Lequel contient de la mozzarella Fior di Latte ?", "C'Bon", ["Goody Woody", "Banquise Sauvage", "Deli Mix Pastrami"], "c bon"),
        q("Produits", "Où trouve-t-on du pastrami de bœuf ?", "Deli Mix Pastrami et Pastrami Burger", ["Goody Woody et Pastrami Burger", "Deli Mix Pastrami et Sir Homard Lobster", "Uniquement dans le Pastrami Burger"]),
        q("Produits", "Quel dessert contient du sorbet mangue Alphonso d'Inde ?", "Ma Jolie Mangue", ["New York Cheesecake", "Salade de Fruits Jolie Jolie", "Le Crazy Fruit"], "ma jolie mangue"),
        q("Service", "Quel élément accompagne plusieurs pressés à la pomme Bio ?", "Une tige de céleri", ["Une paille en bambou", "Une rondelle de citron", "Une feuille de menthe"], "double force"),
        q("Allergènes", "Lequel de ces desserts contient visiblement des fruits à coque ?", "Aphrodite (amandes grillées)", ["Salade de Fruits Jolie Jolie", "Ramène ta Fraise", "Ma Jolie Mangue"], "aphrodite"),
        q("Desserts", "Que contient le Café ou Thé Gourmand ?", "Fondant choco, crème de nougat, soupe de fraise, glace ou sorbet, amandes coco crunch", ["Mini cheesecake, macaron, mousse au chocolat", "Dés d'ananas, dés de kiwi, Yolita", "Mini gaufre, crème brûlée, sorbet"], "cafe ou the gourmand"),
      ],
    },
  ];
})();
