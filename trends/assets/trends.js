/* Behavior shared by every trends snapshot.
   Keeps archived pages usable after the daily generator rewrites HTML,
   as long as this script stays linked. */
(function () {
  var RETIRED_HREF = /(?:^|\/)(?:episodes|accounts)(?:\/|$)/i;
  var RETIRED_TEXT = /週次分析|バズ投稿分析|エピソード系|アカウントまとめ|テキスト4/;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function retired(anchor) {
    var href = anchor.getAttribute("href") || "";
    var text = (anchor.textContent || "").replace(/\s+/g, " ").trim();
    return RETIRED_HREF.test(href) || RETIRED_TEXT.test(text);
  }

  function hardenLinks() {
    document.querySelectorAll("a[href]").forEach(function (anchor) {
      if (retired(anchor)) {
        anchor.remove();
        return;
      }
      var href = anchor.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        anchor.target = "_blank";
        var rel = (anchor.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
        if (rel.indexOf("noopener") === -1) rel.push("noopener");
        if (rel.indexOf("noreferrer") === -1) rel.push("noreferrer");
        anchor.setAttribute("rel", rel.join(" "));
      } else if (anchor.getAttribute("target") === "_blank") {
        anchor.removeAttribute("target");
      }
    });
  }

  function fold(section, label) {
    if (!section || section.dataset.folded === "1") return null;
    var details = document.createElement("details");
    details.className = "fold";
    var summary = document.createElement("summary");
    summary.textContent = label;
    details.appendChild(summary);
    var heading = section.querySelector("h2");
    Array.prototype.slice.call(section.childNodes).forEach(function (node) {
      if (node === heading) return;
      details.appendChild(node);
    });
    if (heading) heading.hidden = true;
    section.appendChild(details);
    section.dataset.folded = "1";
    return details;
  }

  function openHash() {
    var id = (location.hash || "").slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    var details = target.closest("details");
    if (!details) details = target.querySelector("details");
    if (details) details.open = true;
  }

  function lightTheme() {
    var root = document.documentElement;
    root.setAttribute("data-theme", "light");
    root.style.background = "#f3f0ea";
    var theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = "#f3f0ea";
    var scheme = document.querySelector('meta[name="color-scheme"]');
    if (scheme) scheme.content = "light";
  }

  function fitImages() {
    document.querySelectorAll(".pimg img").forEach(function (img) {
      function apply() {
        if (!img.naturalWidth || !img.naturalHeight) return;
        img.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight;
      }
      if (img.complete) apply();
      else img.addEventListener("load", apply, { once: true });
    });
  }

  onReady(function () {
    lightTheme();
    hardenLinks();
    fold(document.getElementById("tbl"), "数値の一覧表");
    fold(document.getElementById("arch"), "過去の回");
    openHash();
    window.addEventListener("hashchange", openHash);
    document.querySelectorAll('nav a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function () {
        var id = (anchor.getAttribute("href") || "").slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        var details = target.querySelector("details.fold");
        if (details) details.open = true;
      });
    });
    fitImages();
  });
})();
