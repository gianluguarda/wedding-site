// Eseguito nel <head> per impostare subito la lingua a livello di <html>
(function(){
  var SUP = ["en","it","fr"];
  var qs = new URLSearchParams(location.search);
  var fromQS = qs.get("lang");
  var saved = localStorage.getItem("lang");
  var lang = SUP.includes(fromQS) ? fromQS : SUP.includes(saved) ? saved : "en"; // fallback
  var html = document.documentElement;
  SUP.forEach(function(x){ html.classList.remove("lang-"+x); });
  html.classList.add("lang-"+lang);
  html.setAttribute("lang", lang);
})();
