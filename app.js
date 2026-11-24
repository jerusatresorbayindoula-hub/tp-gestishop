import { produits as produitsInitiaux } from "./data.js"; //je recupere le tableau produits qui se trouve dans data.js et je lui donne un alias
let produits = [...produitsInitiaux];

const formulaire = document.getElementById("formulaire"); // je récupère le formulaire avec son id
const boutonAjouter = document.getElementById("btnAdd"); // je récupère le bouton Ajouter pour changer son texte
let idModification = null; // null veut dire qu'aucun produit n'est en cours de modification
let colonneTri = null; // colonne choisie pour le tri (null = aucun tri)
let ordreCroissant = true; // true = du plus petit au plus grand

function afficherProduits(liste) {
    let tbody = document.getElementById("liste");
 
    //======================= GERER LA LISTE VIDE ====================================
    // Si la liste est vide, j'affiche un message
    if (liste.length === 0) {
        // J'affiche une ligne contenant le message dans le tableau
        //colspan="8" : permet à la cellule du message d'occuper les 8 colonnes du tableau.
        tbody.innerHTML = `
            <tr>
                <td colspan="8">Aucun produit</td> 
            </tr>
        `;

        // J'arrête la fonction pour ne pas exécuter la suite du code
        return;
    }
//========================================================================================
    tbody.innerHTML = liste.map((p) => 
        /*Si p.stock === 0 vérifie si le stock est égal à zéro.
        Si c'est vrai, la classe rupture est ajoutée à la ligne.
        Sinon, aucune classe n'est ajoutée (explication du 1er <tr>)
        */
        `<tr class="${p.stock === 0 ? 'rupture' : ''}">
            <td>${p.id}</td>
            <td>${p.nom}</td>
            <td>${p.categorie}</td>
            <td class="montant">${p.prix.toLocaleString("fr-FR")}</td>
            <td class="montant">${p.stock}</td>
            <td class="montant">${p.note.toFixed(1)}</td>
            <td class="montant">${(p.prix * p.stock).toLocaleString("fr-FR")}</td>
            <td>
                <button class="modifier" data-id="${p.id}">Modifier</button>
                <button class="supprimer" data-id="${p.id}">Supprimer</button>
            </td>
        </tr>
    `).join("");
};
//NB : J'ai utilisée le bouton data-id="${p.id}" pour associer le bouton à l’identifiant du produit;
//cela permettra de cibler directement le produit à modifier à partir de son id


//================================================== RECHERCHE =============================================
let recherche = document.getElementById("recherche"); // je recupere les infos des searchs par id
let filtreCategorie = document.getElementById("filtreCategorie"); // je recupere les infos des cat. par id

// une fonction qui permet de rechercher et de filtrer les produits
function filtrerProduits() {
    let texte = recherche.value.toLowerCase(); // Je récupère le texte saisi et je le transforme en minuscules
    let categorie = filtreCategorie.value; // Je récupère la catégorie choisie

    // Je filtre les produits selon le texte recherché et la catégorie choisie
    let produitsFiltres = produits.filter((p) =>
        p.nom.toLowerCase().includes(texte) && // Je vérifie si le nom du produit contient le texte recherché
        (categorie === "" || p.categorie === categorie) // Je garde toutes les catégories si aucune n'est choisie, sinon je garde seulement la catégorie choisie
    );
    // Si une colonne de tri est choisie, je trie une copie de la liste filtrée
    if (colonneTri !== null) {
        produitsFiltres.sort((a, b) => {
            // Pour la colonne total, je calcule prix x stock, sinon je prends la valeur de la colonne
            const valeurA = colonneTri === "total" ? a.prix * a.stock : a[colonneTri];
            const valeurB = colonneTri === "total" ? b.prix * b.stock : b[colonneTri];
            // Si valeurA - valeurB est négatif, a passe avant b (ordre croissant)
            return ordreCroissant ? valeurA - valeurB : valeurB - valeurA;
        });
    }
afficherProduits(produitsFiltres); // j'affiche la liste filtrée et triée
}
// Je lance la recherche à chaque fois que l'utilisateur saisit du texte
recherche.addEventListener("input", filtrerProduits);

// Je lance le filtrage à chaque fois que l'utilisateur change de catégorie
filtreCategorie.addEventListener("change", filtrerProduits);
/*
"input" : déclenche la recherche pendant que tu écris.
"change" : déclenche le filtrage quand tu choisis une catégorie.
filtrerProduits : indique quelle fonction doit être exécutée.
 */
//==================================================== FIN SEARCHS ===================================================================================

// ==================================================== Stataistiques ===============================================================================

let nombre = document.getElementById("nombre"); // Je récupère l'élément HTML qui affiche le nombre de produits

