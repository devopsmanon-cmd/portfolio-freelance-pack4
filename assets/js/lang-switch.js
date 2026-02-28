(function () {
  var supported = ["fr", "en", "de"];

  function computeTargetLangUrl(newLang) {
    var path = window.location.pathname;
    var parts = path.split("/").filter(Boolean);
    var langIndex = parts.findIndex(function (p) { return supported.includes(p); });

    if (langIndex === -1) {
      var base = "/" + parts.join("/");
      return base.replace(/\/$/, "") + "/" + newLang + "/index.html";
    }

    var baseParts = parts.slice(0, langIndex);
    var fileParts = parts.slice(langIndex + 1);
    if (fileParts.length === 0) fileParts = ["index.html"];

    return "/" + baseParts.join("/") + "/" + newLang + "/" + fileParts.join("/");
  }

  function pickLangLinks() {
    var links = Array.from(document.querySelectorAll(".lang a, .lang-switch a"));
    if (links.length === 0) return {};

    var byLang = {};
    links.forEach(function (a) {
      var txt = (a.textContent || "").trim().toLowerCase();
      if (supported.includes(txt)) byLang[txt] = a;
    });
    return byLang;
  }

  var map = pickLangLinks();
  var fr = map.fr || document.getElementById("lang-fr");
  var en = map.en || document.getElementById("lang-en");
  var de = map.de || document.getElementById("lang-de");

  if (fr) {
    fr.id = "lang-fr";
    fr.href = computeTargetLangUrl("fr");
  }
  if (en) {
    en.id = "lang-en";
    en.href = computeTargetLangUrl("en");
  }
  if (de) {
    de.id = "lang-de";
    de.href = computeTargetLangUrl("de");
  }
})();
