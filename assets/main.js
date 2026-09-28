(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pln(n) { return Math.round(n).toLocaleString("pl-PL") + " zł"; }

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = $("theme");
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  try { var saved = localStorage.getItem("pb-theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("pb-theme", next); } catch (e) {}
  });

  /* ---------- Ambient background (canvas blobs following the cursor) ---------- */
  var cv = $("bg");
  if (cv && !reduce) {
    var ctx = cv.getContext("2d"), W, H, mx = .5, my = .3, tx = .5, ty = .3;
    var blobs = [
      { x: .15, y: .2, r: .35, c: [14, 138, 158], s: .00025 },
      { x: .85, y: .15, r: .3, c: [11, 33, 64], s: .0002 },
      { x: .6, y: .9, r: .32, c: [47, 181, 201], s: .00018 }
    ];
    function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    size(); addEventListener("resize", size);
    addEventListener("pointermove", function (e) { tx = e.clientX / W; ty = e.clientY / H; }, { passive: true });
    var t0 = performance.now();
    (function frame(now) {
      var t = now - t0;
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      ctx.clearRect(0, 0, W, H);
      var dark = isDark();
      ctx.globalAlpha = dark ? .22 : .16;
      blobs.forEach(function (b, i) {
        var x = (b.x + Math.sin(t * b.s + i) * .08 + (mx - .5) * .12) * W;
        var y = (b.y + Math.cos(t * b.s * 1.3 + i) * .08 + (my - .5) * .12) * H;
        var r = b.r * Math.max(W, H);
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(" + b.c.join(",") + ",1)");
        g.addColorStop(1, "rgba(" + b.c.join(",") + ",0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(frame);
    })(t0);
  }

  /* ---------- Header, progress, active nav, burger ---------- */
  var hdr = document.querySelector(".hdr"), prog = $("progress");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    var y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (hdr) hdr.classList.toggle("scrolled", y > 10);
    if (prog) prog.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    var cur = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= 120) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("active", i === cur); });
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $("burger"), nav = $("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () { var o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", String(o)); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
  }

  /* ---------- Count-up numbers ---------- */
  function countUp(el, to, fmt, dur) {
    if (reduce) { el.textContent = fmt(to); return; }
    var start = performance.now();
    (function step(now) {
      var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  document.querySelectorAll(".count").forEach(function (el) { countUp(el, +el.dataset.to, function (v) { return Math.round(v); }, 1400); });
  document.querySelectorAll("[data-money]").forEach(function (el) { countUp(el, +el.dataset.money, pln, 1800); });

  /* ---------- 3D tilt + spotlight ---------- */
  if (!reduce && matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = "perspective(900px) rotateY(" + (x * 8) + "deg) rotateX(" + (-y * 8) + "deg)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
    document.querySelectorAll(".spot").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px"); el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Reveal on scroll (visible at rest, lifts in when below the fold) ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -60px 0px" });
    document.querySelectorAll(".scard, .hr li, .steps li, .faq details, .vals li").forEach(function (el, i) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("rv", "pre"); el.style.transitionDelay = (i % 6) * 60 + "ms"; io.observe(el); }
    });
  }

  /* ---------- Tax calculator (orientacyjny, 2026) ---------- */
  var inc = $("income"), incOut = $("income-out"), payout = $("payout"), small = $("small"), rycz = $("ryczalt"), out = $("calc-out");
  function solid(d) { return d > 1000000 ? (d - 1000000) * .04 : 0; }
  function calc() {
    var d = +inc.value, pay = payout.checked, sm = small.checked, rr = +rycz.value;
    var res = [];
    // Skala
    var t = d <= 120000 ? Math.max(0, d * .12 - 3600) : 120000 * .12 - 3600 + (d - 120000) * .32;
    res.push({ name: "Skala podatkowa", info: "12% / 32% + zdrowotna 9%", tax: t + d * .09 + solid(d) });
    // Liniowy
    res.push({ name: "Podatek liniowy", info: "19% + zdrowotna 4,9%", tax: d * .19 + d * .049 + solid(d) });
    // Ryczałt (od przychodu; zdrowotna ryczałtowa wg progu)
    var hz = d <= 60000 ? 5300 : d <= 300000 ? 8850 : 15900;
    res.push({ name: "Ryczałt " + (rr * 100).toLocaleString("pl-PL") + "%", info: "od przychodu + zdrowotna ryczałtowa", tax: d * rr + hz });
    // CIT + dywidenda
    var cr = sm ? .09 : .19, cit = d * cr, div = pay ? (d - cit) * .19 : 0;
    res.push({ name: "CIT " + (cr * 100) + "%", info: pay ? "+ 19% od dywidendy" : "zysk zostaje w spółce", tax: cit + div });
    // Estoński CIT: podatek dopiero przy wypłacie; efektywnie ~20% (mały) / ~25%
    var e = pay ? d * (sm ? .20 : .25) : 0;
    res.push({ name: "Estoński CIT", info: pay ? (sm ? "10% CIT + PIT po odliczeniu ≈ 20%" : "20% CIT + PIT po odliczeniu ≈ 25%") : "0% dopóki zysk zostaje w spółce", tax: e });
    var best = res.reduce(function (a, b) { return b.tax < a.tax ? b : a; });
    incOut.textContent = pln(d);
    inc.style.setProperty("--p", ((d - inc.min) / (inc.max - inc.min) * 100) + "%");
    out.innerHTML = res.map(function (r) {
      var net = d - r.tax, pct = r.tax / d * 100;
      return '<div class="res' + (r === best ? " best" : "") + '">' +
        '<div class="res-name">' + (r === best ? '<span class="best-tag">najkorzystniej</span>' : "") + "<strong>" + esc(r.name) + "</strong><small>" + esc(r.info) + "</small></div>" +
        '<div class="res-bar" title="Zostaje ' + Math.round(100 - pct) + '%"><i style="width:' + (100 - pct) + '%"></i><b style="width:' + pct + '%"></b></div>' +
        '<div class="res-val"><strong>' + pln(net) + "</strong><small>podatki " + pln(r.tax) + " · " + pct.toFixed(1).replace(".", ",") + "%</small></div></div>";
    }).join("") + '<div class="calc-legend"><span><i></i>zostaje właścicielom / w firmie</span><span><b></b>podatki i składki</span></div>';
  }
  if (inc && out) { [inc, payout, small, rycz].forEach(function (el) { el.addEventListener("input", calc); }); calc(); }

  /* ---------- Consolidation steps ---------- */
  var steps = $("steps"), viz = $("viz"), cap = $("viz-cap");
  var caps = [
    "Każda spółka i oddział przekazuje dane w jednym formacie i terminie.",
    "Porównujemy wzajemne należności, zobowiązania, sprzedaż i zakupy między jednostkami grupy.",
    "Eliminujemy obroty wewnątrzgrupowe, niezrealizowane zyski i kapitały; liczymy udziały niekontrolujące.",
    "Bilans, rachunek zysków i strat, przepływy, zmiany w kapitale i noty. Gotowe do badania przez biegłego."
  ];
  if (steps && viz) {
    var items = steps.querySelectorAll("li"), cur = 0, timer;
    function setStep(i) { cur = i; items.forEach(function (li, j) { li.classList.toggle("active", i === j); }); viz.dataset.step = i + 1; cap.textContent = caps[i]; }
    steps.addEventListener("click", function (e) { var li = e.target.closest("li"); if (!li) return; clearInterval(timer); setStep(Array.prototype.indexOf.call(items, li)); });
    if (!reduce) timer = setInterval(function () { setStep((cur + 1) % items.length); }, 3500);
  }

  /* ---------- News ---------- */
  var list = $("news-list"), filters = $("news-filters");
  var news = (window.NEWS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  var cats = window.NEWS_CATEGORIES || {};
  function fmtDate(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function render(filter) {
    var items = news.filter(function (n) { return filter === "all" || n.category === filter; });
    list.innerHTML = items.map(function (n, i) {
      var pts = (n.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
      return '<article class="news-card" style="animation-delay:' + i * 60 + 'ms">' +
        '<div class="news-meta"><span class="tag">' + esc(cats[n.category] || n.category) + '</span><time datetime="' + esc(n.date) + '">' + fmtDate(n.date) + "</time></div>" +
        "<h3>" + esc(n.title) + "</h3><p>" + esc(n.summary) + "</p>" +
        (pts || n.source ? "<details><summary>Szczegóły</summary>" + (pts ? "<ul>" + pts + "</ul>" : "") +
          (n.source ? '<p class="src">' + esc(n.source) + (n.link ? ' · <a href="' + esc(n.link) + '" target="_blank" rel="noopener">źródło</a>' : "") + "</p>" : "") + "</details>" : "") +
        "</article>";
    }).join("") || "<p>Brak wpisów w tej kategorii.</p>";
    Array.prototype.forEach.call(filters.children, function (b) { b.setAttribute("aria-pressed", String(b.dataset.filter === filter)); });
    try { localStorage.setItem("pb-news-filter", filter); } catch (e) {}
  }
  if (list && filters) {
    var keys = ["all"].concat(Object.keys(cats));
    filters.innerHTML = keys.map(function (k) { return '<button type="button" class="chipbtn" data-filter="' + k + '" aria-pressed="false">' + esc(k === "all" ? "Wszystkie" : cats[k]) + "</button>"; }).join("");
    filters.addEventListener("click", function (e) { var b = e.target.closest("button[data-filter]"); if (b) render(b.dataset.filter); });
    var sv = "all"; try { sv = localStorage.getItem("pb-news-filter") || "all"; } catch (e) {}
    render(keys.indexOf(sv) >= 0 ? sv : "all");
  }

  /* ---------- Contact form ---------- */
  var form = $("contact-form"), status = $("form-status");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = [];
    ["f-name", "f-email"].forEach(function (id) { var el = $(id), ok = el.value.trim() && el.checkValidity(); el.classList.toggle("invalid", !ok); if (!ok) bad.push(el); });
    var consent = $("f-consent");
    if (bad.length || !consent.checked) { status.textContent = bad.length ? "Uzupełnij imię i poprawny adres e-mail." : "Zaznacz zgodę na przetwarzanie danych."; (bad[0] || consent).focus(); return; }
    var d = new FormData(form), endpoint = form.getAttribute("data-endpoint");
    var to = $("contact-email").textContent.trim();
    var subject = "Zapytanie ze strony: " + d.get("topic");
    var body = "Imię i nazwisko: " + d.get("name") + "\nFirma: " + (d.get("company") || "–") + "\nE-mail: " + d.get("email") + "\nTemat: " + d.get("topic") + "\n\n" + (d.get("message") || "");
    var btn = form.querySelector('button[type="submit"]');
    status.classList.remove("err");

    function showPanel(ok) {
      var panel = document.createElement("div");
      panel.className = "sent";
      panel.innerHTML = ok
        ? '<div class="sent-ic"><svg class="ic"><use href="#i-check"/></svg></div><h3>Zapytanie wysłane</h3>' +
          "<p>Dziękujemy, " + esc(d.get("name")) + ". Odpowiemy na <b>" + esc(d.get("email")) + "</b> w ciągu jednego dnia roboczego.</p>" +
          '<div class="sent-actions"><button type="button" class="btn btn-ghost" data-again>Wyślij kolejne</button></div>'
        : '<div class="sent-ic"><svg class="ic"><use href="#i-mail"/></svg></div><h3>Wyślij wiadomość e-mailem</h3>' +
          "<p>Automatyczna wysyłka nie zadziałała w tej przeglądarce. Skopiuj poniższą treść i wyślij ją na <span class=\"mailto\">" + esc(to) + "</span>.</p>" +
          "<pre>" + esc(body) + "</pre>" +
          '<div class="sent-actions"><button type="button" class="btn btn-primary" data-copy>Skopiuj wiadomość</button>' +
          '<a class="btn btn-ghost" href="mailto:' + esc(to) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body) + '">Otwórz program pocztowy</a>' +
          '<button type="button" class="btn btn-ghost" data-again>Wróć do formularza</button></div>';
      Array.prototype.forEach.call(form.children, function (c) { c.hidden = true; });
      form.appendChild(panel);
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
      panel.addEventListener("click", function (ev) {
        if (ev.target.closest("[data-again]")) { panel.remove(); Array.prototype.forEach.call(form.children, function (c) { c.hidden = false; }); if (ok) form.reset(); status.textContent = ""; }
        var cp = ev.target.closest("[data-copy]");
        if (cp) {
          var done = function () { cp.textContent = "Skopiowano ✓"; };
          var fail = function () { var r = document.createRange(); r.selectNodeContents(panel.querySelector("pre")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); cp.textContent = "Zaznaczono – skopiuj ręcznie"; };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(body).then(done, fail); else fail();
        }
      });
    }

    if (endpoint && window.fetch) {
      btn.disabled = true; status.textContent = "Wysyłanie…";
      var payload = { name: d.get("name"), company: d.get("company"), email: d.get("email"), topic: d.get("topic"), message: d.get("message"), _subject: subject, _replyto: d.get("email"), _template: "table", _captcha: "false" };
      var ctrl = "AbortController" in window ? new AbortController() : null;
      var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 12000);
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload), signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) { if (j && (j.success === "true" || j.success === true)) showPanel(true); else showPanel(false); })
        .catch(function () { showPanel(false); })
        .then(function () { clearTimeout(timer); btn.disabled = false; status.textContent = ""; });
      return;
    }
    showPanel(false);
  });

  var y = $("year"); if (y) y.textContent = new Date().getFullYear();
})();