function calculerStatistiques() {// Fonction qui calcule les statistiques des produits
    nombre.textContent = produits.length; // J'affiche le nombre total de produits (nombre.textContent: remplace le 0 de mon HTML par le résultat)
    let produitsEnRupture = produits.filter((p) => p.stock === 0).length; // Je compte les produits dont le stock est égal à zéro
    document.getElementById("rupture").textContent = produitsEnRupture; // J'affiche le nombre de produits en rupture de stock
    // Je calcule la valeur totale du stock de tous les produits
    let valeurTotale = produits.reduce((somme, p) => somme + (p.prix * p.stock), 0);   
    document.getElementById("valeur").textContent = valeurTotale.toLocaleString("fr-FR"); // J'affiche la valeur totale du stock avec un format français 
    // Je calcule la somme des notes de tous les produits
    let sommeNotes = produits.reduce((somme, p) => somme + p.note, 0);   
    // Je calcule la note moyenne des produits
    let moyenne = produits.length > 0 ? sommeNotes / produits.length : 0;
    document.getElementById("moyenne").textContent = moyenne.toFixed(1); // J'affiche la note moyenne avec une seule décimale(toFixed(1) affiche un chiffre après la virgule)
}


//================================================ AJOUTER ET MODIFICATION DES PROD =================================================================

let tbody = document.getElementById("liste"); // pour récupérer la partie du tableau HTML qui contient les produits
tbody.addEventListener("click", (evenement) => { //détecte un clic dans cette partie du tableau
    //evenement : nous permettra de savoir sur quel élément l'utilisateur a cliqué
    if (evenement.target.classList.contains("modifier")) { //evenement.target : désigne l'élément sur lequel j'ai cliqué
    // classList.contains("modifier") :je vérifie si cet élément possède la classe modifier
        let id = Number(evenement.target.dataset.id); //dataset.id : récupère l'identifiant enregistré dans data-id du bouton
        //evenement.target : le bouton "Modifier" sur lequel j'ai cliqué
        let produit = produits.find((p) => p.id === id); // Je recherche dans le tableau produits le produit qui correspond à l'identifiant récupéré
        document.getElementById("nom").value = produit.nom; // J'affiche le nom du produit dans le champ nom du formulaire
        document.getElementById("categorie").value = produit.categorie; // la cat.
        document.getElementById("prix").value = produit.prix; // le prix
        document.getElementById("stock").value = produit.stock; // la qte
        document.getElementById("note").value = produit.note; // la note dans le form.
        idModification = id; // Je mémorise l'identifiant du produit à modifier  
        // Je change le texte du bouton pour indiquer que je modifie un produit
        boutonAjouter.textContent = "Enregistrer";      
    }


    //====================================== SUPPRESSION DES PRODUITS =======================================
    if (evenement.target.classList.contains("supprimer")) {
        // Je récupère l'identifiant du produit à supprimer
        let id = Number(evenement.target.dataset.id);
        // Je demande confirmation avant de supprimer le produit
        if (confirm("Voulez-vous vraiment supprimer ce produit ?")) { //affiche une fenêtre avec les boutons OK et Annuler.
            // Je retire du tableau le produit dont l'identifiant correspond
            //je conserve tous les produits dont l'identifiant est différent de celui que je veux supprimer.
            produits = produits.filter((p) => p.id !== id); // je garde tous les produits sauf celui à supprimer
                if (idModification === id) { // si je supprime le produit que j'étais en train de modifier
                    formulaire.reset(); // je vide le formulaire pour éviter une erreur
                }
                sauvegarder(); // je sauvegarde le tableau après la suppression
                filtrerProduits(); // j'affiche le tableau en gardant la recherche et le filtre actifs
                calculerStatistiques(); // je mets à jour les statistiques
        }
    }
         
});
//======================================================================================================================================
//fonction pour la sauvegarde
function sauvegarder() {
    localStorage.setItem("gestishop_produits",JSON.stringify(produits));
}
// je récupére les produits enregistrés
function charger() {
    let donnees = localStorage.getItem("gestishop_produits");

    if (donnees !== null) {
        produits = JSON.parse(donnees);
    } else {
        produits = [...produitsInitiaux];
    }
}
//============================================== RAPPEL DES FONCTIONS ======================================
charger(); //je récupère les produits enregistrés dans LS
sauvegarder();//j'enregistre ces produits dans localStorage
filtrerProduits(); // j'affiche les produits récupérés
calculerStatistiques(); // Je mets à jour les statistiques des produits
//==============================================================================================================

