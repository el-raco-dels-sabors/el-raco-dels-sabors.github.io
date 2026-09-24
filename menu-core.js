/* =====================================================================
   menu-core.js — moteur de la carte (partagé par le site et l'impression)
   Aucune dépendance. Ne contient pas de données du restaurant.
   ===================================================================== */
(function (global) {
  "use strict";

  var LANGS = ["ca", "es", "fr", "en"];

  var LABELS = {
    es: { name: "Español", code: "ES", welcome: "Bienvenidos", choose: "Elige tu idioma",
      viewMenu: "Ver la carta", call: "Llamar", book: "Reservar", whatsapp: "WhatsApp",
      directions: "Cómo llegar", hours: "Horario", address: "Dirección", reservations: "Reservas",
      allergens: "¿Alergias o intolerancias? Pregunta a nuestro equipo antes de pedir.",
      menu: "La carta", soldout: "Agotado", "new": "Nuevo", signature: "Especialidad",
      veg: "Vegetariano", spicy: "Picante", tagline: "Tapas para compartir, sabores para recordar",
      pricesNote: "Precios en euros", scan: "Escanea para ver la carta actualizada",
      changeLang: "Idioma", emptyMenu: "Carta en preparación. ¡Pregunta a nuestro equipo!",
      backTop: "Volver arriba", photos: "Nuestros platos", close: "Cerrar", credits: "Créditos de las fotos" },
    ca: { name: "Català", code: "CA", welcome: "Benvinguts", choose: "Tria el teu idioma",
      viewMenu: "Veure la carta", call: "Trucar", book: "Reservar", whatsapp: "WhatsApp",
      directions: "Com arribar", hours: "Horari", address: "Adreça", reservations: "Reserves",
      allergens: "Al·lèrgies o intoleràncies? Pregunta al nostre equip abans de demanar.",
      menu: "La carta", soldout: "Esgotat", "new": "Nou", signature: "Especialitat",
      veg: "Vegetarià", spicy: "Picant", tagline: "Tapes per compartir, sabors per recordar",
      pricesNote: "Preus en euros", scan: "Escaneja per veure la carta actualitzada",
      changeLang: "Idioma", emptyMenu: "Carta en preparació. Pregunta al nostre equip!",
      backTop: "Tornar a dalt", photos: "Els nostres plats", close: "Tancar", credits: "Crèdits de les fotos" },
    fr: { name: "Français", code: "FR", welcome: "Bienvenue", choose: "Choisissez votre langue",
      viewMenu: "Voir la carte", call: "Appeler", book: "Réserver", whatsapp: "WhatsApp",
      directions: "Itinéraire", hours: "Horaires", address: "Adresse", reservations: "Réservations",
      allergens: "Allergies ou intolérances ? Demandez à notre équipe avant de commander.",
      menu: "La carte", soldout: "Épuisé", "new": "Nouveau", signature: "Spécialité",
      veg: "Végétarien", spicy: "Épicé", tagline: "Des tapas à partager, des saveurs à retenir",
      pricesNote: "Prix en euros", scan: "Scannez pour voir la carte à jour",
      changeLang: "Langue", emptyMenu: "Carte en préparation. Demandez à notre équipe !",
      backTop: "Haut de page", photos: "Nos plats", close: "Fermer", credits: "Crédits photos" },
    en: { name: "English", code: "EN", welcome: "Welcome", choose: "Choose your language",
      viewMenu: "See the menu", call: "Call", book: "Book a table", whatsapp: "WhatsApp",
      directions: "Directions", hours: "Opening hours", address: "Address", reservations: "Reservations",
      allergens: "Allergies or intolerances? Please ask our team before ordering.",
      menu: "The menu", soldout: "Sold out", "new": "New", signature: "House special",
      veg: "Vegetarian", spicy: "Spicy", tagline: "Tapas for sharing, flavours to remember",
      pricesNote: "Prices in euros", scan: "Scan to see the latest menu",
      changeLang: "Language", emptyMenu: "Menu coming soon. Please ask our team!",
      backTop: "Back to top", photos: "Our dishes", close: "Close", credits: "Photo credits" }
  };

  /* Traductions par défaut des catégories courantes (clé = nom normalisé). */
  var CATEGORY_DEFAULTS = {
    "tapas":              { es: "Tapas", ca: "Tapes", fr: "Tapas", en: "Tapas" },
    "tapes":              { es: "Tapas", ca: "Tapes", fr: "Tapas", en: "Tapas" },
    "sabores de brasil":  { es: "Sabores de Brasil", ca: "Sabors del Brasil", fr: "Saveurs du Brésil", en: "Flavours of Brazil" },
    "especialidades":     { es: "Especialidades", ca: "Especialitats", fr: "Spécialités", en: "Specialities" },
    "para compartir":     { es: "Para compartir", ca: "Per compartir", fr: "À partager", en: "To share" },
    "arroces":            { es: "Arroces", ca: "Arrossos", fr: "Riz", en: "Rice dishes" },
    "arrossos":           { es: "Arroces", ca: "Arrossos", fr: "Riz", en: "Rice dishes" },
    "carnes":             { es: "Carnes", ca: "Carns", fr: "Viandes", en: "Meat" },
    "carnes y pescado":   { es: "Carnes y pescado", ca: "Carns i peix", fr: "Viandes et poisson", en: "Meat and fish" },
    "pescados":           { es: "Pescados", ca: "Peixos", fr: "Poissons", en: "Fish" },
    "ensaladas":          { es: "Ensaladas", ca: "Amanides", fr: "Salades", en: "Salads" },
    "bebidas":            { es: "Bebidas", ca: "Begudes", fr: "Boissons", en: "Drinks" },
    "postres":            { es: "Postres", ca: "Postres", fr: "Desserts", en: "Desserts" },
    "menu de navidad":    { es: "Menú de Navidad", ca: "Menú de Nadal", fr: "Menu de Noël", en: "Christmas menu" },
    "menu de temporada":  { es: "Menú de temporada", ca: "Menú de temporada", fr: "Menu de saison", en: "Seasonal menu" },
    "menu del dia":       { es: "Menú del día", ca: "Menú del dia", fr: "Menu du jour", en: "Menu of the day" }
  };

  function norm(s) {
    return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/\s+/g, " ").trim();
  }
  function slug(s) {
    return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "cat";
  }
  function pick(v, lang, base) {
    base = base || "es";
    if (v == null) return "";
    if (typeof v === "string" || typeof v === "number" || Array.isArray(v)) return v;
    if (typeof v === "object") {
      if (v[lang]) return v[lang];
      if (v[base]) return v[base];
      for (var k in v) if (v[k]) return v[k];
    }
    return "";
  }

  /* ---------- CSV (RFC 4180, UTF-8) ---------- */
  function parseCSV(text) {
    var rows = [], row = [], field = "", i = 0, inQ = false, ch;
    text = String(text || "").replace(/^﻿/, "");
    while (i < text.length) {
      ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      if (ch === '"') { inQ = true; i++; continue; }
      if (ch === ",") { row.push(field); field = ""; i++; continue; }
      if (ch === "\r") { i++; continue; }
      if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += ch; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (c) { return String(c).trim() !== ""; }); });
  }

  /* ---------- prix ---------- */
  function parsePrice(v) {
    if (v == null) return null;
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v).trim();
    if (!s) return null;
    var cleaned = s.replace(/€|eur|euros?/ig, "").replace(/\s/g, "");
    if (/^-?\d+(?:[.,]\d{1,2})?$/.test(cleaned)) return parseFloat(cleaned.replace(",", "."));
    return { text: s };
  }
  function formatPrice(p, lang) {
    if (p == null || p === "") return "";
    if (typeof p === "object") return p.text || "";
    var n = Number(p).toFixed(2);
    if (lang === "en") return n + " €";
    return n.replace(".", ",") + " €";
  }

  /* ---------- pastilles ---------- */
  var BADGE_SYNONYMS = {
    "new":     ["nuevo", "nueva", "nou", "nova", "nouveau", "nouvelle", "new", "novo", "novedad"],
    signature: ["especialidad", "especialitat", "specialite", "signature", "casa", "de la casa", "house", "estrella", "recomendado", "recomanat"],
    veg:       ["vegetariano", "vegetariana", "vegetaria", "vegetarien", "vegetarienne", "vegetarian", "veggie", "vegano", "vegana", "vegan", "vega"],
    spicy:     ["picante", "picant", "epice", "epicee", "spicy", "hot"],
    soldout:   ["agotado", "agotada", "esgotat", "esgotada", "epuise", "epuisee", "sold out", "soldout", "no disponible", "indisponible", "esgotado"]
  };
  function badgeKind(text) {
    var n = norm(text);
    if (!n) return "";
    for (var k in BADGE_SYNONYMS) if (BADGE_SYNONYMS[k].indexOf(n) >= 0) return k;
    return "custom";
  }
  function isHidden(v) {
    var n = norm(v);
    return ["no", "non", "n", "0", "false", "faux", "ocult", "oculto", "oculta", "cache", "hidden", "nao", "off"].indexOf(n) >= 0;
  }

  /* ---------- détection d'en-têtes ---------- */
  var LANG_WORDS = {
    ca: ["ca", "cat", "catala", "catalan"],
    es: ["es", "esp", "espanol", "castellano", "spanish", "cast"],
    fr: ["fr", "fra", "frances", "francais", "french"],
    en: ["en", "eng", "english", "ingles", "anglais", "angles"]
  };
  function splitLang(n) {
    /* "plato (fr)" -> {base:"plato", lang:"fr"} ; "plato" -> {base:"plato", lang:null} */
    var m = n.match(/^(.*?)[\s(_\-\/]+([a-z]+)\)?\s*$/);
    if (m) {
      var w = norm(m[2]);
      for (var l in LANG_WORDS) if (LANG_WORDS[l].indexOf(w) >= 0) return { base: m[1].trim(), lang: l };
    }
    return { base: n, lang: null };
  }
  var FIELD_ALIASES = {
    category: ["categoria", "category", "categorie", "seccion", "seccio", "section", "cat"],
    name:     ["plato", "plat", "nombre", "nom", "name", "dish", "producto", "producte", "article", "item"],
    desc:     ["descripcion", "descripcio", "description", "desc", "detalle", "detall", "detail"],
    price:    ["precio", "preu", "prix", "price", "€", "eur", "importe", "import"],
    badge:    ["etiqueta", "etiquette", "badge", "label", "tag", "pastilla", "marca"],
    visible:  ["visible", "mostrar", "disponible", "afficher", "show", "actiu", "activo"],
    photo:    ["foto", "photo", "imagen", "imatge", "image", "picture", "fotografia"]
  };
  function headerCell(cell) {
    var n = norm(cell);
    if (!n) return null;
    var sp = splitLang(n);
    var base = sp.base, lang = sp.lang || "es";
    for (var f in FIELD_ALIASES) {
      var al = FIELD_ALIASES[f];
      for (var i = 0; i < al.length; i++) if (base === al[i] || base.indexOf(al[i]) === 0) return { field: f, lang: lang };
    }
    return null;
  }
  function detectHeader(row) {
    var map = {}, hits = 0, hasKey = false;
    for (var i = 0; i < row.length; i++) {
      var h = headerCell(row[i]);
      if (h) { map[i] = h; hits++; if (h.field === "name" || h.field === "price") hasKey = true; }
    }
    return (hits >= 2 && hasKey) ? map : null;
  }
  var FIXED_ORDER = [
    { field: "category", lang: "es" }, { field: "name", lang: "es" }, { field: "desc", lang: "es" },
    { field: "price", lang: "es" }, { field: "badge", lang: "es" }, { field: "visible", lang: "es" },
    { field: "name", lang: "ca" }, { field: "name", lang: "fr" }, { field: "name", lang: "en" },
    { field: "desc", lang: "ca" }, { field: "desc", lang: "fr" }, { field: "desc", lang: "en" },
    { field: "photo", lang: "es" }
  ];

  /* ---------- lignes -> carte ---------- */
  function rowsToMenu(rows) {
    var out = { categories: [] };
    if (!rows || !rows.length) return out;
    var map = null, start = 0;
    for (var r = 0; r < Math.min(rows.length, 3); r++) {
      var m = detectHeader(rows[r]);
      if (m) { map = m; start = r + 1; break; }
    }
    if (!map) { map = {}; FIXED_ORDER.forEach(function (f, i) { map[i] = f; }); start = 0; }
    var byKey = {}, order = [], lastCat = "";
    for (var i = start; i < rows.length; i++) {
      var row = rows[i]; if (!row) continue;
      var rec = { names: {}, descs: {}, price: null, badge: "", badgeText: "", cat: "", visibleRaw: "", photo: "" };
      for (var c = 0; c < row.length; c++) {
        var h = map[c]; if (!h) continue;
        var val = row[c]; var sval = (val == null) ? "" : String(val).trim();
        if (h.field === "category") rec.cat = sval;
        else if (h.field === "name") { if (sval) rec.names[h.lang] = sval; }
        else if (h.field === "desc") { if (sval) rec.descs[h.lang] = sval; }
        else if (h.field === "price") rec.price = parsePrice(val);
        else if (h.field === "badge") rec.badgeText = sval;
        else if (h.field === "visible") rec.visibleRaw = sval;
        else if (h.field === "photo") rec.photo = sval;
      }
      var name = rec.names.es || rec.names.ca || rec.names.fr || rec.names.en;
      if (!name) continue;
      if (isHidden(rec.visibleRaw)) continue;
      var cat = rec.cat || lastCat || "";
      lastCat = cat;
      var key = norm(cat) || "otros";
      if (!byKey[key]) { byKey[key] = { key: key, id: slug(cat || "otros"), raw: cat, items: [] }; order.push(key); }
      rec.badge = badgeKind(rec.badgeText);
      byKey[key].items.push({ names: rec.names, descs: rec.descs, price: rec.price, badge: rec.badge, badgeText: rec.badgeText, photo: rec.photo });
    }
    order.forEach(function (k) { if (byKey[k].items.length) out.categories.push(byKey[k]); });
    return out;
  }

  /* onglet "Categorías" : Categoría | Català | Français | English (| Español) */
  function categoriesFromRows(rows) {
    var out = {};
    if (!rows || !rows.length) return out;
    var head = rows[0].map(function (c) { return norm(c); });
    var colLang = {};
    for (var i = 1; i < head.length; i++) {
      var w = head[i].replace(/[()]/g, "").trim();
      for (var l in LANG_WORDS) if (LANG_WORDS[l].indexOf(w) >= 0) colLang[i] = l;
    }
    var hasHeader = Object.keys(colLang).length > 0;
    if (!hasHeader) { colLang = { 1: "ca", 2: "fr", 3: "en" }; }
    for (var r = hasHeader ? 1 : 0; r < rows.length; r++) {
      var row = rows[r], base = String(row[0] || "").trim();
      if (!base) continue;
      var tr = { es: base };
      for (var c in colLang) { var v = String(row[c] || "").trim(); if (v) tr[colLang[c]] = v; }
      out[norm(base)] = tr;
    }
    return out;
  }

  /* onglet "Info" : Campo | Valor  (clé avec suffixe de langue facultatif) */
  var INFO_ALIASES = {
    name:      ["nombre", "nom", "name", "restaurante", "restaurant"],
    kicker:    ["subtitulo", "subtitol", "sous-titre", "sous titre", "kicker", "tipo", "tipus"],
    tagline:   ["eslogan", "lema", "slogan", "tagline", "frase", "signature"],
    address:   ["direccion", "adreca", "adresse", "address"],
    phone:     ["telefono", "telefon", "telephone", "phone", "tel", "reservas", "reserves"],
    whatsapp:  ["whatsapp", "wa"],
    mapsUrl:   ["maps", "mapa", "google maps", "itinerario", "itineraire", "directions", "como llegar", "com arribar"],
    hours:     ["horario", "horari", "horaires", "horaire", "hours", "opening hours", "apertura"],
    allergens: ["alergenos", "alergias", "al·lergens", "allergens", "allergenes", "allergies", "intolerancias"],
    notice:    ["aviso", "avis", "annonce", "notice", "mensaje", "message", "anuncio", "banner"],
    instagram: ["instagram", "insta"],
    lang:      ["idioma", "llengua", "langue", "language", "lang"],
    siteUrl:   ["web", "url", "site", "sitio", "lloc web"]
  };
  function infoKey(cell) {
    var n = norm(cell); if (!n) return null;
    var sp = splitLang(n), base = sp.base.replace(/[:.]+$/, "").trim();
    for (var k in INFO_ALIASES) {
      var al = INFO_ALIASES[k];
      for (var i = 0; i < al.length; i++) if (base === al[i] || base.indexOf(al[i]) === 0) return { key: k, lang: sp.lang };
    }
    return null;
  }
  function infoFromRows(rows) {
    var out = {};
    if (!rows) return out;
    rows.forEach(function (row) {
      var k = infoKey(row[0]); if (!k) return;
      var val = String(row[1] == null ? "" : row[1]).trim();
      if (!val) return;
      var lang = k.lang || "es";
      if (k.key === "hours") {
        out.hours = out.hours || {};
        out.hours[lang] = (out.hours[lang] || []).concat(val.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean));
      } else if (k.key === "tagline") {
        if (k.lang) { out.taglineTr = out.taglineTr || {}; out.taglineTr[k.lang] = val; }
        else out.tagline = val;
      } else if (k.key === "whatsapp" || k.key === "phone" || k.key === "mapsUrl" || k.key === "instagram" || k.key === "lang" || k.key === "siteUrl") {
        out[k.key] = val;
      } else {
        out[k.key] = out[k.key] && typeof out[k.key] === "object" ? out[k.key] : {};
        out[k.key][lang] = val;
      }
    });
    return out;
  }
  function infoFromConfig(R) {
    R = R || {};
    var out = {};
    ["name", "kicker", "tagline", "subline", "address", "phone", "whatsapp", "mapsUrl", "hours", "allergens", "notice", "instagram", "lang", "siteUrl", "taglineTr"].forEach(function (k) {
      if (R[k] != null && R[k] !== "" && !(Array.isArray(R[k]) && !R[k].length)) out[k] = R[k];
    });
    return out;
  }

  /* ---------- liens ---------- */
  function digits(phone) { return String(phone || "").replace(/[^\d+]/g, ""); }
  function telHref(phone) { var d = digits(phone); return d ? "tel:" + d : ""; }
  function waHref(number) { var d = digits(number).replace(/^\+/, ""); return d ? "https://wa.me/" + d : ""; }
  function mapsLink(address, custom) {
    if (custom) return custom;
    return address ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address) : "";
  }
  function catName(cat, lang, catNames) {
    var tr = (catNames && catNames[cat.key]) || CATEGORY_DEFAULTS[cat.key] || null;
    if (tr) return pick(tr, lang) || cat.raw;
    return cat.raw || "";
  }
  function itemName(item, lang) { return pick(item.names, lang); }
  function itemDesc(item, lang) { return pick(item.descs, lang); }
  /* "pulpo.jpg" -> fichier à côté du site ; "https://…" -> adresse complète */
  function photoUrl(photo) {
    var p = String(photo || "").trim();
    if (!p) return "";
    if (/^(https?:)?\/\//i.test(p) || /^data:/i.test(p)) return p;
    return p.replace(/^\/+/, "");
  }

  /* version légère "foto-x-s.jpg" pour les vignettes ; identique à photoUrl pour les adresses https */
  function thumbUrl(photo) {
    var p = photoUrl(photo);
    if (!p || /^(https?:)?\/\//i.test(p) || /^data:/i.test(p)) return p;
    var m = p.match(/^(.*)(\.jpe?g|\.png|\.webp)$/i);
    return m ? m[1] + "-s" + m[2] : p;
  }

  global.MenuCore = {
    LANGS: LANGS, LABELS: LABELS, CATEGORY_DEFAULTS: CATEGORY_DEFAULTS,
    norm: norm, slug: slug, pick: pick, parseCSV: parseCSV, parsePrice: parsePrice, formatPrice: formatPrice,
    badgeKind: badgeKind, rowsToMenu: rowsToMenu, categoriesFromRows: categoriesFromRows,
    infoFromRows: infoFromRows, infoFromConfig: infoFromConfig,
    telHref: telHref, waHref: waHref, mapsLink: mapsLink, catName: catName, itemName: itemName, itemDesc: itemDesc,
    photoUrl: photoUrl, thumbUrl: thumbUrl
  };
})(typeof window !== "undefined" ? window : globalThis);
