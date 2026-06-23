// Base de données complète enrichie depuis la carte PDF - Le Paradis du Fruit
// Version v13 : données de révision alignées avec la carte PDF, quiz renforcé et allergènes non officiels côté application.
window.SECTIONS = {
  "plats": {
    "label": "🍽️ Les Plats",
    "color": "#e8763a",
    "categories": {
      "pitas": {
        "label": "Bonjour Paradis ! Pitas Toastées",
        "emoji": "🫓",
        "items": [
          {
            "name": "Tartinade de thon au citron confit",
            "ingredients": [
              "Pita toastée",
              "Thon Listao",
              "Citron confit",
              "Céleri",
              "Poivron"
            ],
            "memo": "⚠️ Tartinade de thon = contient du céleri et du poivron. Version servie en pita toastée."
          },
          {
            "name": "Dinde fumée, pomme et Cheddar fondu",
            "ingredients": [
              "Pita toastée",
              "Chiffonnade de dinde fumée",
              "Pomme",
              "Cheddar fondu"
            ],
            "memo": "🦃 Profil dinde + pomme + cheddar fondu. Existe aussi en mini pita dans les saveurs."
          },
          {
            "name": "Saumon fumé, Cream Cheese et aneth",
            "ingredients": [
              "Pita toastée",
              "Saumon fumé",
              "Cream Cheese",
              "Aneth"
            ],
            "memo": "🇳🇴 Esprit bagel nordique : saumon fumé, cream cheese et aneth."
          },
          {
            "name": "Crémeux de Chèvre, miel, noix et épinards",
            "ingredients": [
              "Pita toastée",
              "Crémeux de chèvre",
              "Miel",
              "Noix",
              "Pousses d'épinard"
            ],
            "memo": "🐐 Chèvre + miel + noix + épinards : association douce, fraîche et croustillante."
          },
          {
            "name": "Crémeux de poulet miel & curry, poivrons et Cheddar",
            "ingredients": [
              "Pita toastée",
              "Crémeux de poulet miel & curry",
              "Poivrons",
              "Cheddar fondu"
            ],
            "memo": "🍛 Poulet curry, poivrons et cheddar chaud. Une des pitas les plus gourmandes."
          },
          {
            "name": "Mozzarella Fior Di Latte, pistou, poivron rôti",
            "ingredients": [
              "Pita toastée",
              "Mozzarella Fior di Latte",
              "Pistou",
              "Poivron rôti",
              "Roquette",
              "Chutney de tomates"
            ],
            "memo": "🇮🇹 Vert, blanc, rouge : pistou/roquette, mozzarella, poivron/tomate."
          },
          {
            "name": "Planche de 3 Pitas",
            "ingredients": [
              "3 pitas toastées au choix",
              "À partager ou pas"
            ],
            "memo": "🧩 Le client choisit 3 pitas parmi les recettes Bonjour Paradis."
          }
        ]
      },
      "avocado": {
        "label": "Avocado Toast Party",
        "emoji": "🥑",
        "items": [
          {
            "name": "Le Veggie",
            "ingredients": [
              "Double tartines de focaccia",
              "Avocat frais en tranches",
              "2 œufs pochés",
              "Feta",
              "Grenade",
              "Multigraines",
              "Mesclun de salades",
              "Vinaigrette aux agrumes"
            ],
            "memo": "🌱 Version sans viande : œufs pochés, feta, grenade et multigraines sur focaccia."
          },
          {
            "name": "Le Saumon",
            "ingredients": [
              "Double tartines de focaccia",
              "Avocat frais en tranches",
              "Courgettes marinées",
              "Cream Cheese à l'aneth",
              "Saumon fumé"
            ],
            "memo": "🐟 Version saumon : avocat, courgettes, cream cheese aneth et saumon fumé."
          }
        ]
      },
      "salades": {
        "label": "La vie est belle en Salade",
        "emoji": "🥗",
        "items": [
          {
            "name": "Base Méli-mélo de salade",
            "ingredients": [
              "Salade romaine",
              "Tomates cerises",
              "Edamames",
              "Julienne de carottes",
              "Persil",
              "Ciboulette",
              "Focaccia au pistou"
            ],
            "memo": "🥬 Base commune des salades : romaine, tomates, edamames, carottes, herbes et focaccia au pistou."
          },
          {
            "name": "Paradis Bonheur",
            "ingredients": [
              "Méli-mélo de salade",
              "Poulet mariné aux 4 épices",
              "Ananas",
              "Sésame",
              "Oignons frits",
              "Menthe",
              "Sauce thaï"
            ],
            "memo": "🌏 Twist asiatique : poulet 4 épices, ananas, sésame, menthe et sauce thaï."
          },
          {
            "name": "Caesar au Paradis",
            "ingredients": [
              "Méli-mélo de salade",
              "Crispy de poulet",
              "Œuf dur",
              "Croûtons de focaccia",
              "Grana Padano AOP",
              "Sauce Caesar"
            ],
            "memo": "🏛️ Caesar revisitée avec crispy, œuf dur, croûtons de focaccia et Grana Padano."
          },
          {
            "name": "Tutti Salata",
            "ingredients": [
              "Méli-mélo de salade",
              "Melon",
              "Pastèque",
              "Feta marinée",
              "Ananas",
              "Fruit de la passion",
              "Grenade",
              "Vinaigrette aux agrumes"
            ],
            "memo": "🎉 Salade très fruitée : melon, pastèque, ananas, passion et grenade avec feta."
          },
          {
            "name": "Mama Saumon",
            "ingredients": [
              "Méli-mélo de salade",
              "2 brochettes de saumon",
              "Ananas",
              "Grenade",
              "Sauce gravlax"
            ],
            "memo": "🐟 Deux brochettes de saumon avec ananas, grenade et sauce gravlax."
          },
          {
            "name": "Pistou Presto",
            "ingredients": [
              "Méli-mélo de salade",
              "Burrata fondante",
              "Tomates d'antan",
              "Courgettes marinées",
              "Pistou",
              "Focaccia"
            ],
            "memo": "🇮🇹 Burrata fondante + tomates d’antan + courgettes + pistou + focaccia."
          }
        ]
      },
      "chaud_toast": {
        "label": "Chaud le Toast !",
        "emoji": "🍞",
        "items": [
          {
            "name": "Goody Woody",
            "ingredients": [
              "Toasts croustillants",
              "Crémeux de poulet miel & curry",
              "Pousses d'épinard",
              "Tomates cerises mi-séchées",
              "Poivrons",
              "Maïs",
              "Cheddar fondu",
              "Pommes frites"
            ],
            "memo": "🔥 Correction importante : ce n’est pas un burger. C’est un toast croustillant servi avec frites. Option : sauce cheddar en plus."
          },
          {
            "name": "C'Bon",
            "ingredients": [
              "Toasts croustillants",
              "Tartinade de thon",
              "Mozzarella Fior di Latte",
              "Pistou",
              "Courgette",
              "Poivron rôti",
              "Tomates cerises mi-séchées",
              "Maïs",
              "Pommes frites"
            ],
            "memo": "🆕 Toast thon + mozza + pistou + légumes, servi avec pommes frites."
          },
          {
            "name": "Banquise Sauvage",
            "ingredients": [
              "Toasts croustillants",
              "Tartinade de saumon à l'aneth",
              "Saumon fumé",
              "Pousses d'épinard",
              "Œuf poché",
              "Pommes frites"
            ],
            "memo": "❄️ Toast saumon + œuf poché. Option : saumon fumé en plus, encore meilleur avec avocat."
          },
          {
            "name": "Deli Mix Pastrami",
            "ingredients": [
              "Toasts croustillants",
              "Chiffonnade de dinde",
              "Pastrami de bœuf aux épices douces",
              "Cheddar fondu",
              "Cornichons",
              "Oignons rouges",
              "Moutarde au miel",
              "Coleslaw",
              "Pommes frites"
            ],
            "memo": "🥩 Toast dinde + pastrami + cheddar + cornichons + moutarde au miel. Option : double pastrami."
          }
        ]
      },
      "street_paradis": {
        "label": "Street Paradis",
        "emoji": "🍔",
        "items": [
          {
            "name": "Fish & Chips",
            "ingredients": [
              "Merlu du Cap croustillant",
              "Pommes frites",
              "Mesclun de salades",
              "Sauce tartare"
            ],
            "memo": "🐟 À ne pas confondre : ici c’est merlu du Cap, tandis que la saveur 17 est une mini limande."
          },
          {
            "name": "Pastrami Burger",
            "ingredients": [
              "Pain au curcuma et aux graines",
              "Pastrami de bœuf aux épices douces",
              "Sauce Cheddar",
              "Tomate",
              "Oignon rouge",
              "Mesclun",
              "Sauce tartare",
              "Sauce barbecue",
              "Pommes frites"
            ],
            "memo": "🆕 Burger pastrami : pain curcuma/graines, cheddar, tartare + barbecue."
          },
          {
            "name": "Veggie Burger",
            "ingredients": [
              "Pain au curcuma et aux graines",
              "Galette de petits pois",
              "Tomate",
              "Salade romaine",
              "Cheddar",
              "Avocat",
              "Oignon rouge",
              "Sauce tartare",
              "Pommes frites"
            ],
            "memo": "🌱 Burger végétarien avec galette de petits pois, cheddar et avocat."
          },
          {
            "name": "Sir Homard Lobster",
            "ingredients": [
              "Pain brioché",
              "Chair de homard américain",
              "Poissons",
              "Coleslaw",
              "Avocat",
              "Pousses d'épinard",
              "Mayonnaise homard",
              "Pommes frites"
            ],
            "memo": "🦞 Lobster roll : homard + poissons + coleslaw + avocat + mayonnaise homard."
          }
        ]
      },
      "marmites": {
        "label": "Les Marmites Magiques !",
        "emoji": "🍲",
        "items": [
          {
            "name": "Dolce Paradisio",
            "ingredients": [
              "Gnocchis de pomme de terre",
              "Chutney de tomates",
              "Crème liquide",
              "Mozzarella Fior di Latte",
              "Brunoise de carottes",
              "Courgettes",
              "Tomates cerises mi-séchées",
              "Grana Padano AOP",
              "Olives Taggiasche",
              "Mesclun",
              "Vinaigrette aux agrumes"
            ],
            "memo": "🆕 Marmite de gnocchis crémeuse, tomate, mozzarella, Grana Padano et olives."
          },
          {
            "name": "Citron Beldi",
            "ingredients": [
              "Poulet au citron confit",
              "Poivron",
              "Aubergine",
              "Courgette",
              "Olives Taggiasche",
              "Amandes effilées",
              "Persil",
              "Quinoa & boulgour à la menthe fraîche",
              "Sauce thaï"
            ],
            "memo": "🍋 Marmite façon beldi/tajine : poulet citron confit, légumes, olives, amandes, quinoa-boulgour."
          },
          {
            "name": "Mama Corail",
            "ingredients": [
              "Dos de merlu",
              "Crevettes",
              "Sauce tom yum",
              "Ananas poêlés",
              "Haricots verts",
              "Carottes jaunes et oranges",
              "Courgette",
              "Amandes effilées",
              "Riz vapeur aux petits légumes"
            ],
            "memo": "🪸 Marmite merlu + crevettes + sauce tom yum + ananas poêlé + riz vapeur."
          }
        ]
      },
      "brunch": {
        "label": "Brunch & Formules",
        "emoji": "🥞",
        "items": [
          {
            "name": "Dans ta Bulle XXL",
            "ingredients": [
              "Tonic",
              "Touche d'amertume",
              "Citron jaune ou Concombre ou Orange fraîchement pressée ou Ananas-Verveine ou Framboise-Cranberry-Hibiscus"
            ],
            "memo": "🫧 Bulle 45cl utilisée dans les formules midi et brunch."
          },
          {
            "name": "Brunch - Jus d'orange ou pamplemousse",
            "ingredients": [
              "Jus d'orange fraîchement pressé 27cl",
              "Ou jus de pamplemousse fraîchement pressé 27cl"
            ],
            "memo": "🍊 Boisson fraîche du brunch."
          },
          {
            "name": "Brunch - Boisson chaude",
            "ingredients": [
              "Cappuccino",
              "Latte",
              "Chocolat chaud"
            ],
            "memo": "☕ Boisson chaude du brunch. Chocolat chaud avec supplément indiqué sur la carte."
          },
          {
            "name": "Brunch - Découpe d'ananas frais",
            "ingredients": [
              "Ananas frais découpé"
            ],
            "memo": "🍍 Élément fruité du brunch."
          },
          {
            "name": "Brunch - Brouillade d'œufs",
            "ingredients": [
              "Brouillade d'œufs",
              "Focaccia toastée",
              "Saumon fumé ou chiffonnade de pastrami ou slices d'avocat"
            ],
            "memo": "🥚 Option salée du brunch : brouillade sur focaccia avec saumon, pastrami ou avocat."
          },
          {
            "name": "Brunch - Pancakes minute du Paradis",
            "ingredients": [
              "2 pancakes minute",
              "Sauce choco-Nutella",
              "American Syrup"
            ],
            "memo": "🥞 Option sucrée du brunch : 2 pancakes + double sauce."
          },
          {
            "name": "Super All Day Brunch",
            "ingredients": [
              "Brouillade d'œufs",
              "Pancakes minute"
            ],
            "memo": "🌞 Version complète : brouillade d'œufs + pancakes minute."
          }
        ]
      }
    }
  },
  "saveurs": {
    "label": "🎯 Les 23 Saveurs",
    "color": "#2d7d46",
    "categories": {
      "assiettes": {
        "label": "Vos 23 Saveurs pour Assiettes",
        "emoji": "🔢",
        "items": [
          {
            "name": "1. Camembert croustillant au sésame",
            "ingredients": [
              "Camembert croustillant",
              "Graines de sésame"
            ],
            "memo": "🧀 Fromage chaud pané/croustillant au sésame."
          },
          {
            "name": "2. Tartinade de thon au citron confit et blini",
            "ingredients": [
              "Tartinade de thon",
              "Thon Listao",
              "Citron confit",
              "Céleri",
              "Poivron",
              "Blini chaud"
            ],
            "memo": "⚠️ Tartinade de thon = céleri + poivron + Thon Listao."
          },
          {
            "name": "3. Crémeux de poulet miel & curry et focaccia",
            "ingredients": [
              "Crémeux de poulet miel & curry",
              "Focaccia"
            ],
            "memo": "🐔 Saveur à tartiner, servie avec focaccia."
          },
          {
            "name": "4. Tartinade de saumon à l'aneth et blini",
            "ingredients": [
              "Tartinade de saumon à l'aneth",
              "Blini chaud"
            ],
            "memo": "🌿 Saumon à l’aneth + blini chaud."
          },
          {
            "name": "5. Pita toastée Chèvre Miel Noix Épinards",
            "ingredients": [
              "Pita toastée",
              "Crémeux de chèvre",
              "Miel",
              "Noix",
              "Pousses d'épinard"
            ],
            "memo": "🐐 Mini version de la pita chèvre miel."
          },
          {
            "name": "6. Pita toastée Thon Citron Confit",
            "ingredients": [
              "Pita toastée",
              "Tartinade de thon",
              "Thon Listao",
              "Citron confit",
              "Céleri",
              "Poivron"
            ],
            "memo": "🐟 Version pita de la tartinade thon citron confit."
          },
          {
            "name": "7. Œufs durs, mayonnaise à la truffe d'été",
            "ingredients": [
              "Œufs durs",
              "Mayonnaise parfumée à la truffe d'été",
              "Ciboulette"
            ],
            "memo": "👑 Précision carte : truffe d'été Tuber aestivum."
          },
          {
            "name": "8. Crispy de poulet aux céréales",
            "ingredients": [
              "Crispy de poulet aux céréales",
              "Sauce spicy mayo"
            ],
            "memo": "💥 Poulet croustillant aux céréales + spicy mayo."
          },
          {
            "name": "9. Pita toastée Dinde Cheddar",
            "ingredients": [
              "Pita toastée",
              "Dinde fumée",
              "Pomme",
              "Cheddar fondu"
            ],
            "memo": "🦃 Dinde, pomme et cheddar fondu."
          },
          {
            "name": "10. Pita toastée Poulet Curry",
            "ingredients": [
              "Pita toastée",
              "Poulet miel & curry",
              "Poivrons",
              "Cheddar"
            ],
            "memo": "🍛 Pita chaude poulet curry + poivrons + cheddar."
          },
          {
            "name": "11. 2 Brochettes de poulet marinées",
            "ingredients": [
              "2 brochettes de poulet marinées",
              "Façon Le Paradis du Fruit"
            ],
            "memo": "🔥 Deux brochettes de poulet marinées."
          },
          {
            "name": "12. Mini salade Caesar",
            "ingredients": [
              "Mini salade Caesar",
              "Crispy de poulet",
              "Grana Padano AOP",
              "Sauce Caesar"
            ],
            "memo": "🏛️ Mini Caesar avec crispy, Grana Padano et sauce Caesar."
          },
          {
            "name": "13. Pastèque, Feta marinée et menthe fraîche",
            "ingredients": [
              "Pastèque en dés",
              "Feta marinée",
              "Menthe fraîche"
            ],
            "memo": "🍉 Saveur fraîche et estivale."
          },
          {
            "name": "14. Melon jaune, Mozzarella Fior di Latte et pistou",
            "ingredients": [
              "Melon jaune en dés",
              "Mozzarella Fior di Latte",
              "Pistou"
            ],
            "memo": "🍈 Melon jaune + mozzarella + pistou."
          },
          {
            "name": "15. Demi avocat, vinaigrette aux agrumes",
            "ingredients": [
              "1/2 avocat",
              "Vinaigrette aux agrumes",
              "Herbes fraîches"
            ],
            "memo": "🥑 Demi avocat assaisonné agrumes et herbes."
          },
          {
            "name": "16. Mozzarella Fior Di Latte, tomates multicolores",
            "ingredients": [
              "Mozzarella Fior di Latte",
              "Tomates multicolores",
              "Condiment tomate-aneth"
            ],
            "memo": "🍅 Mozzarella, tomates multicolores et condiment tomate-aneth."
          },
          {
            "name": "17. Mini Fish & Chips limande",
            "ingredients": [
              "Mini Fish & Chips",
              "Limande",
              "Sauce tartare"
            ],
            "memo": "🐟 Attention : saveur assiette = limande, pas merlu du Cap."
          },
          {
            "name": "18. Pita toastée Mozza Pistou Poivron",
            "ingredients": [
              "Pita toastée",
              "Mozzarella Fior di Latte",
              "Pistou",
              "Poivron rôti",
              "Roquette",
              "Chutney de tomates"
            ],
            "memo": "🇮🇹 Mini pita caprese chaude."
          },
          {
            "name": "19. Saumon fumé, sauce crémeuse à l'aneth et blini",
            "ingredients": [
              "Saumon fumé",
              "Sauce crémeuse à l'aneth",
              "Blini chaud"
            ],
            "memo": "🇳🇴 Saumon fumé + sauce aneth + blini."
          },
          {
            "name": "20. Crevettes panko croustillantes",
            "ingredients": [
              "Crevettes panko croustillantes",
              "Sauce sweet chili"
            ],
            "memo": "🍤 Crevettes panées panko + sweet chili."
          },
          {
            "name": "21. Pita toastée Saumon Cream Cheese",
            "ingredients": [
              "Pita toastée",
              "Saumon fumé",
              "Cream Cheese",
              "Aneth"
            ],
            "memo": "🥯 Pita saumon façon bagel."
          },
          {
            "name": "22. 2 Brochettes de saumon au sésame",
            "ingredients": [
              "2 brochettes de saumon",
              "Graines de sésame",
              "Sauce gravlax"
            ],
            "memo": "🔥 Saumon + sésame + sauce gravlax."
          },
          {
            "name": "23. Demi avocat aux crevettes",
            "ingredients": [
              "1/2 avocat",
              "Crevettes",
              "Sauce spicy mayo"
            ],
            "memo": "🥑 Avocat + crevettes + spicy mayo."
          }
        ]
      },
      "accompagnements": {
        "label": "Vos Accompagnements",
        "emoji": "🥙",
        "items": [
          {
            "name": "Liste réglementaire des côtés",
            "ingredients": [
              "Pommes frites",
              "Riz vapeur aux petits légumes",
              "Coleslaw",
              "Mesclun et vinaigrette aux agrumes",
              "Haricots verts croustillants aux épices cajun",
              "Quinoa & boulgour à la menthe fraîche et sauce thaï"
            ],
            "memo": "🔢 Rappel : 1=Frites, 2=Riz, 3=Coleslaw, 4=Mesclun, 5=Cajun, 6=Quinoa-boulgour."
          },
          {
            "name": "1. Pommes frites",
            "ingredients": [
              "Pommes frites",
              "Sauce cheddar en option"
            ],
            "memo": "🍟 Mention carte : avec sauce cheddar pour les gourmands."
          },
          {
            "name": "2. Riz vapeur aux petits légumes",
            "ingredients": [
              "Riz vapeur",
              "Petits légumes"
            ],
            "memo": "🍚 Accompagnement chaud."
          },
          {
            "name": "3. Coleslaw",
            "ingredients": [
              "Chou",
              "Pomme",
              "Mayonnaise",
              "Carotte",
              "Raisins sec",
              "Citron"
            ],
            "memo": "🥬 Accompagnement froid type salade de chou, carotte, pomme, citron, mayonnaise et raisins sec. En cas d’allergie, vérifier la fiche officielle avant de répondre."
          },
          {
            "name": "4. Mesclun et vinaigrette aux agrumes",
            "ingredients": [
              "Mesclun",
              "Vinaigrette aux agrumes"
            ],
            "memo": "🌿 Option légère."
          },
          {
            "name": "5. Haricots verts croustillants cajun",
            "ingredients": [
              "Haricots verts croustillants",
              "Épices cajun"
            ],
            "memo": "🌶️ Accompagnement épicé/croustillant."
          },
          {
            "name": "6. Quinoa & boulgour à la menthe fraîche",
            "ingredients": [
              "Quinoa",
              "Boulgour",
              "Menthe fraîche",
              "Sauce thaï"
            ],
            "memo": "🌾 Accompagnement healthy, mais contient boulgour donc gluten."
          }
        ]
      },
      "formules": {
        "label": "Formules Assiettes",
        "emoji": "🍱",
        "items": [
          {
            "name": "Adam & Eve",
            "ingredients": [
              "2 saveurs au choix",
              "1 accompagnement au choix"
            ],
            "memo": "🍱 Formule assiette : 2 saveurs + 1 accompagnement."
          },
          {
            "name": "Paradis Terrestre",
            "ingredients": [
              "3 saveurs au choix",
              "1 accompagnement au choix"
            ],
            "memo": "🍱 Formule assiette : 3 saveurs + 1 accompagnement."
          },
          {
            "name": "Paradis Céleste",
            "ingredients": [
              "4 saveurs au choix",
              "1 accompagnement au choix"
            ],
            "memo": "🍱 Formule assiette : 4 saveurs + 1 accompagnement."
          },
          {
            "name": "Paradis du Paradis",
            "ingredients": [
              "Plateau géant de 8 saveurs préférées",
              "Pommes frites",
              "Coleslaw"
            ],
            "memo": "👯 À partager, idéal pour 2."
          },
          {
            "name": "Formule midi + Choisis ta bulle",
            "ingredients": [
              "Adam & Eve ou Paradis Terrestre ou Paradis Céleste",
              "Dans ta Bulle 45cl"
            ],
            "memo": "⏰ Formules midi : de 11h30 à 15h00, du lundi au vendredi, hors jours fériés."
          }
        ]
      }
    }
  },
  "boissons": {
    "label": "🍹 Les Boissons",
    "color": "#2a9d8f",
    "categories": {
      "presses": {
        "label": "Pressés Minute & Détox",
        "emoji": "🍋",
        "items": [
          {
            "name": "Citron Pressé 10cl",
            "ingredients": [
              "Citron jaune pressé",
              "Eau",
              "Sucre en poudre"
            ],
            "memo": "🍋 Servi avec eau et sucre en poudre."
          },
          {
            "name": "Grand Soleil 40cl",
            "ingredients": [
              "Orange ou pamplemousse"
            ],
            "memo": "☀️ Fruit pressé à la demande, sans sucre ajouté."
          },
          {
            "name": "Double Force 40cl",
            "ingredients": [
              "Pomme Bio",
              "Ananas",
              "Basilic",
              "Tige de céleri"
            ],
            "memo": "🍏 Accompagné d'une tige de céleri selon la note 3 de la carte."
          },
          {
            "name": "Apple Bunny 40cl",
            "ingredients": [
              "Pomme Bio",
              "Carotte",
              "Tige de céleri"
            ],
            "memo": "🥕 Apple Bunny = Pomme Lapin. Accompagné d’une tige de céleri."
          },
          {
            "name": "Tornade Santé 40cl",
            "ingredients": [
              "Pomme Bio",
              "Concombre",
              "Menthe",
              "Tige de céleri"
            ],
            "memo": "🌪️ Cocktail d’antioxydants, minéraux et vitamines, servi avec tige de céleri."
          },
          {
            "name": "Potion Magique 40cl",
            "ingredients": [
              "Carotte",
              "Ananas",
              "Coriandre",
              "Tige de céleri"
            ],
            "memo": "🪄 Pressé/détox carotte, ananas, coriandre, servi avec tige de céleri."
          },
          {
            "name": "Caro’T Detox 40cl",
            "ingredients": [
              "Carotte",
              "Orange",
              "Gingembre"
            ],
            "memo": "🥕 Plein d’antioxydants et vitamine C."
          },
          {
            "name": "Green Attitude 40cl",
            "ingredients": [
              "Pomme Bio",
              "Kiwi",
              "Menthe",
              "Tige de céleri"
            ],
            "memo": "🟢 Green = vert. Servi avec tige de céleri."
          },
          {
            "name": "Super Green 40cl",
            "ingredients": [
              "Épinard",
              "Kale",
              "Pomme Bio",
              "Persil",
              "Tige de céleri"
            ],
            "memo": "🥬 Version verte complète : épinard, kale, pomme bio, persil, céleri."
          },
          {
            "name": "Veggie Detox 40cl",
            "ingredients": [
              "Concombre",
              "Kale",
              "Menthe",
              "Jus aloe vera"
            ],
            "memo": "🥬 Piège carte : présence de sucre dans le jus aloe vera."
          },
          {
            "name": "Shoot de gingembre 2cl",
            "ingredients": [
              "Gingembre"
            ],
            "memo": "⚡ Booster optionnel pour cocktail."
          }
        ]
      },
      "cocktails_stars": {
        "label": "Cocktails Stars Sans Alcool (35cl - 45cl)",
        "emoji": "⭐",
        "items": [
          {
            "name": "Vitaminé",
            "ingredients": [
              "Citron",
              "Orange",
              "Pamplemousse",
              "Kiwi"
            ],
            "memo": "🥝 Plein de vitamine C : agrumes + kiwi."
          },
          {
            "name": "Rouge Parfait",
            "ingredients": [
              "Framboise",
              "Fraise",
              "Ananas"
            ],
            "memo": "🍓 Rouge, doux et fruité."
          },
          {
            "name": "Yoyo Corail",
            "ingredients": [
              "Banane",
              "Mangue",
              "Fraise",
              "Yolita"
            ],
            "memo": "🍦 Contient du Yolita, glace goût yaourt."
          },
          {
            "name": "Rose Paradis",
            "ingredients": [
              "Fraise",
              "Banane",
              "Orange",
              "Citron"
            ],
            "memo": "🌹 Fraise-banane réveillé par orange et citron."
          },
          {
            "name": "Mangue Énergie",
            "ingredients": [
              "Mangue",
              "Clémentine corse",
              "Citron vert"
            ],
            "memo": "🥭 Mangue + clémentine corse + citron vert, riche en vitamine C."
          },
          {
            "name": "La Panthère Rose",
            "ingredients": [
              "Framboise",
              "Litchi",
              "Grenade"
            ],
            "memo": "🐆 Floral et fruité grâce au litchi."
          },
          {
            "name": "Verger Tropical",
            "ingredients": [
              "Pêche jaune",
              "Abricot",
              "Fruit de la passion"
            ],
            "memo": "🍑 Fruits du verger + passion."
          },
          {
            "name": "Caresse Antillaise",
            "ingredients": [
              "Goyave",
              "Ananas-verveine",
              "Citron vert"
            ],
            "memo": "🏝️ Carte : goyave, ananas-verveine, citron vert."
          },
          {
            "name": "Fleur d'Asie",
            "ingredients": [
              "Litchi",
              "Framboise-cranberry-hibiscus"
            ],
            "memo": "🌺 Carte : litchi, framboise-cranberry-hibiscus."
          },
          {
            "name": "Joséphine Baker",
            "ingredients": [
              "Fruit de la passion",
              "Mangue",
              "Noix de coco"
            ],
            "memo": "💃 Icône tropicale : passion, mangue, coco."
          }
        ]
      },
      "cocktails_composer": {
        "label": "Cocktails à Composer (35cl - 45cl)",
        "emoji": "🧪",
        "items": [
          {
            "name": "Yoyo à composer",
            "ingredients": [
              "Yolita Frozen Yogurt",
              "1 ou 2 parfums au choix"
            ],
            "memo": "🍦 Base Yoyo = Yolita Frozen Yogurt. Note 5 : glace goût yaourt."
          },
          {
            "name": "Fruit à composer",
            "ingredients": [
              "Base fruit au choix",
              "1 ou 2 parfums au choix"
            ],
            "memo": "🍓 Base fruit, sans lait."
          },
          {
            "name": "Milk à composer",
            "ingredients": [
              "Base au lait",
              "1 ou 2 parfums au choix"
            ],
            "memo": "🥛 Base lactée."
          },
          {
            "name": "Vegan à composer",
            "ingredients": [
              "Boisson végétale",
              "1 ou 2 parfums au choix"
            ],
            "memo": "🌱 Base vegan à la boisson végétale."
          },
          {
            "name": "Parfums à composer",
            "ingredients": [
              "Goyave",
              "Ananas",
              "Avocat",
              "Banane",
              "Carotte",
              "Noix de Coco",
              "Fraise",
              "Framboise",
              "Grenade",
              "Kiwi",
              "Litchi",
              "Mangue",
              "Abricot",
              "Orange",
              "Passion",
              "Pêche jaune",
              "Framboise-cranberry-hibiscus",
              "Ananas-verveine",
              "Clémentine corse"
            ],
            "memo": "🔢 Liste complète des 19 parfums, avec fruit supplémentaire possible."
          }
        ]
      },
      "bulles": {
        "label": "Dans ta Bulle XXL (45cl)",
        "emoji": "🫧",
        "items": [
          {
            "name": "Bulle Citron jaune",
            "ingredients": [
              "Tonic",
              "Touche d'amertume",
              "Citron jaune"
            ],
            "memo": "🫧 Parfait pour accompagner la pause déj."
          },
          {
            "name": "Bulle Concombre",
            "ingredients": [
              "Tonic",
              "Touche d'amertume",
              "Concombre"
            ],
            "memo": "🥒 Version fraîche."
          },
          {
            "name": "Bulle Orange fraîchement pressée",
            "ingredients": [
              "Tonic",
              "Touche d'amertume",
              "Orange fraîchement pressée"
            ],
            "memo": "🍊 Version agrume doux."
          },
          {
            "name": "Bulle Ananas-Verveine",
            "ingredients": [
              "Tonic",
              "Touche d'amertume",
              "Ananas-verveine"
            ],
            "memo": "🍍 Purée de fruits à base de sucre équitable."
          },
          {
            "name": "Bulle Framboise-Cranberry-Hibiscus",
            "ingredients": [
              "Tonic",
              "Touche d'amertume",
              "Framboise-cranberry-hibiscus"
            ],
            "memo": "🌺 Purée de fruits à base de sucre équitable."
          }
        ]
      },
      "granites": {
        "label": "Granités Paradis (40cl)",
        "emoji": "❄️",
        "items": [
          {
            "name": "Lemon Nana",
            "ingredients": [
              "Citron jaune",
              "Feuilles de menthe"
            ],
            "memo": "🌿 Granité citron jaune + menthe."
          },
          {
            "name": "Rouge Orangeade",
            "ingredients": [
              "Fraise",
              "Orange"
            ],
            "memo": "🍓 Granité fraise-orange."
          },
          {
            "name": "Passiflora",
            "ingredients": [
              "Fruit de la passion",
              "Citron vert"
            ],
            "memo": "🧪 Granité passion-citron vert."
          }
        ]
      },
      "elixirs": {
        "label": "Elixirs XXL du Paradis (40cl)",
        "emoji": "🧊",
        "items": [
          {
            "name": "Green Ice’T",
            "ingredients": [
              "Thé vert glacé",
              "Menthe fraîche"
            ],
            "memo": "🟢 Thé vert glacé à la menthe fraîche."
          },
          {
            "name": "Cure Détox",
            "ingredients": [
              "Grenade",
              "Cranberry",
              "Fruits rouges"
            ],
            "memo": "🔴 Concentré de vitamine C et d’antioxydants."
          }
        ]
      },
      "spritz": {
        "label": "Spritz Paradis (25cl)",
        "emoji": "🍹",
        "items": [
          {
            "name": "Spritz Original",
            "ingredients": [
              "Aperol",
              "Prosecco Martini",
              "Eau pétillante"
            ],
            "memo": "🇮🇹 Original : Aperol, Prosecco Martini, eau pétillante."
          },
          {
            "name": "Hugo Spritz",
            "ingredients": [
              "Liqueur St-Germain",
              "Prosecco Martini",
              "Eau pétillante"
            ],
            "memo": "🥂 Hugo : sureau St-Germain + Prosecco Martini."
          },
          {
            "name": "Pink Spritz",
            "ingredients": [
              "Aperol",
              "Prosecco Martini",
              "Sirop de pamplemousse",
              "Eau pétillante"
            ],
            "memo": "🍹 Pink = pamplemousse rose."
          },
          {
            "name": "Passion Spritz",
            "ingredients": [
              "Aperol",
              "Prosecco Martini",
              "Fruit de la passion",
              "Eau pétillante"
            ],
            "memo": "🧪 Spritz exotique à la passion."
          }
        ]
      },
      "margaritas_daiquiris": {
        "label": "Margaritas & Daïquiris (25cl)",
        "emoji": "🍸",
        "items": [
          {
            "name": "Margarita Originale",
            "ingredients": [
              "Tequila Camino Real",
              "Triple sec",
              "Citron vert"
            ],
            "memo": "🇲🇽 Original Margarita : tequila, triple sec, citron vert."
          },
          {
            "name": "Margarita Mangue",
            "ingredients": [
              "Tequila Camino Real",
              "Sorbet mangue Alphonso d'Inde"
            ],
            "memo": "🥭 Tequila + sorbet mangue Alphonso d’Inde."
          },
          {
            "name": "Danse Joséphine",
            "ingredients": [
              "Rhum Bacardi Carta Oro",
              "Mangue",
              "Fruit de la passion",
              "Noix de coco"
            ],
            "memo": "💃 Version alcoolisée de la Joséphine Baker."
          },
          {
            "name": "Daiquiri Passion & Framboise",
            "ingredients": [
              "Rhum Bacardi Carta Oro",
              "Sorbet framboise-passion du Pérou"
            ],
            "memo": "🍓 Rhum + sorbet framboise-passion du Pérou."
          },
          {
            "name": "Daiquiri Coco",
            "ingredients": [
              "Rhum Bacardi Carta Oro",
              "Glace noix de coco",
              "Lait de coco"
            ],
            "memo": "🥥 Rhum + glace noix de coco au lait de coco."
          }
        ]
      },
      "mojitos": {
        "label": "Mojitos Paradis",
        "emoji": "🍃",
        "items": [
          {
            "name": "Apple Virgin Mojito 35cl",
            "ingredients": [
              "Pomme",
              "Menthe",
              "Citron vert",
              "Sans alcool"
            ],
            "memo": "🍏 Mojito sans alcool à la pomme."
          },
          {
            "name": "Apple Virgin Mojito Fruit 35cl",
            "ingredients": [
              "Pomme",
              "Menthe",
              "Citron vert",
              "Fruit au choix : fraise ou framboise ou passion ou mangue",
              "Sans alcool"
            ],
            "memo": "🍓 Version fruitée sans alcool : fraise, framboise, passion ou mangue."
          },
          {
            "name": "Mojito 27cl",
            "ingredients": [
              "Rhum Bacardi Carta Oro",
              "Menthe",
              "Citron vert"
            ],
            "memo": "🍃 Mojito alcoolisé au rhum Bacardi Carta Oro."
          },
          {
            "name": "Mojito Fruit 27cl",
            "ingredients": [
              "Rhum Bacardi Carta Oro",
              "Menthe",
              "Citron vert",
              "Fruit au choix : fraise ou framboise ou passion ou mangue"
            ],
            "memo": "🍓 Mojito fruit avec rhum Bacardi Carta Oro."
          }
        ]
      },
      "pina_coladas": {
        "label": "Pina Coladas (25cl)",
        "emoji": "🍍",
        "items": [
          {
            "name": "Pina Colada Originale",
            "ingredients": [
              "Rhum Bacardi Carta Oro",
              "Ananas",
              "Noix de coco"
            ],
            "memo": "🍍 Originale : rhum, ananas, coco."
          },
          {
            "name": "Pina Colada La Fragola",
            "ingredients": [
              "Rhum Bacardi Carta Oro",
              "Ananas",
              "Noix de coco",
              "Fraise"
            ],
            "memo": "🍓 Version fraise de la Pina Colada."
          }
        ]
      },
      "mixologie_fine": {
        "label": "Mixologie Fine",
        "emoji": "🌿",
        "items": [
          {
            "name": "Basilic Instinct 25cl",
            "ingredients": [
              "Gin Bombay Sapphire",
              "Concombre",
              "Basilic",
              "Citron jaune"
            ],
            "memo": "🌿 Cocktail botanique gin, concombre, basilic et citron jaune."
          }
        ]
      },
      "eaux_bieres_vins": {
        "label": "Eaux, Bières, Cidre & Vins",
        "emoji": "🍾",
        "items": [
          {
            "name": "Vittel",
            "ingredients": [
              "Eau minérale Vittel",
              "50cl ou 1L"
            ],
            "memo": "💧 Eau plate."
          },
          {
            "name": "San Pellegrino",
            "ingredients": [
              "Eau pétillante San Pellegrino",
              "50cl ou 1L"
            ],
            "memo": "🫧 Eau pétillante."
          },
          {
            "name": "Gallia Champ Libre",
            "ingredients": [
              "Bière blonde non filtrée",
              "33cl",
              "5,8°"
            ],
            "memo": "🍺 Bouteille 33cl, bière blonde non filtrée."
          },
          {
            "name": "Gallia Nouveau Western IPA",
            "ingredients": [
              "Bière IPA",
              "25cl",
              "Notes d'agrumes",
              "Herbes fraîches",
              "6°"
            ],
            "memo": "🍺 IPA aux notes d’agrumes et herbes fraîches."
          },
          {
            "name": "Cidre La Mordue L'Original",
            "ingredients": [
              "Cidre La Mordue",
              "27.5cl",
              "6°"
            ],
            "memo": "🍏 Cidre bouteille 27,5cl."
          },
          {
            "name": "Vin blanc Belleruche",
            "ingredients": [
              "AOP Côtes du Rhône",
              "M. Chapoutier Belleruche",
              "14cl ou 25cl ou 75cl"
            ],
            "memo": "🍷 Vin blanc, sulfites probables."
          },
          {
            "name": "Vin rouge Belleruche",
            "ingredients": [
              "AOP Côtes du Rhône",
              "M. Chapoutier Belleruche",
              "14cl ou 25cl ou 75cl"
            ],
            "memo": "🍷 Vin rouge, sulfites probables."
          },
          {
            "name": "Vin rosé Orsuro",
            "ingredients": [
              "AOP Côtes de Provence",
              "Mathilde Chapoutier Orsuro",
              "14cl ou 25cl ou 75cl"
            ],
            "memo": "🌹 Vin rosé, sulfites probables."
          }
        ]
      },
      "chaudes": {
        "label": "Coffee Shop & Thés Bio",
        "emoji": "☕",
        "items": [
          {
            "name": "Expresso, Allongé ou Décaféiné",
            "ingredients": [
              "Café"
            ],
            "memo": "☕ Base coffee shop."
          },
          {
            "name": "Café Noisette",
            "ingredients": [
              "Café",
              "Lait"
            ],
            "memo": "🥛 Contient du lait."
          },
          {
            "name": "Café Américain ou Café au Lait",
            "ingredients": [
              "Café",
              "Eau ou lait"
            ],
            "memo": "☕ Option café au lait = allergène lait."
          },
          {
            "name": "Double Expresso",
            "ingredients": [
              "Double café expresso"
            ],
            "memo": "⚡ Double dose."
          },
          {
            "name": "Cappuccino ou Café Viennois",
            "ingredients": [
              "Café",
              "Lait",
              "Crème fouettée selon version"
            ],
            "memo": "☕ Boisson lactée."
          },
          {
            "name": "Latté Macchiato",
            "ingredients": [
              "Café",
              "Lait chaud"
            ],
            "memo": "🥛 Boisson lactée."
          },
          {
            "name": "L'Incroyable",
            "ingredients": [
              "Chocolat chaud Valrhona",
              "Chamallows",
              "Crème fouettée"
            ],
            "memo": "🍫 Chocolat chaud d’exception Valrhona."
          },
          {
            "name": "Caramelito",
            "ingredients": [
              "Lait chaud",
              "Nutella",
              "Sauce caramel-vanille Paradis",
              "Amandes grillées",
              "Crème fouettée",
              "Carambar"
            ],
            "memo": "🍬 La boisson la plus régressive."
          },
          {
            "name": "Chaï Latté",
            "ingredients": [
              "Lait chaud infusé aux épices indiennes",
              "Crème fouettée",
              "Sauce caramel-vanille Paradis"
            ],
            "memo": "🧡 Chaï latte aux épices indiennes."
          },
          {
            "name": "Matcha",
            "ingredients": [
              "Lait chaud",
              "Thé matcha",
              "Crème fouettée"
            ],
            "memo": "🍵 Matcha latte."
          },
          {
            "name": "Aquarosa",
            "ingredients": [
              "Infusion",
              "Fruits rouges",
              "Hibiscus"
            ],
            "memo": "🌺 Thé/infusion bio."
          },
          {
            "name": "Rooibos Vanille",
            "ingredients": [
              "Rooibos",
              "Vanille"
            ],
            "memo": "🍦 Infusion saveur vanille."
          },
          {
            "name": "Vert Gingembre-Citron",
            "ingredients": [
              "Thé vert",
              "Gingembre",
              "Citron"
            ],
            "memo": "🍋 Thé vert saveur gingembre-citron."
          },
          {
            "name": "BB Detox",
            "ingredients": [
              "Thé vert",
              "Maté",
              "Plantes",
              "Pamplemousse"
            ],
            "memo": "🌿 Mélange de thés vert, maté et plantes, aromatisé pamplemousse."
          },
          {
            "name": "English Breakfast",
            "ingredients": [
              "Thés noirs d'Asie"
            ],
            "memo": "🫖 Mélange de thés noirs."
          },
          {
            "name": "Anastasia",
            "ingredients": [
              "Thé noir",
              "Bergamote",
              "Citron",
              "Fleur d'oranger"
            ],
            "memo": "👑 Signature Kusmi Tea."
          },
          {
            "name": "Thé Vert du Paradis",
            "ingredients": [
              "Thé vert",
              "Menthe fraîche"
            ],
            "memo": "🌿 Thé vert à la menthe fraîche."
          },
          {
            "name": "Option lait / boisson végétale",
            "ingredients": [
              "Lait ou boisson végétale"
            ],
            "memo": "🥛 Supplément possible dans les boissons chaudes."
          }
        ]
      }
    }
  },
  "desserts": {
    "label": "🍰 Les Desserts",
    "color": "#c94f8a",
    "categories": {
      "creations": {
        "label": "Desserts Créations",
        "emoji": "✨",
        "items": [
          {
            "name": "Fondant Cœur Coulant",
            "ingredients": [
              "Fondant au chocolat sans gluten",
              "Crème anglaise",
              "Crème fouettée"
            ],
            "memo": "♥️ Naturellement sans gluten. Option carte : cœur praliné."
          },
          {
            "name": "Salade de Fruits Jolie Jolie",
            "ingredients": [
              "Découpe de fruits préparés minute",
              "Pulpe de passion"
            ],
            "memo": "🍍 Dessert fruité minute."
          },
          {
            "name": "Ma Jolie Mangue",
            "ingredients": [
              "Mangue en dés",
              "Pulpe de passion",
              "Sorbet mangue Alphonso d'Inde"
            ],
            "memo": "🥭 Triple mangue/passion : dés, pulpe et sorbet Alphonso."
          },
          {
            "name": "Açaï Bowl Paradisiaque",
            "ingredients": [
              "Açaï",
              "Yaourt",
              "Fraises",
              "Framboises",
              "Myrtilles",
              "Banane",
              "Muesli croustillant"
            ],
            "memo": "🫐 Bowl frais mais avec yaourt + muesli."
          },
          {
            "name": "Île Meringuée",
            "ingredients": [
              "Tarte au citron",
              "Meringue à l'italienne",
              "Cœur glacé framboise-passion"
            ],
            "memo": "🍋 Tarte citron + meringue italienne + cœur glacé framboise-passion."
          },
          {
            "name": "Ta-Tatin",
            "ingredients": [
              "Tarte caramélisée aux pommes",
              "Crème fraîche",
              "Sauce caramel-vanille Paradis"
            ],
            "memo": "🍎 Tatin pomme + crème fraîche + caramel-vanille."
          },
          {
            "name": "New York Cheesecake",
            "ingredients": [
              "Cheesecake authentique",
              "Purée de mangue",
              "Sauce caramel-vanille Paradis",
              "Crème fouettée"
            ],
            "memo": "🗽 Cheesecake + mangue + caramel-vanille + crème fouettée."
          }
        ]
      },
      "gaufres": {
        "label": "Gaufres Très Gourmandes",
        "emoji": "🧇",
        "items": [
          {
            "name": "Nutella Lover",
            "ingredients": [
              "Gaufre minute",
              "Nutella",
              "Crème fouettée"
            ],
            "memo": "🍫 Gaufre simple et très chocolatée."
          },
          {
            "name": "Dolce Banana",
            "ingredients": [
              "Gaufre minute",
              "Banane",
              "Sauce caramel-vanille Paradis",
              "Crème fouettée"
            ],
            "memo": "🍌 Banane + caramel-vanille + crème fouettée."
          },
          {
            "name": "Ramène ta Fraise",
            "ingredients": [
              "Gaufre minute",
              "Fraises fraîches",
              "Coulis de fruits",
              "Crème fouettée"
            ],
            "memo": "🍓 Gaufre fraises fraîches."
          },
          {
            "name": "Gaufres Géantes à partager",
            "ingredients": [
              "3 gaufres",
              "Sauce choco-Nutella",
              "Compotée de fraises",
              "Découpe de banane",
              "Sauce caramel-vanille Paradis",
              "Crème fouettée"
            ],
            "memo": "👯 Format partage : 3 gaufres géantes."
          }
        ]
      },
      "trop_choux": {
        "label": "Trop Choux !",
        "emoji": "🍨",
        "items": [
          {
            "name": "Beaucoup",
            "ingredients": [
              "P'tit chou",
              "Sorbet fraises Senga et fraises des bois",
              "Fraises des bois",
              "Coulis multi-fruits",
              "Crème fouettée"
            ],
            "memo": "🍓 Trop Choux à la fraise."
          },
          {
            "name": "À la Folie",
            "ingredients": [
              "P'tit chou",
              "Sorbet mangue Alphonso d'Inde",
              "Purée de mangue",
              "Crème fouettée"
            ],
            "memo": "🥭 Trop Choux mangue."
          },
          {
            "name": "Passionnément",
            "ingredients": [
              "P'tit chou",
              "Sorbet framboise et passion du Pérou",
              "Coulis multi-fruits",
              "Crème fouettée"
            ],
            "memo": "🧪 Trop Choux framboise-passion."
          }
        ]
      },
      "pancakes": {
        "label": "Pancakes du Paradis",
        "emoji": "🥞",
        "items": [
          {
            "name": "L'Original",
            "ingredients": [
              "3 pancakes minute",
              "American Syrup",
              "Crème fouettée"
            ],
            "memo": "🥞 Pancakes aux bons œufs frais à la minute."
          },
          {
            "name": "Le Banana",
            "ingredients": [
              "3 pancakes minute",
              "Banane",
              "Sauce caramel-vanille Paradis",
              "Pépites caramélisées",
              "Amandes coco crunch"
            ],
            "memo": "🍌 Version banane + caramel + crunch."
          },
          {
            "name": "Le Crazy Fruit",
            "ingredients": [
              "3 pancakes minute",
              "Multi-fruits",
              "Coulis de fruits"
            ],
            "memo": "🍓 Crazy = dingue. Version fruitée."
          },
          {
            "name": "Le Gourmand",
            "ingredients": [
              "3 pancakes minute",
              "Fraises",
              "Framboises",
              "Myrtilles",
              "Nutella",
              "Pistache crunch"
            ],
            "memo": "🍫 Fruits rouges + Nutella + pistache crunch."
          }
        ]
      },
      "gros_desserts": {
        "label": "Gros Desserts & Gourmands",
        "emoji": "🍫",
        "items": [
          {
            "name": "Chocolat Mon Amour",
            "ingredients": [
              "Gâteau au chocolat servi tiède",
              "Banane caramélisée",
              "Sauce choco-Nutella",
              "Pépites caramélisées",
              "Crème fouettée"
            ],
            "memo": "💘 Seul ou suffisant à deux."
          },
          {
            "name": "Profiterole Très Folle",
            "ingredients": [
              "Chou XXL",
              "Glace vanille de Madagascar",
              "Sauce choco-Nutella",
              "Banane",
              "Amandes",
              "Crème fouettée"
            ],
            "memo": "🤪 Un unique chou XXL géant."
          },
          {
            "name": "Fondue de Fruits Très Chocolat",
            "ingredients": [
              "Découpe de fruits frais",
              "Gaufres",
              "Chamallows",
              "Sauce choco-Nutella",
              "Crème fouettée"
            ],
            "memo": "🍓 Existe en La Môme et La Très Belle."
          },
          {
            "name": "Café ou Thé Gourmand",
            "ingredients": [
              "Expresso ou thé",
              "Morceaux de fondant choco",
              "Crème de nougat",
              "Crème fouettée",
              "Soupe de fraise",
              "Menthe fraîche",
              "Glace ou sorbet au choix",
              "Amandes coco crunch"
            ],
            "memo": "☕ Version gourmande complète."
          },
          {
            "name": "Café ou Thé Gourmand Light",
            "ingredients": [
              "Expresso ou thé",
              "Dés d'ananas",
              "Dés de kiwi",
              "Yolita"
            ],
            "memo": "🌿 Light = léger. Version allégée : fruits + Yolita."
          }
        ]
      },
      "yolita": {
        "label": "Yolita d'Amour",
        "emoji": "🍦",
        "items": [
          {
            "name": "Yolita d'Amour - La Môme",
            "ingredients": [
              "Frozen yogurt Yolita",
              "2 toppings au choix"
            ],
            "memo": "🍦 Frozen yogurt à composer. Note carte : glace goût yaourt."
          },
          {
            "name": "Yolita d'Amour - La Belle",
            "ingredients": [
              "Frozen yogurt Yolita",
              "2 toppings au choix"
            ],
            "memo": "🍦 Grand format à composer."
          },
          {
            "name": "Toppings Yolita",
            "ingredients": [
              "Mangue",
              "Framboise",
              "Banane",
              "Ananas",
              "Kiwi",
              "Miel",
              "Fraise",
              "Muesli croustillant"
            ],
            "memo": "🔢 Topping supplémentaire possible. Framboise avec supplément indiqué sur carte."
          }
        ]
      },
      "coupes_glacees": {
        "label": "Coupes Glacées du Paradis",
        "emoji": "🍧",
        "items": [
          {
            "name": "Igloo",
            "ingredients": [
              "Esquimau vanille ou coco",
              "Coque au chocolat au lait minute",
              "Smarties"
            ],
            "memo": "🆕 Pour les petits et les grands."
          },
          {
            "name": "Double Choco",
            "ingredients": [
              "Glace chocolat noir Guanaja",
              "Crème de nougat Paradis",
              "Morceaux de fondant choco",
              "Sauce choco-noisette Paradis",
              "Crème fouettée"
            ],
            "memo": "🍫 Coupe full chocolat."
          },
          {
            "name": "Pistachio",
            "ingredients": [
              "Glace pistache de Sicile",
              "Pistache crunch",
              "Morceaux de fondant choco",
              "Sauce choco-noisette Paradis",
              "Crème fouettée"
            ],
            "memo": "💚 Pistache + chocolat + crème."
          },
          {
            "name": "Nougatella",
            "ingredients": [
              "Glace vanille de Madagascar",
              "Crème de nougat Paradis",
              "Nutella",
              "Banane",
              "Morceaux de fondant choco",
              "Crème fouettée"
            ],
            "memo": "🍌 Vanille, nougat, Nutella, banane."
          },
          {
            "name": "Cornet d'Amour Surprise",
            "ingredients": [
              "Craquant de Nutella",
              "Fraises",
              "Banane",
              "1 parfum de glace ou sorbet au choix",
              "Amandes coco crunch",
              "Crème fouettée"
            ],
            "memo": "💘 Coupe surprise avec cornet craquant Nutella."
          },
          {
            "name": "Fraise Melba Très Fraise",
            "ingredients": [
              "Glace vanille de Madagascar",
              "Sorbet fraises Senga et fraises des bois",
              "Fraises",
              "Coulis de fruits",
              "Crème fouettée"
            ],
            "memo": "🍓 Très fraise, comme son nom le crie en rouge."
          },
          {
            "name": "Aphrodite",
            "ingredients": [
              "Glace vanille de Madagascar",
              "Glace nougat de Montélimar",
              "Crème de nougat Paradis",
              "Amandes grillées",
              "Sauce caramel-vanille Paradis",
              "Crème fouettée"
            ],
            "memo": "🏛️ Existe en La Môme et La Belle."
          },
          {
            "name": "Extra Île Parad'Ice",
            "ingredients": [
              "Découpe de fruits",
              "Coulis de fruits",
              "2 parfums de glace ou sorbet au choix",
              "Crème fouettée"
            ],
            "memo": "🏝️ Coupe fruitée avec 2 parfums au choix."
          },
          {
            "name": "Banana Split Vintage",
            "ingredients": [
              "Glace vanille de Madagascar",
              "Glace chocolat noir Guanaja",
              "Sorbet fraises Senga et fraises des bois",
              "Banane",
              "Sauce choco-noisette Paradis",
              "Amandes grillées",
              "Crème fouettée"
            ],
            "memo": "🍌 Recette historique : vanille, chocolat, fraise, banane, amandes, crème."
          }
        ]
      },
      "glaces_sorbets": {
        "label": "Glaces & Sorbets",
        "emoji": "🍨",
        "items": [
          {
            "name": "Glaces artisanales",
            "ingredients": [
              "Vanille de Madagascar",
              "Chocolat noir Guanaja",
              "Pistache de Sicile",
              "Nougat de Montélimar",
              "Noix de coco au lait de coco"
            ],
            "memo": "🍨 Fabriquées dans un atelier artisanal français au lait entier de la ferme Marg'Aude, selon les recettes originales du Paradis du Fruit."
          },
          {
            "name": "Sorbets artisanaux",
            "ingredients": [
              "Framboise et Passion du Pérou",
              "Mangue Alphonso d'Inde",
              "Fraises Senga et fraises des bois"
            ],
            "memo": "🍓 Sorbets listés sur la carte."
          },
          {
            "name": "1 parfum au choix et fruits de saison",
            "ingredients": [
              "1 parfum de glace ou sorbet",
              "Fruits de saison"
            ],
            "memo": "🍧 Format simple."
          },
          {
            "name": "2 parfums au choix et fruits de saison",
            "ingredients": [
              "2 parfums de glace ou sorbet",
              "Fruits de saison"
            ],
            "memo": "🍧 Format double."
          },
          {
            "name": "Suppléments Glacés",
            "ingredients": [
              "Crème fouettée",
              "Parfum supplémentaire"
            ],
            "memo": "➕ Suppléments listés avec la page glacés."
          }
        ]
      }
    }
  }
};

window.REVISION_ALLERGENS = [
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
