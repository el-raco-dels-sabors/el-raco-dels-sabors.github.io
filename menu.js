// =====================================================================
//  menu.js — LA CARTE (copie locale)
//  Une ligne = un plat, dans l'ordre d'affichage.
//  Colonnes, dans cet ordre :
//   1 "Categoría"   2 "Plato"   3 "Descripción"   4 Precio   5 "Etiqueta"   6 "Visible"
//   7 "Plato (CA)"  8 "Plato (FR)"  9 "Plato (EN)"
//  10 "Descripción (CA)"  11 "Descripción (FR)"  12 "Descripción (EN)"
//    - Precio    : nombre avec un point (3.50) ; mettre "" si pas de prix
//    - Etiqueta  : "" ou Nuevo / Especialidad / Vegetariano / Picante / Agotado
//    - Visible   : "sí" pour afficher, "no" pour cacher sans effacer la ligne
//    - Traductions vides "" = le nom espagnol est affiché dans toutes les langues
//  Les catégories apparaissent dans l'ordre de leur première ligne.
//  Une catégorie sans plat visible n'est pas affichée.
//  ⚠ Chaque ligne se termine par une virgule, sauf la dernière.
//  Si Google Sheets est configuré dans config.js, la feuille a la priorité
//  et ce fichier ne sert que de copie de secours.
// =====================================================================
window.MENU_DATA = [
  ["Tapas", "Pan con tomate", "", 3.50, "", "sí", "Pa amb tomàquet", "Pain à la tomate", "Bread with tomato", "", "", ""],
  ["Tapas", "Jamón y queso", "", 20.00, "", "sí", "Pernil i formatge", "Jambon et fromage", "Ham and cheese", "", "", ""],
  ["Tapas", "Queso manchego", "", 10.00, "", "sí", "Formatge manxec", "Fromage manchego", "Manchego cheese", "", "", ""],
  ["Tapas", "Croquetas de cocido", "", 8.50, "", "sí", "Croquetes de cocido", "Croquettes de cocido", "Cocido croquettes", "", "", ""],
  ["Tapas", "Patatas bravas", "", 8.50, "", "sí", "Patates braves", "Patatas bravas", "Patatas bravas", "", "", ""],
  ["Tapas", "Pimientos de Padrón", "", 8.90, "", "sí", "Pebrots de Padró", "Poivrons de Padrón", "Padrón peppers", "", "", ""],
  ["Tapas", "Albóndigas en salsa de tomate", "", 8.50, "", "sí", "Mandonguilles amb salsa de tomàquet", "Boulettes de viande sauce tomate", "Meatballs in tomato sauce", "", "", ""],
  ["Tapas", "Chorizo al diablo", "1 unidad", 5.00, "", "sí", "Xoriço al diable", "Chorizo al diablo", "Chorizo al diablo", "1 unitat", "1 pièce", "1 piece"],
  ["Tapas", "Gamba salada", "", 10.00, "", "sí", "Gamba salada", "Gambas au sel", "Salted prawns", "", "", ""],
  ["Tapas", "Chipirones", "", 11.95, "", "sí", "Xipirons", "Petits calamars", "Baby squid", "", "", ""],
  ["Tapas", "Mejillones al vapor", "", 11.00, "", "sí", "Musclos al vapor", "Moules à la vapeur", "Steamed mussels", "", "", ""],
  ["Tapas", "Almejas a la marinera", "", 11.00, "", "sí", "Cloïsses a la marinera", "Palourdes à la marinière", "Clams marinera", "", "", ""],
  ["Tapas", "Pulpo a la gallega", "", 22.00, "", "sí", "Pop a la gallega", "Poulpe à la galicienne", "Galician-style octopus", "", "", ""],

  ["Sabores de Brasil", "Coxinha", "1 unidad", 3.00, "", "sí", "Coxinha", "Coxinha", "Coxinha", "1 unitat", "1 pièce", "1 piece"],
  ["Sabores de Brasil", "Kibe", "3 unidades", 5.00, "", "sí", "Kibe", "Kibe", "Kibe", "3 unitats", "3 pièces", "3 pieces"],
  ["Sabores de Brasil", "Pastel de pollo", "", 7.00, "", "sí", "Pastel de pollastre", "Pastel au poulet", "Chicken pastel", "", "", ""],
  ["Sabores de Brasil", "Carne na chapa", "", 20.00, "", "sí", "Carn a la planxa", "Viande à la plancha", "Grilled beef na chapa", "", "", ""],
  ["Sabores de Brasil", "Churrasco con patatas", "", 17.00, "", "sí", "Churrasco amb patates", "Churrasco et pommes de terre", "Churrasco with potatoes", "", "", ""],

  ["Para compartir", "Arroz caldoso de marisco", "2 personas", 36.00, "", "sí", "Arròs caldós de marisc", "Riz caldoso aux fruits de mer", "Seafood caldoso rice", "2 persones", "2 personnes", "2 people"]
];

// Traductions des noms de catégories (la clé = nom exact de la colonne "Categoría").
// Les catégories courantes (Tapas, Bebidas, Postres, Menú de Navidad…) sont déjà
// traduites automatiquement ; ajouter ici seulement les nouvelles.
window.CATEGORY_NAMES = {
  "Sabores de Brasil": { "ca": "Sabors del Brasil", "fr": "Saveurs du Brésil", "en": "Flavours of Brazil" },
  "Para compartir":    { "ca": "Per compartir",     "fr": "À partager",         "en": "To share" }
};
// ---------------------------------------------------------------------
//  Exemples prêts à copier dans MENU_DATA (retirer les // au début) :
//  ["Bebidas", "Caipirinha", "", 8.00, "", "sí", "", "", "", "", "", ""],
//  ["Postres", "Brigadeiro", "3 unidades", 4.50, "Nuevo", "sí", "", "", "", "3 unitats", "3 pièces", "3 pieces"],
//  ["Menú de Navidad", "Menú de Nochebuena", "Bebida incluida", 45.00, "Especialidad", "sí", "", "", "", "", "", ""],
// ---------------------------------------------------------------------
