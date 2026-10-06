# Paradis du Fruit

Application statique (HTML, CSS, JavaScript sans framework) pour réviser la carte.
Elle s'ouvre directement avec `index.html`, en local comme sur GitHub Pages.

## Organisation

```
index.html              Page unique : charge les styles puis les scripts dans l'ordre
css/
  base.css              Variables (couleurs, polices), base, mise en page
  components.css        Tuiles, cartes, boutons, pastilles, cercles de score
  layout.css            Barre du haut, menu hamburger, modale
  pages.css             Styles propres à chaque page
  responsive.css        Téléphone / ordinateur (toujours en dernier)
data/
  menu.js               La carte (sections, familles, fiches)
  allergens.js          Allergènes officiels par fiche
  quiz-questions.js     Les 4 quizz QCM (Salle, Bar, Cuisine, Général)
js/
  core/                 Outils, sauvegarde, état, couleurs, navigation
  features/             Allergènes, recherche et filtres, moteur du quizz
  components/           Éléments communs (cartes, en-têtes, menu)
  pages/                Une page = un fichier
  app.js                Rendu global, événements, démarrage (en dernier)
```

## Règles simples

- Modifier la carte : `data/menu.js`. Les allergènes : `data/allergens.js`. Les questions : `data/quiz-questions.js`.
- Ajouter une page : créer `js/pages/ma-page.js`, l'ajouter dans `index.html` avant `js/app.js`,
  puis l'ajouter dans `parseRoute()` (`js/core/router.js`) et dans `render()` (`js/app.js`).
- L'ordre des `<script>` dans `index.html` compte : un fichier peut utiliser ce que les fichiers
  chargés avant lui définissent.
- La console du navigateur (F12) signale les erreurs dans les données (allergènes, questions).
