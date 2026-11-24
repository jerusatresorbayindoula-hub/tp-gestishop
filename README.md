# GestiShop — Gestion des produits

## Description
GestiShop est une application web qui permet de gérer une liste de produits.

## Fonctionnalités
- Afficher les produits dans un tableau, avec le total de chaque produit (prix × quantité).
- Ajouter un produit, avec validation des champs et messages d'erreur sous chaque champ.
- Modifier un produit : le formulaire est pré-rempli et le bouton devient « Enregistrer ».
- Supprimer un produit, après confirmation.
- Rechercher un produit par son nom.
- Filtrer les produits par catégorie, en même temps que la recherche.
- Trier les produits au clic sur les colonnes Prix, Note et Total (bonus).
- Afficher les statistiques : nombre de produits, valeur totale du stock, produits en rupture, note moyenne.
- Mettre en évidence les produits en rupture de stock.
- Sauvegarder les produits dans le navigateur avec `localStorage` et JSON.
- Réinitialiser la liste avec les données d'origine de `data.js`.

## Lancement
Ouvrir le dossier du projet dans VS Code, puis lancer `index.html` avec l'extension Live Server.
Un double-clic sur `index.html` ne fonctionne pas, car le projet utilise des modules JavaScript (`type="module"`).

## Difficultés rencontées

- **Le bouton « Ajouter » qui devient « Enregistrer »** : j'ai dû comprendre à quel moment le bouton change de texte. Il passe à « Enregistrer » quand je clique sur « Modifier »,
et il revient à « Ajouter » après l'enregistrement, après un clic sur « Annuler » ou après une suppression. J'ai utilisé une variable `idModification` pour savoir si je suis en mode ajout (`null`) ou en mode modification.

- **Le bouton « Modifier » et les identifiants** : il fallait retrouver le bon produit à partir de son `id`. J'ai utilisé l'attribut `data-id` sur chaque bouton, puis `find` pour retrouver le produit et pré-remplir le formulaire.

- **Le bouton « Supprimer »** : j'ai eu du mal à gérer les clics avec un seul écouteur sur le `<tbody>` (délégation d'événements), puis à retirer le bon produit avec `filter` après la confirmation.

- **Le bouton « Réinitialiser »** : il fallait recharger les données d'origine de `data.js`, sauvegarder, puis réafficher le tableau et les statistiques sans laisser un produit en cours de modification.

- **La barre de recherche** : faire fonctionner la recherche et le filtre par catégorie ensemble, et garder le filtre actif après chaque ajout, modification ou suppression.

- **L'hébergement sur GitHub** : j'ai publié le projet avec GitHub Pages, mais je ne voyais pas mes changements en ligne. J'ai compris qu'il fallait d'abord envoyer les fichiers avec `git add`, 
`git commit` et `git push`, puis attendre quelques minutes. Le navigateur du téléphone gardait aussi l'ancienne version en cache : en navigation privée, j'ai vu la nouvelle version.

- **L'adaptation au mobile (responsive)** : le tableau dépassait de l'écran et la barre de recherche était écrasée. J'ai entouré le tableau d'une `div` avec `overflow-x: auto` 
et j'ai ajouté des règles dans `@media (max-width: 700px)`. J'ai aussi réduit la taille des boutons du tableau pour qu'ils ne soient plus collés.

- **La validation du formulaire** : il y avait beaucoup de vérifications à faire pour que chaque champ respecte les règles de l'énoncé (nom d'au moins 2 caractères, catégorie choisie, prix strictement positif, 
stock entier supérieur ou égal à 0, note entre 0 et 5). J'ai aussi dû gérer les champs laissés vides, car une valeur vide était convertie en 0 et acceptée à tort. Au début, un seul message d'erreur s'affichait à la fois. 
J'ai ensuite utilisé une variable `valide` pour tester tous les champs et afficher toutes les erreurs en même temps, sous chaque champ concerné.