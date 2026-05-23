/* =========================================================
   VIP & Guest Login — logica condivisa
   - Lista VIP unica
   - Normalizzazione robusta (accenti, simboli, doppi cognomi)
   - Gestione popup login + visibilità .vip-only / .non-vip-only
   ========================================================= */
(function (global) {
  "use strict";

  // ----- Lista VIP (Nome Cognome). Cognome facoltativo. -----
  var VIP_LIST = [
    "Charlotte Francis",
    "Yves Francis",
    "Laurence Hoppe",
    "Chloé Francis",
    "Maya Mertens",
    "Chiara Regalia",
    "Matteo Biroli",
    "Chiara Sestini",
    "Riccardo Magri",
    "Marta Vitro",
    "Mattia Marco",
    "Andrea Rodriguez",
    "Piero Giuriolo",
    "Pietro Favari",
    "Elisa Ferrantelli",
    "Francesco Santermosi",
    "Viviana Serdoz",
    "Francesca Garoia",
    "Massimo Malvestio",
    "Attilia La Vecchia",
    "Stefano de Looper",
    "Clara Simon",
    "Marine Lesage",
    "Thomas Hulet",
    "Nicola delle Foglie",
    "Baptiste Charvat",
    "Liza Bibakova",
    "Iphigénie Loukakis",
    "Sara Nyssen",
    "Koen Slingerland",
    "Gianluca Guardalà",
    "Francesca Arduini",
    "Benedikt Fritz",
    "Isidoro Guardalà",
    "Simona Guardalà",
    "Alessando Guardalà",
    "Irene Guardalà",
    "Patrick",
    "Emanuela Zannetti",
    "Andrea Perozziello",
    "Chiara",
    "Fabio Tarricone",
    "Gisella Martino Capeda",
    "Gisella Martino",
    "Edoardo Cutolo",
    "Giorgia Piras",
    "Edoardo Papini",
    "Vittorio Corti",
    "Benedetta Barbaresi",
    "Giacomo Gussoni",
    "Matteo Rossi",
    "Lucrezia Piracci",
    "Davide Bellotto",
    "Silvia Oltrabella",
    "Ludovico SIbani",
    "Silvia Pignotti",
    "Benedetta Testoni",
    "Giovanni De Maria",
    "Edoardo Ferrario",
    "Alessandro Bianchi",
    "Beatrice Villa",
    "Luca Caravaggi",
    "Mara Moschino",
    "Marzia Campanile",
    "Nikola Calic",
    "Filippo Suglia",
    "Camilla Russo",
    "Laerte Adami",
    "Noemi",
    "Alberto Garlaschelli",
    "Jacopo Guarneri",
    "Lorenzo Cederna",
    "Benedetta Pintus",
    // Nuovi ospiti VIP
    "Alejandro Bravo Fernandez",
    "Anna Franchini",
    "Anna Garruto",
    "Belén Morón Martín",
    "Laura Gomez Martin",
    "Álvaro Salvador Baldó",
    "Maya Guardalà",
    "Pierluigi Vingolo",
    "Sandra Vigil Robledo",
    "Santiago Martín-Villa Navarro"
  ];

  // ----- Utils di normalizzazione -----
  function normalize(str) {
    return (str || "")
      .trim()
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")     // togli accenti
      .replace(/[^\p{L}\p{N}\s'-]/gu, "")                   // togli simboli
      .replace(/\s+/g, " ");                                 // compatta spazi
  }

  function splitName(full) {
    var parts = normalize(full).split(" ").filter(Boolean);
    if (parts.length === 0) return { first: "", last: "" };
    return { first: parts[0], last: parts.slice(1).join(" ") };
  }

  function surnameTokens(str) {
    return normalize(str).split(/[\s-]+/).filter(Boolean);
  }

  // VIP con cognome vuoto -> basta il nome.
  // Altrimenti: match completo OPPURE almeno un token del cognome combacia
  // (gestisce doppi cognomi tipo spagnolo / cognomi composti).
  function surnameMatches(userLast, vipLast) {
    var v = surnameTokens(vipLast);
    if (v.length === 0) return true;
    var u = surnameTokens(userLast);
    if (u.length === 0) return false;
    if (u.join(" ") === v.join(" ")) return true;
    return u.some(function (tok) { return v.indexOf(tok) !== -1; });
  }

  var VIP_PARSED = VIP_LIST.map(splitName);

  function isVipName(userFirst, userLast) {
    var nf = normalize(userFirst);
    var nl = normalize(userLast);
    return VIP_PARSED.some(function (v) {
      return v.first === nf && surnameMatches(nl, v.last);
    });
  }

  // ----- Stato e visibilità -----
  function isVIP() {
    return localStorage.getItem("isVIP") === "true";
  }

  function hasIdentification() {
    return !!localStorage.getItem("guestName");
  }

  function applyVIPVisibility() {
    var vipBlocks = document.querySelectorAll(".vip-only");
    var nonVipBlocks = document.querySelectorAll(".non-vip-only");
    if (isVIP()) {
      vipBlocks.forEach(function (el) { el.style.display = ""; });
      nonVipBlocks.forEach(function (el) { el.style.display = "none"; });
    } else {
      vipBlocks.forEach(function (el) { el.style.display = "none"; });
      nonVipBlocks.forEach(function (el) { el.style.display = ""; });
    }
  }

  // ----- Modal -----
  function openLoginModal() {
    var o = document.getElementById("guestLoginOverlay");
    if (o) o.style.display = "flex";
  }

  function closeLoginModal() {
    var o = document.getElementById("guestLoginOverlay");
    if (o) o.style.display = "none";
  }

  function doLogout() {
    localStorage.removeItem("guestName");
    localStorage.removeItem("isVIP");
    openLoginModal();
    applyVIPVisibility();
    var btn = document.getElementById("guestLogoutBtn");
    if (btn) btn.style.display = "none";
  }

  function submitGuestData() {
    var firstEl = document.getElementById("guestFirst");
    var lastEl  = document.getElementById("guestLast");
    var errEl   = document.getElementById("guestError");
    if (!firstEl || !lastEl) return;

    var first = firstEl.value || "";
    var last  = lastEl.value  || "";

    if (!first.trim() || !last.trim()) {
      if (errEl) {
        errEl.innerHTML = "Please enter both fields.<br>Veuillez remplir les deux champs.<br>Inserisci nome e cognome.";
        errEl.style.display = "block";
      }
      return;
    }

    var guestIsVIP = isVipName(first, last);
    localStorage.setItem("guestName", (first + " " + last).trim());
    localStorage.setItem("isVIP", guestIsVIP ? "true" : "false");

    closeLoginModal();
    applyVIPVisibility();
  }

  // ----- Init: collega bottoni del popup e applica visibilità -----
  function init() {
    var confirmBtn = document.getElementById("guestConfirmBtn");
    var logoutBtn  = document.getElementById("guestLogoutBtn");
    var overlay    = document.getElementById("guestLoginOverlay");
    var errEl      = document.getElementById("guestError");

    if (hasIdentification()) {
      if (overlay) overlay.style.display = "none";
      if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
        logoutBtn.addEventListener("click", doLogout);
      }
    } else {
      if (overlay) overlay.style.display = "flex";
      if (errEl)   errEl.style.display = "none";
      if (logoutBtn) {
        logoutBtn.style.display = "none";
        logoutBtn.addEventListener("click", doLogout);
      }
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", function (e) {
        e.preventDefault();
        submitGuestData();
      });
    }

    applyVIPVisibility();

    // Logout dal footer (se presente)
    var footerLogout = document.getElementById("footerLogout");
    if (footerLogout) {
      footerLogout.addEventListener("click", function (e) {
        e.preventDefault();
        doLogout();
      });
    }
  }

  // Espone l'API e auto-init al DOMContentLoaded
  global.WeddingVIP = {
    VIP_LIST: VIP_LIST,
    normalize: normalize,
    isVipName: isVipName,
    isVIP: isVIP,
    hasIdentification: hasIdentification,
    applyVIPVisibility: applyVIPVisibility,
    openLoginModal: openLoginModal,
    closeLoginModal: closeLoginModal,
    doLogout: doLogout,
    submitGuestData: submitGuestData,
    init: init
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})(window);
