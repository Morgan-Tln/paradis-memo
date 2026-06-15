// Base de données immuable certifiée v2026 - Le Paradis du Fruit
window.SECTIONS = {
  plats: {
    label: "🍽️ Les Plats",
    color: "#e8763a",
    categories: {
      pitas: {
        label: "Pitas Toastées",
        emoji: "🫓",
        items: [
          { name: "Tartinade de thon au citron confit", ingredients: ["Thon Listao", "Citron confit", "Céleri", "Poivron"], memo: "⚠️ Attention : Contient nativement du céleri et du poivron au poste froid." },
          { name: "Dinde fumée, pomme et Cheddar fondu", ingredients: ["Chiffonnade de dinde fumée", "Pomme", "Cheddar fondu"], memo: "🦃 Profil Thanksgiving : dinde + pomme + cheddar." },
          { name: "Saumon fumé, Cream Cheese et aneth", ingredients: ["Saumon fumé", "Cream Cheese", "Aneth"], memo: "🇳🇴 Le classique scandinave froid et frais en pita." },
          { name: "Crémeux de Chèvre, miel, noix et épinards", ingredients: ["Crémeux de chèvre", "Miel", "Noix", "Pousses d'épinard"], memo: "🐐 Le chèvre adore le miel. Les noix et les épinards l'accompagnent en forêt." },
          { name: "Crémeux de poulet miel & curry, poivrons et Cheddar", ingredients: ["Poulet", "Miel & curry", "Poivrons", "Cheddar fondu"], memo: "🍛 Poulet en Inde (curry) enveloppé de cheddar chaud." },
          { name: "Mozzarella Fior Di Latte, pistou, poivron rôti", ingredients: ["Mozzarella Fior di Latte", "Pistou", "Poivron rôti", "Roquette", "Chutney de tomates"], memo: "🇮🇹 Vert (pistou/roquette) et Rouge (poivron/tomate)." }
        ]
      },
      avocado: {
        label: "Avocado Toast Party",
        emoji: "🥑",
        items: [
          { name: "Le Veggie", ingredients: ["Focaccia", "Avocat frais", "2 œufs pochés", "Feta", "Grenade", "Multigraines", "Mesclun", "Vinaigrette agrumes"], memo: "🌱 Pas de viande. Couleur festive assurée par la feta et la grenade." },
          { name: "Le Saumon", ingredients: ["Focaccia", "Avocat frais", "Courgettes marinées", "Cream Cheese à l'aneth", "Saumon fumé"], memo: "🐟 Le saumon et le cream cheese remplacent les œufs et la feta." }
        ]
      },
      salades: {
        label: "Salades Créations",
        emoji: "🥗",
        items: [
          { name: "Paradis Bonheur", ingredients: ["Salade Romaine", "Tomates cerises", "Edamames", "Carottes", "Poulet", "Ananas", "Sésame", "Oignons frits", "Menthe", "Sauce thaï"], memo: "🌏 Note la base Méli-mélo commune et le twist asiat : poulet mariné aux 4 épices, ananas et menthe." },
          { name: "Caesar au Paradis", ingredients: ["Salade Romaine", "Tomates cerises", "Edamames", "Carottes", "Poulet", "Œuf dur", "Croûtons de focaccia", "Grana Padano AOP", "Sauce Caesar"], memo: "🏛️ Revisitée avec des croûtons de focaccia maison au pistou et du Grana Padano AOP." },
          { name: "Tutti Salata", ingredients: ["Salade Romaine", "Tomates cerises", "Edamames", "Carottes", "Melon", "Pastèque", "Feta marinée", "Ananas", "Fruit de la passion", "Grenade", "Vinaigrette agrumes"], memo: "🎉 Assiette 100% Fruits & Fromage, très fraîche, aucun légume chaud." },
          { name: "Mama Saumon", ingredients: ["Salade Romaine", "Tomates cerises", "Edamames", "Carottes", "2 brochettes de saumon", "Ananas", "Grenade", "Sauce gravlax"], memo: "🐟 Les brochettes de saumon grillées se marient à l'ananas poêlé." },
          { name: "Pistou Presto", ingredients: ["Salade Romaine", "Tomates cerises", "Edamames", "Carottes", "Burrata fondante", "Tomate d'antan", "Courgettes marinées", "Pistou", "Focaccia"], memo: "🇮🇹 Une burrata entière crémeuse posée sur des tomates d'antan au pistou." }
        ]
      }
    }
  },
  saveurs: {
    label: "🎯 Les 23 Saveurs",
    color: "#2d7d46",
    categories: {
      assiettes: {
        label: "Les 23 Saveurs pour Assiettes",
        emoji: "🔢",
        items: [
          { name: "1. Camembert croustillant au sésame", ingredients: ["Camembert pané", "Graines de sésame"], memo: "🧀 Fromage chaud pané des assiettes." },
          { name: "2. Tartinade de thon au citron confit et blini", ingredients: ["Tartinade de thon", "Citron confit", "Blini chaud"], memo: "🐟 Thon crémeux sur blini chaud." },
          { name: "3. Crémeux de poulet miel & curry et focaccia", ingredients: ["Crémeux de poulet", "Miel & curry", "Focaccia"], memo: "🐔 Version à tartiner de notre recette curry phare." },
          { name: "4. Tartinade de saumon à l'aneth et blini", ingredients: ["Tartinade de saumon", "Aneth", "Blini chaud"], memo: "🌿 Profil nordique doux sur blini chaud." },
          { name: "5. Mini Pita Chèvre Miel Noix Épinards", ingredients: ["Mini pita", "Crémeux de chèvre", "Miel", "Noix", "Pousses d'épinard"], memo: "🐐 Miniature du toast de chèvre de la forêt." },
          { name: "6. Mini Pita Thon Citron Confit", ingredients: ["Mini pita", "Tartinade de thon", "Citron confit"], memo: "🐟 Version miniature prête à l'envoi." },
          { name: "7. Œufs durs, mayonnaise à la truffe d'été", ingredients: ["Œufs durs", "Mayonnaise à la truffe d'été", "Ciboulette"], memo: "👑 Spécificité réglementaire : Truffe d'été (Tuber aestivum)." },
          { name: "8. Crispy de poulet aux céréales", ingredients: ["Aiguillettes de poulet", "Panure céréales", "Sauce spicy mayo"], memo: "💥 Le poulet préféré des clients avec sa sauce relevée." },
          { name: "9. Mini Pita Dinde Cheddar", ingredients: ["Mini pita", "Chiffonnade de dinde", "Pomme", "Cheddar fondu"], memo: "🦃 Petit format du toast américain." },
          { name: "10. Mini Pita Poulet Curry", ingredients: ["Mini pita", "Poulet", "Miel & curry", "Poivrons", "Cheddar"], memo: "🍛 Petite pita chaude et épicée." },
          { name: "11. 2 Brochettes de poulet marinées", ingredients: ["2 brochettes de poulet", "Marination Paradis"], memo: "🔥 Grillade minute signature Le Paradis du Fruit." },
          { name: "12. Mini salade Caesar", ingredients: ["Salade romaine", "Crispy de poulet", "Grana Padano AOP", "Sauce Caesar"], memo: "🏛️ Version condensée de la salade emblématique." },
          { name: "13. Pastèque, Feta marinée et menthe fraîche", ingredients: ["Pastèque", "Feta marinée", "Menthe fraîche"], memo: "🍉 Rafraîchissement estival pur." },
          { name: "14. Melon jaune, Mozzarella Fior de Latte et pistou", ingredients: ["Melon jaune", "Mozzarella Fior di Latte", "Pistou"], memo: "🍈 Douceur tricolore à l'italienne." },
          { name: "15. Demi avocat, vinaigrette aux agrumes", ingredients: ["1/2 Avocat", "Vinaigrette agrumes", "Herbes fraîches"], memo: "🥑 Simple, sain et efficace." },
          { name: "16. Mozzarella Fior Di Latte, tomates multicolores", ingredients: ["Mozzarella", "Tomates multicolores", "Condiment tomate-aneth"], memo: "🍅 Assaisonné d'un condiment tomate-aneth exclusif." },
          { name: "17. Mini Fish & Chips limande", ingredients: ["Limande croustillante", "Sauce tartare"], memo: "🐟 Attention : Ici c'est de la limande et non du merlu !" },
          { name: "18. Mini Pita Mozza Pistou Poivron", ingredients: ["Mini pita", "Mozzarella", "Pistou", "Poivron rôti", "Roquette", "Chutney de tomates"], memo: "🇮🇹 Mini sandwich caprese chaud." },
          { name: "19. Saumon fumé, sauce crémeuse à l'aneth et blini", ingredients: ["Tranches de saumon fumé", "Sauce crémeuse aneth", "Blini chaud"], memo: "🇳🇴 Tranches entières nobles avec blini traditionnel." },
          { name: "20. Crevettes panko croustillantes", ingredients: ["Crevettes panées", "Chapelure panko", "Sauce sweet chili"], memo: "🍤 Panure japonaise légère et sauce douce." },
          { name: "21. Mini Pita Saumon Cream Cheese", ingredients: ["Mini pita", "Saumon fumé", "Cream cheese", "Aneth"], memo: "🥯 Esprit NYC Bagel." },
          { name: "22. 2 Brochettes de saumon au sésame", ingredients: ["2 brochettes de saumon", "Sésame", "Sauce gravlax"], memo: "🔥 Cuites minute, laquées au sésame." },
          { name: "23. Demi avocat aux crevettes", ingredients: ["1/2 Avocat", "Crevettes", "Sauce spicy mayo"], memo: "🥑 Un grand incontournable." }
        ]
      },
      accompagnements: {
        label: "Les Accompagnements",
        emoji: "🥙",
        items: [
          { name: "Liste réglementaire des côtés", ingredients: ["Pommes frites", "Riz vapeur aux petits légumes", "Coleslaw", "Mesclun", "Haricots verts croustillants cajun", "Quinoa & boulgour à la menthe"], memo: "🔢 Rappel : 1=Frites, 2=Riz, 3=Coleslaw, 4=Léger, 5=Cajun, 6=Healthy." }
        ]
      }
    }
  },
  boissons: {
    label: "🍹 Les Boissons",
    color: "#2a9d8f",
    categories: {
      presses: {
        label: "Pressés Minute & Détox (40cl)",
        emoji: "🍋",
        items: [
          { name: "Grand Soleil", ingredients: ["Orange", "Pamplemousse"], memo: "☀️ 100% pur fruit pressé minute, sans aucun sucre ajouté." },
          { name: "Double Force", ingredients: ["Pomme Bio", "Ananas", "Basilic"], memo: "🍏 Profil aromatique très herbacé et rafraîchissant." },
          { name: "Apple Bunny", ingredients: ["Pomme Bio", "Carotte"], memo: "🥕 TOUS les jus contenant de la pomme bio sont servis avec une tige de céleri frais !" },
          { name: "Tornade Santé", ingredients: ["Pomme Bio", "Concombre", "Menthe"], memo: "🌪️ Hydratation extrême. Livré avec sa tige de céleri." },
          { name: "Veggie Detox", ingredients: ["Concombre", "Kale", "Menthe", "Jus aloe vera"], memo: "🥬 Piège examen : présence naturelle de sucre dans l'aloe vera !" }
        ]
      },
      granites: {
        label: "Granités & Elixirs XXL (40cl)",
        emoji: "❄️",
        items: [
          { name: "Lemon Nana", ingredients: ["Citron", "Menthe"], memo: "🌿 Citron jaune, feuilles de menthe pilées de tradition." },
          { name: "Rouge Orangeade", ingredients: ["Fraise", "Orange"], memo: "🍓 Équilibre sucré-acide rafraîchissant." },
          { name: "Passiflora", ingredients: ["Fruit de la passion", "Citron vert"], memo: "🧪 Puissance exotique givrée." },
          { name: "Green Icet", ingredients: ["Thé vert glacé", "Menthe"], memo: "🟢 Grand format de thé glacé maison léger." },
          { name: "Cure Detox", ingredients: ["Grenade", "Cranberry", "Fruits rouges"], memo: "🔴 Véritable concentré d'antioxydants rouges." }
        ]
      },
      cocktails_stars: {
        label: "Cocktails Stars (Sans Alcool)",
        emoji: "⭐",
        items: [
          { name: "Vitaminé", ingredients: ["Citron", "Orange", "Pamplemousse", "Kiwi"], memo: "🥝 Le pilier historique du Paradis. 100% agrumes + kiwi." },
          { name: "Rouge Parfait", ingredients: ["Framboise", "Fraise", "Ananas"], memo: "🍓 Sucré, onctueux et très gourmand." },
          { name: "Yoyo Corail", ingredients: ["Banane", "Mangue", "Fraise", "Yolita"], memo: "🍦 Contient du Yolita pour la texture crémeuse." },
          { name: "Rose Paradis", ingredients: ["Fraise", "Banane", "Orange", "Citron"], memo: "🌹 Base douce banane/fraise réveillée par les agrumes." },
          { name: "Mangue Énergie", ingredients: ["Mangue", "Clémentine corse", "Citron vert"], memo: "🍊 Contient de la clémentine corse haut de gamme." },
          { name: "La Panthère Rose", ingredients: ["Framboise", "Litchi", "Grenade"], memo: "🐆 Doux, floral et très parfumé grâce au litchi." },
          { name: "Verger Tropical", ingredients: ["Pêche jaune", "Abricot", "Fruit de la passion"], memo: "🍑 Ambiance fruits du verger et d'été." },
          { name: "Caresse Antillaise", ingredients: ["Goyave", "Ananas", "Menthe", "Citron vert"], memo: "🏝️ Évocation immédiate des îles avec purée d'ananas-verveine." },
          { name: "Fleur d'Asie", ingredients: ["Litchi", "Framboise", "Cranberry", "Hibiscus"], memo: "🌺 Goût unique axé sur l'infusion d'hibiscus." },
          { name: "Josephine Baker", ingredients: ["Fruit de la passion", "Mangue", "Noix de coco"], memo: "💃 L'icône de la maison : Onctueux, tropical, incontournable." }
        ]
      },
      mixologie: {
        label: "Mixologie Fine & Alcools",
        emoji: "🍸",
        items: [
          { name: "Spritz Original", ingredients: ["Aperol", "Prosecco Martini", "Eau pétillante"], memo: "🇮🇹 Partenaire officiel obligatoire pour le Prosecco : Maison MARTINI." },
          { name: "Hugo Spritz", ingredients: ["Liqueur St-Germain", "Prosecco Martini", "Eau pétillante"], memo: "🥂 Utilise la liqueur de sureau St-Germain noble." },
          { name: "Pink Spritz", ingredients: ["Aperol", "Prosecco Martini", "Pamplemousse", "Eau pétillante"], memo: "🍹 Intègre un sirop de pamplemousse rose." },
          { name: "Passion Spritz", ingredients: ["Aperol", "Prosecco Martini", "Fruit de la passion", "Eau pétillante"], memo: "🧪 Version fruitée exotique du Spritz." },
          { name: "Margarita Originale", ingredients: ["Tequila Camino Real", "Citron vert"], memo: "🇲🇽 Tequila Camino Real et triple sec." },
          { name: "Margarita Mangue", ingredients: ["Tequila Camino Real", "Sorbet Mangue Alphonso"], memo: "🥭 Élaboré avec la Tequila Camino Real et le sorbet Alphonso d'Inde." },
          { name: "Danse Josephine", ingredients: ["Rhum Bacardi Carta Oro", "Mangue", "Fruit de la passion", "Noix de coco"], memo: "💃 La version alcoolisée premium de la Josephine Baker." },
          { name: "Daiquiri Passion & Framboise", ingredients: ["Rhum Bacardi Carta Oro", "Framboise", "Fruit de la passion"], memo: "🍓 Base sorbet framboise passion du Pérou." },
          { name: "Daiquiri Coco", ingredients: ["Rhum Bacardi Carta Oro", "Noix de coco", "Lait"], memo: "🥥 Glace noix de coco au lait de coco artisanal." },
          { name: "Pina Colada Originale", ingredients: ["Rhum Bacardi Carta Oro", "Ananas", "Noix de coco"], memo: "🍍 Rhum Bacardi Carta Oro, ananas et coco." },
          { name: "Pina Colada La Fragola", ingredients: ["Rhum Bacardi Carta Oro", "Ananas", "Noix de coco", "Fraise"], memo: "🍓 Version twistée à la fraise fraîche." },
          { name: "Mojito classique / Mojito Fruit", ingredients: ["Rhum Bacardi Carta Oro", "Menthe", "Citron vert"], memo: "🍃 Rhum ambré Bacardi Carta Oro pour une rondeur incomparable en bouche." },
          { name: "Basilic Instinct", ingredients: ["Gin Bombay Sapphire", "Concombre", "Basilic", "Citron"], memo: "🌿 Profil botanique moderne très élégant axé mixologie fine." }
        ]
      }
    }
  },
  desserts: {
    label: "🍰 Les Desserts",
    color: "#c94f8a",
    categories: {
      creations: {
        label: "Créations & Gros Desserts",
        emoji: "✨",
        items: [
          { name: "Fondant Cœur Coulant", ingredients: ["Chocolat sans gluten", "Crème anglaise", "Crème fouettée"], memo: "♥️ Naturellement sans gluten." },
          { name: "Ma Jolie Mangue", ingredients: ["Mangue", "Pulpe de passion", "Sorbet mangue Alphonso d'Inde"], memo: "🥭 Triple dose de mangue sous toutes ses textures." },
          { name: "Profiterole Très Folle", ingredients: ["1 Chou XXL géant", "Glace vanille de Madagascar", "Sauce choco-Nutella", "Banane", "Amandes", "Crème fouettée"], memo: "🤪 Un unique chou GÉANT format XXL." }
        ]
      },
      trop_choux: {
        label: "Trop Choux & Coupes Glacées",
        emoji: "🍨",
        items: [
          { name: "Chou Beaucoup", ingredients: ["P'tit chou", "Sorbet fraises Senga", "Fraises des bois", "Coulis de fruits", "Crème fouettée"], memo: "🍓 Thématique 100% Fraise." },
          { name: "Chou À La Folie", ingredients: ["P'tit chou", "Sorbet mangue Alphonso", "Purée de mangue", "Crème fouettée"], memo: "🥭 Thématique 100% Mangue." },
          { name: "Chou Passionnément", ingredients: ["P'tit chou", "Sorbet framboise", "Fruit de la passion", "Coulis de fruits", "Crème fouettée"], memo: "🧪 Équilibre acide parfait passion-framboise." },
          { name: "Banana Split Vintage", ingredients: ["Glace vanille", "Glace chocolat Guanaja", "Sorbet fraise Senga", "Banane", "Sauce choco-noisette", "Amandes grillées", "Crème fouettée"], memo: "🍌 La recette historique respectée au gramme près." }
        ]
      }
    }
  }
};

