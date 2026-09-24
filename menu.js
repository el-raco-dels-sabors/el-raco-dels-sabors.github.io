// =====================================================================
//  menu.js — LA CARTE (copie locale)
//  Une ligne = un plat, dans l'ordre d'affichage.
//  Colonnes, dans cet ordre :
//   1 "Categoría"   2 "Plato"   3 "Descripción"   4 Precio   5 "Etiqueta"   6 "Visible"
//   7 "Plato (CA)"  8 "Plato (FR)"  9 "Plato (EN)"
//  10 "Descripción (CA)"  11 "Descripción (FR)"  12 "Descripción (EN)"  13 "Foto"
//    - Precio    : nombre avec un point (3.50) ; mettre "" si pas de prix
//    - Etiqueta  : "" ou Nuevo / Especialidad / Vegetariano / Picante / Agotado
//    - Visible   : "sí" pour afficher, "no" pour cacher sans effacer la ligne
//    - Traductions vides "" = le nom espagnol est affiché dans toutes les langues
//    - Foto      : nom du fichier photo déposé avec le site (ex "foto-pulpo.jpg") ou adresse https ; "" = pas de photo
//  Les catégories apparaissent dans l'ordre de leur première ligne.
//  Une catégorie sans plat visible n'est pas affichée.
//  ⚠ Chaque ligne se termine par une virgule, sauf la dernière.
//  Si Google Sheets est configuré dans config.js, la feuille a la priorité
//  et ce fichier ne sert que de copie de secours.
// =====================================================================
window.MENU_DATA = [
  ["Tapas", "Pan con tomate", "", 3.50, "", "sí", "Pa amb tomàquet", "Pain à la tomate", "Bread with tomato", "", "", "", "foto-pan-con-tomate.jpg"],
  ["Tapas", "Jamón y queso", "", 20.00, "", "sí", "Pernil i formatge", "Jambon et fromage", "Ham and cheese", "", "", "", "foto-jamon-y-queso.jpg"],
  ["Tapas", "Queso manchego", "", 10.00, "", "sí", "Formatge manxec", "Fromage manchego", "Manchego cheese", "", "", "", "foto-queso-manchego.jpg"],
  ["Tapas", "Tabla de quesos", "", 12.50, "", "sí", "Taula de formatges", "Plateau de fromages", "Cheese board", "", "", "", "foto-tabla-de-quesos.jpg"],
  ["Tapas", "Tortilla de patatas", "", 9.50, "", "sí", "Truita de patates", "Tortilla de pommes de terre", "Spanish potato omelette", "", "", "", "foto-tortilla-de-patatas.jpg"],
  ["Tapas", "Croquetas de cocido", "", 8.50, "", "sí", "Croquetes de cocido", "Croquettes de cocido", "Cocido croquettes", "", "", "", "foto-croquetas-de-cocido.jpg"],
  ["Tapas", "Patatas bravas", "", 8.50, "", "sí", "Patates braves", "Patatas bravas", "Patatas bravas", "", "", "", "foto-patatas-bravas.jpg"],
  ["Tapas", "Pimientos de Padrón", "", 8.90, "", "sí", "Pebrots de Padró", "Poivrons de Padrón", "Padrón peppers", "", "", "", "foto-pimientos-de-padron.jpg"],
  ["Tapas", "Albóndigas en salsa de tomate", "", 8.50, "", "sí", "Mandonguilles amb salsa de tomàquet", "Boulettes de viande sauce tomate", "Meatballs in tomato sauce", "", "", "", "foto-albondigas-en-salsa-de-tomate.jpg"],
  ["Tapas", "Chorizo al diablo", "2 unidades", 8.50, "", "sí", "Xoriço al diable", "Chorizo al diablo", "Chorizo al diablo", "2 unitats", "2 pièces", "2 pieces", "foto-chorizo-al-diablo.jpg"],
  ["Tapas", "Boquerones en vinagre", "", 7.90, "", "sí", "Seitons en vinagre", "Anchois marinés au vinaigre", "Anchovies in vinegar", "", "", "", "foto-boquerones-en-vinagre.jpg"],
  ["Tapas", "Gamba salada", "", 10.00, "", "sí", "Gamba salada", "Gambas au sel", "Salted prawns", "", "", "", "foto-gamba-salada.jpg"],
  ["Tapas", "Chipirones a la andaluza", "", 11.90, "", "sí", "Xipirons a l'andalusa", "Petits calamars frits à l'andalouse", "Andalusian-style fried baby squid", "", "", "", "foto-chipirones.jpg"],
  ["Tapas", "Mejillones al vapor", "", 11.00, "", "sí", "Musclos al vapor", "Moules à la vapeur", "Steamed mussels", "", "", "", "foto-mejillones-al-vapor.jpg"],
  ["Tapas", "Almejas a la marinera", "", 16.00, "", "sí", "Cloïsses a la marinera", "Palourdes à la marinière", "Clams marinera", "", "", "", "foto-almejas-a-la-marinera.jpg"],
  ["Tapas", "Pulpo a la gallega", "", 22.00, "", "sí", "Pop a la gallega", "Poulpe à la galicienne", "Galician-style octopus", "", "", "", "foto-pulpo-a-la-gallega.jpg"],

  ["Sabores de Brasil", "Coxinha", "1 unidad", 4.00, "", "sí", "Coxinha", "Coxinha", "Coxinha", "1 unitat", "1 pièce", "1 piece", "foto-coxinha.jpg"],
  ["Sabores de Brasil", "Kibe", "3 unidades", 5.00, "", "sí", "Kibe", "Kibe", "Kibe", "3 unitats", "3 pièces", "3 pieces", "foto-kibe.jpg"],
  ["Sabores de Brasil", "Pastel de pollo", "", 7.00, "", "sí", "Pastel de pollastre", "Pastel au poulet", "Chicken pastel", "", "", "", "foto-pastel-de-pollo.jpg"],
  ["Sabores de Brasil", "Empada de pollo", "", 7.00, "", "sí", "Empada de pollastre", "Empada au poulet", "Chicken empada", "", "", "", "foto-empada-de-pollo.jpg"],
  ["Sabores de Brasil", "Pão de queijo", "", 7.50, "", "sí", "Pão de queijo", "Pão de queijo", "Pão de queijo", "", "", "", "foto-pao-de-queijo.jpg"],
  ["Sabores de Brasil", "Carne na chapa", "", 20.00, "", "sí", "Carn a la planxa", "Viande à la plancha", "Grilled beef na chapa", "", "", "", "foto-carne-na-chapa.jpg"],
  ["Sabores de Brasil", "Churrasco con patatas", "", 17.00, "", "sí", "Churrasco amb patates", "Churrasco et pommes de terre", "Churrasco with potatoes", "", "", "", "foto-churrasco-con-patatas.jpg"],

  ["Arroces", "Arroz de marisco", "", 16.95, "", "sí", "Arròs de marisc", "Riz aux fruits de mer", "Seafood rice", "", "", "", "foto-arroz-de-marisco.jpg"],
  ["Arroces", "Arroz negro", "", 16.95, "", "sí", "Arròs negre", "Riz noir à l'encre de seiche", "Black rice with squid ink", "", "", "", "foto-arroz-negro.jpg"],
  ["Arroces", "Panelinha Goiana", "Especialidad brasileña de Goiás", 17.95, "", "sí", "Panelinha Goiana", "Panelinha Goiana", "Panelinha Goiana", "Especialitat brasilera de Goiás", "Spécialité brésilienne du Goiás", "Brazilian speciality from Goiás", "foto-panelinha-goiana.jpg"],
  ["Arroces", "Arroz caldoso de marisco", "2 personas", 36.00, "", "sí", "Arròs caldós de marisc", "Riz caldoso aux fruits de mer", "Seafood caldoso rice", "2 persones", "2 personnes", "2 people", "foto-arroz-caldoso-de-marisco.jpg"],

  ["Carnes y pescado", "Magret de pato", "", 18.90, "", "sí", "Magret d'ànec", "Magret de canard", "Duck breast", "", "", "", "foto-magret-de-pato.jpg"],
  ["Carnes y pescado", "Entrecot a la brasa", "", 22.90, "", "sí", "Entrecot a la brasa", "Entrecôte grillée", "Grilled entrecôte", "", "", "", "foto-entrecot-a-la-brasa.jpg"],
  ["Carnes y pescado", "1/2 Pollo con guarnición", "", 13.90, "", "sí", "1/2 Pollastre amb guarnició", "1/2 Poulet avec garniture", "1/2 Chicken with side dish", "", "", "", "foto-1-2-pollo-con-guarnicion.jpg"],
  ["Carnes y pescado", "Pescado del día", "", 15.90, "", "sí", "Peix del dia", "Poisson du jour", "Fish of the day", "", "", "", "foto-pescado-del-dia.jpg"]
];

