(function(){
  const SUP = ["en","it","fr"];

  // Crea e monta il modal (HTML via JS, così non tocchi ogni pagina)
  function mountGate(){
    if (document.getElementById("lang-gate")) return;
    const wrap = document.createElement("div");
    wrap.id = "lang-gate";
    wrap.innerHTML = `
      <div class="box">
        <h2 style="margin:0 0 12px">Choose your language</h2>
        <p style="margin:0 0 16px;color:#555">You can change it later.</p>
        <div class="actions">
          <button data-pick="en">English</button>
          <button data-pick="it">Italiano</button>
          <button data-pick="fr">Français</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    return wrap;
  }

  function persistLangOnLinks(l){
    // Aggiunge ?lang=… a tutti i link interni (stessa origin)
    document.querySelectorAll('a[href]').forEach(a=>{
      try{
        const u = new URL(a.getAttribute('href'), location.origin);
        if (u.origin === location.origin && !a.hasAttribute('data-nolang')){
          u.searchParams.set('lang', l);
          a.setAttribute('href', u.pathname + '?' + u.searchParams.toString() + u.hash);
        }
      }catch(e){}
    });
  }

  function apply(l){
    const html = document.documentElement;
    SUP.forEach(x=> html.classList.remove("lang-"+x));
    html.classList.add("lang-"+l);
    html.setAttribute("lang", l);
    localStorage.setItem("lang", l);

    const qs = new URLSearchParams(location.search);
    if (qs.get("lang") !== l){
      qs.set("lang", l);
      history.replaceState(null,"", location.pathname+"?"+qs.toString()+location.hash);
    }
    persistLangOnLinks(l);
  }

  function init(){
    const qs = new URLSearchParams(location.search);
    const fromQS = qs.get("lang");
    const saved = localStorage.getItem("lang");
    let lang = SUP.includes(fromQS) ? fromQS : SUP.includes(saved) ? saved : null;

    if (!lang){
      const gate = mountGate();
      gate.style.display = "flex";
      gate.querySelectorAll("[data-pick]").forEach(b=>{
        b.addEventListener("click", ()=>{
          lang = b.dataset.pick;
          apply(lang);
          gate.remove();
        });
      });
    } else {
      apply(lang);
    }
  }

  // Avvio quando il DOM è pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