// Base fixe de questions théoriques règlementaires européennes
window.OFFICIAL_ALLERGENS = [
  { id: "gluten", name: "Céréales contenant du gluten", desc: "Blé, seigle, orge, avoine, épeautre (Pitas, Focaccia, Blinis, Choux, Panures)", color: { bg: "#faf6f0", text: "#6b4423", border: "#e8dcad" } },
  { id: "crustaces", name: "Crustacés", desc: "Crevettes, homard, crabe", color: { bg: "#ffe4e6", text: "#9f1239", border: "#fecdd3" } },
  { id: "oeufs", name: "Œufs", desc: "Œufs pochés, durs, mayonnaise maison, sauces Tartare et Caesar", color: { bg: "#fef9c3", text: "#713f12", border: "#fef08a" } },
  { id: "poissons", name: "Poissons", desc: "Thon Listao, Saumon fumé, Merlu du Cap, Limande", color: { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" } },
  { id: "arachides", name: "Arachides", desc: "Huiles ou éclats d'arachides (Risque de contamination croisée)", color: { bg: "#fef3c7", text: "#92400e", border: "#fde68a" } },
  { id: "soja", name: "Soja", desc: "Edamames frais, sauces asiatiques (Sauce Thaï, Tom Yum)", color: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" } },
  { id: "lait", name: "Lait (Lactose)", desc: "Cheddar, Chèvre, Mozzarella, Burrata, Feta, Cream Cheese, Crèmes, Yolita", color: { bg: "#faf5ff", text: "#581c87", border: "#e9d5ff" } },
  { id: "fruits_coque", name: "Fruits à coque", desc: "Noix, amandes effilées, éclats de pistache de Sicile", color: { bg: "#faf6f0", text: "#7c2d12", border: "#ebdcd5" } },
  { id: "celeri", name: "Céleri", desc: "Céleri branche, présent nativement dans la Tartinade de Thon", color: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" } },
  { id: "moutarde", name: "Moutarde", desc: "Moutarde au miel, assaisonnements de toasts et vinaigrettes", color: { bg: "#fef9c3", text: "#a16207", border: "#fef08a" } },
  { id: "sesame", name: "Graines de sésame", desc: "Graines de sésame noir/blanc, présent sur les brochettes de saumon", color: { bg: "#fbf7f5", text: "#451a03", border: "#ebdcd5" } },
  { id: "sulfites", name: "Anhydride sulfureux & Sulfites", desc: "Conservateurs (vins, alcools, citrons confits, vinaigres)", color: { bg: "#ecfeff", text: "#0891b2", border: "#a5f3fc" } },
  { id: "lupin", name: "Lupin", desc: "Farines spéciales ou additifs de boulangerie (Pitas, pains)", color: { bg: "#f8fafc", text: "#334155", border: "#cbd5e1" } },
  { id: "mollusques", name: "Mollusques", desc: "Calmars, moules, escargots", color: { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" } }
];