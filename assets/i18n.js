// assets/i18n.js
(function(){
  // === 1) Dizionario testi per TUTTE le pagine ===
  const T = {
    it: {
      nav: {home:'Home', story:'La nostra storia', stay:'Dove alloggiare', trip:'Viaggio di nozze', rsvp:'RSVP'},
      home: {date:'20 Giugno 2026', place:'Château de Pradines · Grambois, Provence', cta:'Apri in Google Maps'},
      rsvp: {title:'RSVP', intro:'Compila il modulo per confermare la tua presenza.'},
    },
    en: {
      nav: {home:'Home', story:'Our story', stay:'Where to stay', trip:'Honeymoon', rsvp:'RSVP'},
      home: {date:'June 20, 2026', place:'Château de Pradines · Grambois, Provence', cta:'Open in Google Maps'},
      rsvp: {title:'RSVP', intro:'Please fill in the form to confirm your attendance.'},
    },
    fr: {
      nav: {home:'Accueil', story:'Notre histoire', stay:'Où loger', trip:'Voyage de noces', rsvp:'RSVP'},
      home: {date:'20 Juin 2026', place:'Château de Pradines · Grambois, Provence', cta:'Ouvrir dans Google Maps'},
      rsvp: {title:'RSVP', intro:'Veuillez remplir le formulaire pour confirmer votre présence.'},
    }
  };

  // === 2) URL degli iframe Google Form per l’RSVP (metti i tuoi 3 link) ===
  const RSVP_FORMS = {
    it: 'https://docs.google.com/forms/d/e/IT_FORM_ID/viewform?embedded=true',
    en: 'https://docs.google.com/forms/d/e/EN_FORM_ID/viewform?embedded=true',
    fr: 'https://docs.google.com/forms/d/e/FR_FORM_ID/viewform?embedded=true'
  };

  // === 3) Funzioni lingua ===
  function guessLang(){
    const url = new URL(window.location.href);
    const q = (url.searchParams.get('lang') || '').toLowerCase();
    if (q && T[q]) return q;
    const saved = localStorage.getItem('lang');
    if (saved && T[saved]) return saved;
    const n = (navigator.language || 'it').toLowerCase();
    if (n.startsWith('it')) return 'it';
    if (n.startsWith('fr')) return 'fr';
    return 'en';
  }
  function setLang(lang){
    const dict = T[lang] || T.it;
    localStorage.setItem('lang', lang);

    // 1) Etichette con data-i18n="path.to.key"
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const path = el.getAttribute('data-i18n').split('.');
      let v = dict;
      for (const k of path) v = v?.[k];
      if (typeof v === 'string') el.textContent = v;
    });

    // 2) Evidenzia il pulsante lingua attivo
    document.querySelectorAll('.lang [data-lang]').forEach(b=>{
      b.classList.toggle('active', b.getAttribute('data-lang')===lang);
    });

    // 3) RSVP: imposta iframe corretto
    const rsvpFrame = document.getElementById('rsvpFrame');
    if (rsvpFrame){
      const src = RSVP_FORMS[lang] || RSVP_FORMS.it;
      if (rsvpFrame.src !== src) rsvpFrame.src = src;
    }
  }

  // === 4) Inizializzazione globale ===
  window.I18N = {
    init(){
      const lang = guessLang();
      // click sui bottoni lingua
      document.querySelectorAll('.lang [data-lang]').forEach(b=>{
        b.addEventListener('click', () => setLang(b.getAttribute('data-lang')));
      });
      setLang(lang);
    }
  };
})();