formulaire.addEventListener("submit", (evenement) => { // ** ce bloc c'est pour détecter l’envoi du formulaire 
    evenement.preventDefault(); //** et empêcher le rechargement par défaut de la page pour ne pas perdre les infos saisies
    document.querySelectorAll("small").forEach((e) => e.textContent = ""); // Je vide les anciens messages d'erreur avant de vérifier à nouveau le formulaire 
    /*
    querySelectorAll("small") : sélectionne tous les éléments <small>.
    forEach(...) : parcourt chaque élément.
    e.textContent = "" : vide le message qu’il contient.
     */

    // Je lis les champs (.value renvoie toujours du texte)
    const nom = document.getElementById("nom").value.trim(); // trim() enlève les espaces au début et à la fin
    const categorie = document.getElementById("categorie").value;
    const prix = document.getElementById("prix").value;
    const stock = document.getElementById("stock").value;
    const note = document.getElementById("note").value;

    let valide = true; // je pars du principe que tout est bon, et je passe à false à chaque erreur

    if (nom.length < 2) { // le nom doit avoir au moins 2 caractères
        document.getElementById("erreurNom").textContent = "Le nom doit contenir au moins 2 caractères.";
        valide = false;
    }
    if (categorie === "") { // une catégorie doit être choisie
        document.getElementById("erreurCategorie").textContent = "Veuillez choisir une catégorie.";
        valide = false;
    }
    if (prix === "" || Number(prix) <= 0) { // le prix ne doit pas être vide et doit être strictement positif
        document.getElementById("erreurPrix").textContent = "Le prix doit être supérieur à 0.";
        valide = false;
    }
    if (stock === "" || Number(stock) < 0 || !Number.isInteger(Number(stock))) { // le stock ne doit pas être vide, doit être entier et supérieur ou égal à 0
        document.getElementById("erreurStock").textContent = "Le stock doit être un entier supérieur ou égal à 0.";
        valide = false;
    }
    if (note === "" || Number(note) < 0 || Number(note) > 5) { // la note ne doit pas être vide et doit être entre 0 et 5
        document.getElementById("erreurNote").textContent = "La note doit être comprise entre 0 et 5.";
        valide = false;
    }

    if (!valide) { // s'il y a au moins une erreur, j'arrête ici
        return;
    }
//==============================================================


    let new_Produit = {
        id: produits.reduce((max, p) => Math.max(max, p.id), 0) + 1, //
        //produits.reduce(...) : me permet parcourir le tableau pour calculer une seule valeur
        //max :représente le plus grand identifiant trouvé jusqu'ici
        //p.id :représente l’identifiant du produit examiné
        //Math.max(max, p.id) : est une méthode qui conserve le plus grand des deux nombres
        // + 1 : ajoute un au plus grand identifiant.

        nom: nom.trim(), // je garde le nom sans les espaces au début et à la fin
        categorie: categorie, // pour la cat. -//-
        prix: Number(prix), // j'ai utilisé la fonction number pour transformer les valeurs saisies en nombres, car ".value" renvoie que du texte
        stock: Number(stock), // idem
        note: Number(note) //idem
    };
    // produits.push(new_Produit); // j'ajouter le nouveau dans le tableau des produits à l'aide de push()
    if (idModification === null) {
        produits.push(new_Produit); // aucun produit en modification : j'ajoute le nouveau produit
    } else {
        // map parcourt tous les produits : si l'id est celui à modifier, je mets le nouveau produit, sinon je garde l'ancien
        produits = produits.map((p) => p.id === idModification ? { ...new_Produit, id: idModification } : p);
    }
    sauvegarder(); //je rappelle sauvegarder(); parce que le tableau produits vient de changer(il contient maintenant un nouveau produit)
    filtrerProduits(); // j'affiche le tableau en gardant la recherche et le filtre actifs
    calculerStatistiques(); // Je mets à jour les statistiques des produits
    formulaire.reset(); //je remet les champs du formulaire à leur état initial pour une new saisie
    
    idModification = null; // Je réinitialise l'identifiant du produit à modifier
    boutonAjouter.textContent = "Ajouter"; // Je remets le texte initial du bouton
});

//=======================================================================================================================
formulaire.addEventListener("reset", () => {
    idModification = null; // plus aucun produit en modification
    boutonAjouter.textContent = "Ajouter"; // le bouton redevient "Ajouter"
    document.querySelectorAll("small").forEach((e) => e.textContent = ""); // j'efface les messages d'erreur
});
//===========================================================================================================================

// Je récupère le bouton Réinitialiser dans le HTML
let boutonReinitialiser = document.getElementById("reinitialiser");

// Je détecte le clic sur le bouton Réinitialiser
boutonReinitialiser.addEventListener("click", () => {

    // Je demande une confirmation avant de réinitialiser les produits
    if (confirm("Voulez-vous vraiment réinitialiser les produits ?")) {

        // Je récupère les produits initiaux depuis data.js
        produits = [...produitsInitiaux];
        formulaire.reset(); // je sors du mode modification s'il était actif
        sauvegarder(); // j'enregistre les produits initiaux
        filtrerProduits(); // j'affiche le tableau en gardant la recherche et le filtre actifs
        calculerStatistiques(); // je mets à jour les statistiques
    }
});

//================ TRI DES COLONNES ================
// Je sélectionne tous les en-têtes qui ont la classe "tri" et j'ajoute un clic sur chacun
document.querySelectorAll("th.tri").forEach((entete) => {
    entete.addEventListener("click", () => {
        const colonne = entete.dataset.tri; // je lis data-tri : "prix", "note" ou "total"
        if (colonneTri === colonne) {
            ordreCroissant = !ordreCroissant; // même colonne : j'inverse l'ordre
        } else {
            colonneTri = colonne; // nouvelle colonne : je la mémorise
            ordreCroissant = true; // et je repars en ordre croissant
        }
        filtrerProduits(); // j'affiche le tableau trié, en gardant la recherche et le filtre
    });
});