// Traductions des noms de catégories (la clé = nom exact de la colonne "Categoría").
// Les catégories courantes (Tapas, Bebidas, Postres, Menú de Navidad…) sont déjà
// traduites automatiquement ; ajouter ici seulement les nouvelles.
window.CATEGORY_NAMES = {
  "Sabores de Brasil": { "ca": "Sabors del Brasil", "fr": "Saveurs du Brésil", "en": "Flavours of Brazil" },
  "Arroces":           { "ca": "Arrossos",          "fr": "Riz",                "en": "Rice dishes" },
  "Carnes y pescado":  { "ca": "Carns i peix",      "fr": "Viandes et poisson", "en": "Meat and fish" },
  "Para compartir":    { "ca": "Per compartir",     "fr": "À partager",         "en": "To share" }
};
// ---------------------------------------------------------------------
//  Exemples prêts à copier dans MENU_DATA (retirer les // au début) :
//  ["Bebidas", "Caipirinha", "", 8.00, "", "sí", "", "", "", "", "", "", "foto-caipirinha.jpg"],
//  ["Postres", "Brigadeiro", "3 unidades", 4.50, "Nuevo", "sí", "", "", "", "3 unitats", "3 pièces", "3 pieces", ""],
//  ["Menú de Navidad", "Menú de Nochebuena", "Bebida incluida", 45.00, "Especialidad", "sí", "", "", "", "", "", "", ""],
// ---------------------------------------------------------------------
