/* =====================================================================
   app.js — affichage du site (mobile-first). Ne contient pas de données.
   ===================================================================== */
(function () {
  "use strict";
  var C = window.MenuCore, L = C.LABELS, R = window.RESTAURANT || {};
  var STORE_LANG = "raco_lang", STORE_CACHE = "raco_cache_v2";
  var params = new URLSearchParams(location.search);
  var DEBUG = params.get("debug") === "1";

  function $(s, el) { return (el || document).querySelector(s); }
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function validLang(v) { v = String(v || "").toLowerCase(); return C.LANGS.indexOf(v) >= 0 ? v : null; }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var lang = validLang(params.get("lang")) || validLang(safeGet(STORE_LANG)) || null;
  var model = { menu: { categories: [] }, catNames: {}, info: {}, source: "menu.js", updated: null };

  /* ---------- assemblage des données ---------- */
  function catNamesFromLocal() {
    var out = {}, src = window.CATEGORY_NAMES || {};
    for (var k in src) out[C.norm(k)] = Object.assign({ es: k }, src[k]);
    return out;
  }
  function buildFromLocal() {
    model.menu = C.rowsToMenu(Array.isArray(window.MENU_DATA) ? window.MENU_DATA : []);
    model.catNames = catNamesFromLocal();
    model.info = C.infoFromConfig(R);
    model.source = "menu.js";
    model.updated = null;
  }
  function applySheet(pack) {
    var menu = C.rowsToMenu(pack.menuRows || []);
    if (!menu.categories.length) throw new Error("feuille vide");
    model.menu = menu;
    model.catNames = Object.assign(catNamesFromLocal(), pack.catRows ? C.categoriesFromRows(pack.catRows) : {});
    model.info = Object.assign({}, C.infoFromConfig(R), pack.infoRows ? C.infoFromRows(pack.infoRows) : {});
    model.source = "Google Sheets";
    model.updated = pack.t ? new Date(pack.t) : null;
  }
  function sheetKey() {
    var s = R.sheet || {};
    return s.id || (s.csv && s.csv.menu) || "";
  }
  function sheetConfigured() { return !!sheetKey(); }

  function fetchTab(base, tab, required) {
    var ctl = ("AbortController" in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
    return fetch(base + encodeURIComponent(tab), { signal: ctl ? ctl.signal : undefined, cache: "no-store" })
      .then(function (r) {
        var ct = r.headers.get("content-type") || "";
        return r.text().then(function (txt) {
          if (!r.ok || /text\/html/i.test(ct) || /<html/i.test(txt.slice(0, 300))) throw new Error("réponse non CSV pour " + tab);
          return C.parseCSV(txt);
        });
      })
      .catch(function (e) { if (required) throw e; return null; })
      .finally(function () { clearTimeout(timer); });
  }
  function fetchSheet() {
    var s = R.sheet, csv = s.csv || {};
    var base = "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(s.id || "") + "/gviz/tq?tqx=out:csv&sheet=";
    /* s.csv.{menu,categories,info} = adresses CSV "Publier sur le web" (alternative à s.id) */
    function tab(key, name, required) {
      if (csv[key]) return fetchTab(csv[key], "", required);
      if (!s.id) return Promise.resolve(null);
      return fetchTab(base, name, required);
    }
    return Promise.all([
      tab("menu", s.menuTab || "Carta", true),
      tab("categories", s.categoriesTab || "Categorías", false),
      tab("info", s.infoTab || "Info", false)
    ]).then(function (res) { return { menuRows: res[0], catRows: res[1], infoRows: res[2], t: Date.now() }; });
  }

  /* ---------- rendu ---------- */
  function t(key) { return (L[lang || "es"] || L.es)[key] || ""; }
  function setText(sel, text) { var e = $(sel); if (e) e.textContent = text || ""; }

  function renderHero() {
    var info = model.info, lg = lang || "es";
    setText("#r-kicker", C.pick(info.kicker, lg) || "Bar Tapería");
    setText("#r-name", C.pick(info.name, lg) || "El Racó dels Sabors");
    var tag = C.pick(info.tagline, lg);
    setText("#r-tagline", tag);
    var tr = (info.taglineTr && info.taglineTr[lg]) || t("tagline");
    var trEl = $("#r-tagline-tr");
    if (trEl) { trEl.textContent = (tr && tr !== tag) ? tr : ""; trEl.hidden = !(tr && tr !== tag); }
    setText("#btn-menu", t("viewMenu"));
    var btn = $("#btn-menu");
    if (btn && !btn.querySelector("svg")) { /* garde l'icône flèche après setText */ }

    var phone = info.phone || "", tel = C.telHref(phone);
    var call = $("#act-call");
    if (call) { call.href = tel || "#"; call.hidden = !tel; $(".action__label", call).textContent = t("book"); $(".action__sub", call).textContent = phone; }
    var wa = $("#act-wa"), waHref = C.waHref(info.whatsapp);
    if (wa) { wa.href = waHref || "#"; wa.hidden = !waHref; $(".action__label", wa).textContent = t("whatsapp"); }
    var map = $("#act-map"), mapHref = C.mapsLink(info.address, info.mapsUrl);
    if (map) { map.href = mapHref || "#"; map.hidden = !mapHref; $(".action__label", map).textContent = t("directions"); }
    var actions = $("#actions");
    if (actions) actions.setAttribute("data-count", String([tel, waHref, mapHref].filter(Boolean).length));

    var notice = $("#notice"), noticeText = C.pick(info.notice, lg);
    if (notice) { notice.textContent = noticeText; notice.hidden = !noticeText; }
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang-btn") === lg);
      b.setAttribute("aria-pressed", b.getAttribute("data-lang-btn") === lg ? "true" : "false");
    });
    var navLang = $("#nav-lang"); if (navLang) navLang.lastChild.textContent = " " + (L[lg] || L.es).code;
  }

  function priceOf(it) { return C.formatPrice(it.price, lang || "es"); }

  function renderStrip() {
    var strip = $("#strip"), scroll = $("#strip-scroll");
    if (!strip || !scroll) return;
    var items = [];
    model.menu.categories.forEach(function (cat) {
      cat.items.forEach(function (it) { if (it.photo && it.badge !== "soldout") items.push(it); });
    });
    scroll.innerHTML = "";
    strip.hidden = !items.length;
    if (!items.length) return;
    setText("#strip-title", t("photos"));
    items.slice(0, 12).forEach(function (it) {
      var name = C.itemName(it, lang || "es"), src = C.photoUrl(it.photo);
      var fig = el("figure", "strip__item");
      var img = el("img"); img.alt = name; img.loading = "lazy"; img.decoding = "async";
      img.onerror = function () { this.onerror = null; this.src = src; };  /* pas de version légère → la grande */
      img.src = C.thumbUrl(it.photo);
      fig.appendChild(img);
      var cap = el("figcaption", "strip__cap");
      cap.appendChild(el("span", "strip__name", name));
      cap.appendChild(el("span", "strip__price", priceOf(it)));
      fig.appendChild(cap);
      fig.addEventListener("click", function () { openLightbox(src, name, priceOf(it)); });
      scroll.appendChild(fig);
    });
  }

  function renderMenu() {
    var lg = lang || "es", main = $("#carta"), nav = $("#catnav-scroll");
    if (!main) return;
    main.innerHTML = ""; if (nav) nav.innerHTML = "";
    var cats = model.menu.categories;
    main.appendChild(el("h2", "menu__title", t("menu")));
    if (!cats.length) {
      main.appendChild(el("p", "menu__empty", t("emptyMenu")));
      if ($("#catnav")) $("#catnav").hidden = true;
      return;
    }
    if ($("#catnav")) $("#catnav").hidden = false;
    cats.forEach(function (cat) {
      var name = C.catName(cat, lg, model.catNames);
      var id = "cat-" + cat.id;
      if (nav) {
        var chip = el("a", "chip", name); chip.href = "#" + id; chip.setAttribute("data-target", id);
        nav.appendChild(chip);
      }
      var sec = el("section", "cat"); sec.id = id;
      var head = el("div", "cat__head");
      head.appendChild(el("span", "cat__orn"));
      head.appendChild(el("h3", "cat__title", name));
      head.appendChild(el("span", "cat__rule"));
      sec.appendChild(head);
      var list = el("div", "cat__list");
      cat.items.forEach(function (it, idx) {
        var itemName = C.itemName(it, lg), src = it.photo ? C.photoUrl(it.photo) : "";
        var row = el("div", "dish" + (it.badge === "soldout" ? " is-soldout" : "") + (src ? " has-thumb" : ""));
        row.style.setProperty("--i", String(Math.min(idx, 12)));
        if (src) {
          var tb = el("button", "dish__thumb"); tb.type = "button"; tb.setAttribute("aria-label", itemName);
          var im = el("img"); im.alt = ""; im.loading = "lazy"; im.decoding = "async";
          im.onerror = function () { this.onerror = null; this.src = src; };
          im.src = C.thumbUrl(it.photo);
          tb.appendChild(im);
          tb.addEventListener("click", function () { openLightbox(src, itemName, priceOf(it)); });
          row.appendChild(tb);
        }
        var body = el("div", "dish__body");
        var mainCol = el("div", "dish__main");
        var nameEl = el("span", "dish__name", itemName);
        mainCol.appendChild(nameEl);
        if (it.badge) {
          var label = (it.badge === "custom") ? it.badgeText : t(it.badge);
          nameEl.appendChild(document.createTextNode(" "));
          nameEl.appendChild(el("span", "badge badge--" + it.badge, label));
        }
        var desc = C.itemDesc(it, lg);
        if (desc) mainCol.appendChild(el("span", "dish__desc", desc));
        body.appendChild(mainCol);
        body.appendChild(el("span", "dish__dots"));
        body.appendChild(el("span", "dish__price", priceOf(it)));
        row.appendChild(body);
        list.appendChild(row);
      });
      sec.appendChild(list);
      main.appendChild(sec);
    });
    main.appendChild(el("p", "menu__note", t("pricesNote")));
    setupNav();
    setupReveal();
  }

  function renderFooter() {
    var info = model.info, lg = lang || "es";
    setText("#f-address-label", t("address"));
    var addr = $("#f-address"); if (addr) { addr.textContent = info.address || ""; addr.href = C.mapsLink(info.address, info.mapsUrl) || "#"; }
    setText("#f-phone-label", t("reservations"));
    var ph = $("#f-phone"); if (ph) { ph.textContent = info.phone || ""; ph.href = C.telHref(info.phone) || "#"; }
    var hoursBlock = $("#f-hours-block"), hoursList = $("#f-hours");
    var hours = C.pick(info.hours, lg);
    if (typeof hours === "string") hours = hours ? hours.split(/\r?\n/) : [];
    hours = (Array.isArray(hours) ? hours : []).map(function (h) { return String(h).trim(); }).filter(Boolean);
    if (hoursBlock && hoursList) {
      hoursList.innerHTML = "";
      var has = hours.length > 0;
      hoursBlock.hidden = !has;
      if (has) { setText("#f-hours-label", t("hours")); hours.forEach(function (h) { hoursList.appendChild(el("li", null, h)); }); }
    }
    /* texte par langue si fourni (onglet Info), sinon traduction par défaut ; le texte
       unique de config.js n'est utilisé que pour l'espagnol */
    var allergens = (info.allergens && typeof info.allergens === "object") ? C.pick(info.allergens, lg)
                  : (lg === "es" && typeof info.allergens === "string") ? info.allergens : "";
    setText("#f-allergens", allergens || t("allergens"));
    var ig = $("#f-instagram");
    if (ig) { var handle = String(info.instagram || "").replace(/^@/, ""); ig.hidden = !handle; ig.textContent = "@" + handle; ig.href = "https://instagram.com/" + handle; }
    /* ligne de marque du pied de page : la signature (ou le sous-titre s'il est renseigné dans Info) */
    setText("#f-brand", C.pick(info.subline, lg) || C.pick(info.tagline, lg) || "");
    setText("#lp-foot", C.pick(info.kicker, lg) || "Bar Tapería");
    setText("#f-top", t("backTop"));
    setText("#f-credits", t("credits"));
    var lbClose = $("#lb-close"); if (lbClose) lbClose.setAttribute("aria-label", t("close"));
  }

  function renderAll() {
    var lg = lang || "es";
    document.documentElement.lang = lg;
    document.title = t("menu") + " · " + (C.pick(model.info.name, lg) || "El Racó dels Sabors");
    renderHero(); renderStrip(); renderMenu(); renderFooter();
    if (DEBUG) {
      var d = $("#debug") || document.body.appendChild(el("div", "debug"));
      d.id = "debug";
      d.textContent = "source : " + model.source + (model.updated ? " (" + model.updated.toLocaleTimeString() + ")" : "") + " · lang " + lg + (sheetConfigured() ? "" : " · sheet non configuré");
    }
  }

  /* ---------- photo plein écran ---------- */
  function openLightbox(src, name, price) {
    var lb = $("#lightbox"); if (!lb) return;
    var img = $("#lb-img"); img.src = src; img.alt = name;
    setText("#lb-name", name); setText("#lb-price", price);
    lb.hidden = false; document.body.classList.add("is-locked");
    var c = $("#lb-close"); if (c) c.focus();
  }
  function closeLightbox() {
    var lb = $("#lightbox"); if (!lb || lb.hidden) return;
    lb.hidden = true; $("#lb-img").src = "";
    var picker = $("#langpick");
    if (!picker || picker.hidden) document.body.classList.remove("is-locked");
  }
  function setupLightbox() {
    var lb = $("#lightbox"); if (!lb) return;
    lb.addEventListener("click", function (ev) { if (ev.target === lb || ev.target.closest("#lb-close")) closeLightbox(); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeLightbox(); });
  }

  /* ---------- apparition au défilement ---------- */
  var revealObs = null;
  function setupReveal() {
    if (!("IntersectionObserver" in window)) return;
    document.body.classList.add("is-io");
    if (revealObs) revealObs.disconnect();
    revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealObs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.02 });
    document.querySelectorAll(".reveal, section.cat").forEach(function (elm) { revealObs.observe(elm); });
  }

  /* ---------- navigation sticky ---------- */
  var navObserver = null;
  function setupNav() {
    var nav = $("#catnav"), scroll = $("#catnav-scroll");
    if (!nav || !scroll) return;
    var chips = Array.prototype.slice.call(scroll.querySelectorAll(".chip"));
    chips.forEach(function (chip) {
      chip.addEventListener("click", function (ev) {
        ev.preventDefault();
        var target = document.getElementById(chip.getAttribute("data-target"));
        if (!target) return;
        var y = target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight - 8;
        window.scrollTo({ top: y, behavior: "smooth" });
        setActive(chip);
      });
    });
    function setActive(chip) {
      chips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      var left = chip.offsetLeft - (scroll.clientWidth - chip.offsetWidth) / 2;
      scroll.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
    if (navObserver) navObserver.disconnect();
    if ("IntersectionObserver" in window) {
      navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var chip = scroll.querySelector('.chip[data-target="' + en.target.id + '"]');
            if (chip) setActive(chip);
          }
        });
      }, { rootMargin: "-" + (nav.offsetHeight + 10) + "px 0px -70% 0px", threshold: 0 });
      document.querySelectorAll("section.cat").forEach(function (s) { navObserver.observe(s); });
    }
  }
  function setupStickyShadow() {
    var nav = $("#catnav"), sentinel = $("#catnav-sentinel");
    if (!nav || !sentinel || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ---------- choix de la langue ---------- */
  function startEntrance() { document.body.classList.add("is-entering"); }
  function openPicker() {
    var p = $("#langpick"); if (!p) return;
    p.hidden = false; document.body.classList.add("is-locked");
    var first = p.querySelector(".langbtn"); if (first) first.focus();
  }
  function closePicker() {
    var p = $("#langpick"); if (!p) return;
    p.classList.add("is-leaving");
    setTimeout(function () {
      p.hidden = true; p.classList.remove("is-leaving"); document.body.classList.remove("is-locked");
      startEntrance();
    }, 260);
  }
  function setLang(l, fromPicker) {
    lang = l; safeSet(STORE_LANG, l);
    renderAll();
    if (fromPicker) closePicker();
  }
  function setupLang() {
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang-btn"), b.classList.contains("langbtn")); });
    });
    var navLang = $("#nav-lang"); if (navLang) navLang.addEventListener("click", openPicker);
    var picker = $("#langpick");
    if (picker) {
      picker.querySelectorAll(".langbtn").forEach(function (b) {
        var code = b.getAttribute("data-lang-btn");
        b.querySelector(".langbtn__name").textContent = L[code].name;
        b.querySelector(".langbtn__code").textContent = L[code].code;
      });
    }
    if (!lang) openPicker(); else { closePickerInstant(); startEntrance(); }
  }
  function closePickerInstant() { var p = $("#langpick"); if (p) { p.hidden = true; } document.body.classList.remove("is-locked"); }

  /* ---------- démarrage ---------- */
  function init() {
    buildFromLocal();
    var cached = null;
    if (sheetConfigured()) {
      try { cached = JSON.parse(safeGet(STORE_CACHE) || "null"); } catch (e) { cached = null; }
      if (cached && cached.sheetId === sheetKey()) { try { applySheet(cached); model.source = "cache"; } catch (e) { cached = null; } }
    }
    renderAll();
    setupLang();
    setupStickyShadow();
    setupLightbox();
    if (sheetConfigured()) {
      fetchSheet().then(function (pack) {
        pack.sheetId = sheetKey();
        applySheet(pack);
        safeSet(STORE_CACHE, JSON.stringify(pack));
        renderAll();
      }).catch(function (e) {
        if (DEBUG) console.warn("Google Sheets indisponible, carte locale affichée :", e);
      });
    }
    var top = $("#f-top"); if (top) top.addEventListener("click", function (ev) { ev.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
