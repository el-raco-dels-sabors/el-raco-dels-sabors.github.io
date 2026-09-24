// =====================================================================
//  config.js — INFORMATIONS DU RESTAURANT (texte modifiable sans risque)
//  Règle : on change uniquement ce qui est entre guillemets "..."
//  et on ne touche pas aux virgules ni aux accolades.
//  Si Google Sheets est configuré (bloc "sheet" en bas), l'onglet "Info"
//  de la feuille a la priorité sur ce fichier pour les textes.
// =====================================================================
window.RESTAURANT = {
  "name": "El Racó dels Sabors",
  "kicker": "Bar Tapería",
  "tagline": "Tapes per compartir, sabors per recordar",
  "subline": "",
  "address": "Avinguda del Pessebre 39, Escaldes-Engordany, Andorra",
  "phone": "+376 371 369",
  "whatsapp": "",
  "mapsUrl": "",
  "hours": [],
  "allergens": "¿Alergias o intolerancias? Pregunta a nuestro equipo antes de pedir.",
  "notice": "",
  "lang": "es",
  "instagram": "",
  "siteUrl": "https://el-raco-dels-sabors.github.io/",
  "sheet": {
    "id": "18iabaAxRDdVxfM0oEDtmIDepgLcNQxVAAlWgWOG48kk",
    "menuTab": "Carta",
    "infoTab": "Info"
  }
};
// ---------------------------------------------------------------------
//  Aide-mémoire des champs :
//  whatsapp  : numéro au format international sans espaces, ex "+376371369".
//              Vide = pas de bouton WhatsApp.
//  mapsUrl   : lien Google Maps personnalisé. Vide = lien automatique
//              construit à partir de l'adresse.
//  hours     : une ligne par créneau, ex :
//              ["Lunes a jueves: 12:00 – 23:00", "Viernes y sábado: 12:00 – 01:00", "Domingo: cerrado"]
//              Liste vide [] = la section Horario n'est pas affichée.
//  notice    : message affiché en haut de la carte, ex "Cerrado del 1 al 15 de agosto".
//              Vide = rien n'est affiché.
//  lang      : langue des boutons et libellés : "es", "ca", "fr", "en" ou "pt".
//  siteUrl   : adresse publique du site une fois en ligne (sert au QR imprimé).
//  sheet.id  : identifiant de la feuille Google Sheets (la longue suite de
//              lettres/chiffres dans son adresse). Vide = la carte vient de menu.js.
//              Variante si le partage "toute personne disposant du lien" n'est
//              pas possible : Fichier > Partager > Publier sur le web > CSV, puis
//              "sheet": { "id": "", "csv": { "menu": "https://…output=csv", "info": "https://…" } }
// ---------------------------------------------------------------------
