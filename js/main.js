/* Lonestar Mobile Security — site behaviour */
(function () {
  "use strict";
  var cfg = window.LMS_CONFIG || {};
  var pricing = cfg.pricing || { tower: 750, monitoring: 150 };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + Number(n).toLocaleString("en-US"); };

  /* ---------- Config-driven text ---------- */
  $$("[data-price]").forEach(function (el) {
    var k = el.getAttribute("data-price");
    if (k === "bundle") el.textContent = money(pricing.tower + pricing.monitoring);
    else if (pricing[k] != null) el.textContent = money(pricing[k]);
  });

  var phone = (cfg.phone || "").trim();
  var tel = phone.replace(/[^\d+]/g, "");
  $$("[data-phone]").forEach(function (el) { el.textContent = phone; });
  $$("[data-phone-link]").forEach(function (a) {
    if (tel) { a.href = "tel:" + tel; a.hidden = false; } else { a.hidden = true; }
  });
  $$("[data-phone-wrap]").forEach(function (el) { el.hidden = !tel; });

  var email = (cfg.email || "").trim();
  if (email) {
    $$("[data-email]").forEach(function (el) { el.textContent = email; });
    $$("[data-email-link]").forEach(function (a) { a.href = "mailto:" + email; });
  }
  var yr = $("#year"); if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------- Header state ---------- */
  var header = $("#siteHeader");
  var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 24); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var toggle = $("#navToggle"), nav = $("#siteNav");
  var setNav = function (open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  };
  toggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
  });

  /* ---------- Hero video: respect reduced motion / data saver ---------- */
  var video = $("#heroVideo");
  if (video) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) { video.removeAttribute("autoplay"); video.pause(); video.load(); }
    else { video.play().catch(function () {}); }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add("is-visible"); }); }

  /* ---------- Booking ---------- */
  function loadScript(src, onload) {
    var s = document.createElement("script"); s.src = src; s.async = true; if (onload) s.onload = onload; document.head.appendChild(s);
  }

  function initCal(mount, url) {
    // Accept "https://cal.com/user/event", "cal.com/user/event", or just "user/event"
    var link = url.replace(/^https?:\/\//, "").replace(/^(app\.)?cal\.com\//, "").replace(/[?#].*$/, "").replace(/\/+$/, "");
    /* Official Cal.com embed loader */
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    window.Cal("init", "consult", { origin: "https://cal.com" });
    window.Cal.ns.consult("inline", { elementOrSelector: "#" + mount.id, calLink: link, layout: "month_view", config: { theme: "light" } });
    window.Cal.ns.consult("ui", { styles: { branding: { brandColor: "#0b1c33" } }, hideEventTypeDetails: false, layout: "month_view" });
  }

  function initCalendly(mount, url) {
    var div = document.createElement("div");
    div.className = "calendly-inline-widget";
    div.setAttribute("data-url", url + (url.indexOf("?") > -1 ? "&" : "?") + "hide_gdpr_banner=1&primary_color=f2b134&text_color=101a2b");
    div.style.minWidth = "320px"; div.style.height = "760px";
    mount.appendChild(div);
    loadScript("https://assets.calendly.com/assets/external/widget.js");
  }

  function initFallbackForm(mount) {
    var today = new Date(); var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var min = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
    mount.innerHTML =
      '<form class="req-form" id="reqForm" novalidate>' +
        '<h3>Request a consultation</h3>' +
        '<p class="form-intro">Tell us a little about your site and when you\'d like to talk. We\'ll confirm a time by phone or email.</p>' +
        '<div class="form-row">' +
          '<div class="field"><label for="f-name">Your name *</label><input id="f-name" name="name" required autocomplete="name"></div>' +
          '<div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field"><label for="f-phone">Phone *</label><input id="f-phone" name="phone" type="tel" required autocomplete="tel"></div>' +
          '<div class="field"><label for="f-email">Email *</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>' +
        '</div>' +
        '<div class="field"><label for="f-site">Site address or area</label><input id="f-site" name="site" placeholder="e.g. 1200 Main St, Houston, TX" autocomplete="street-address"></div>' +
        '<div class="form-row">' +
          '<div class="field"><label for="f-towers">How many towers?</label><select id="f-towers" name="towers"><option>Not sure yet</option><option>1</option><option>2</option><option>3</option><option>4 or more</option></select></div>' +
          '<div class="field"><label for="f-monitoring">Interested in 24/7 monitoring?</label><select id="f-monitoring" name="monitoring"><option>Yes</option><option>No</option><option>Tell me more</option></select></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field"><label for="f-date">Preferred date</label><input id="f-date" name="date" type="date" min="' + min + '"></div>' +
          '<div class="field"><label for="f-time">Preferred time</label><select id="f-time" name="time"><option>Morning (8am to 12pm)</option><option>Afternoon (12pm to 5pm)</option><option>Any time</option></select></div>' +
        '</div>' +
        '<div class="field"><label for="f-notes">Anything else we should know?</label><textarea id="f-notes" name="notes" placeholder="Project timeline, site conditions, questions..."></textarea></div>' +
        '<button class="btn btn-primary btn-lg" type="submit">Send request</button>' +
        '<p class="form-fine">Submitting opens a pre-filled email to ' + (email || "our team") + ' in your mail app. Nothing is sent until you press send.</p>' +
      '</form>';

    var form = $("#reqForm", mount);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var v = function (n) { return (form.elements[n].value || "").trim(); };
      var lines = [
        "Consultation request from " + v("name"),
        "",
        "Name: " + v("name"),
        "Company: " + (v("company") || "-"),
        "Phone: " + v("phone"),
        "Email: " + v("email"),
        "Site: " + (v("site") || "-"),
        "Towers: " + v("towers"),
        "Monitoring: " + v("monitoring"),
        "Preferred date: " + (v("date") || "flexible"),
        "Preferred time: " + v("time"),
        "",
        "Notes:",
        v("notes") || "-"
      ];
      var body = lines.join("\n");
      var subject = "Consultation request - " + v("name") + (v("company") ? " (" + v("company") + ")" : "");
      if (email) {
        window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      }
      mount.innerHTML =
        '<div class="form-success">' +
          '<svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>' +
          '<h3>Thanks, ' + escapeHtml(v("name").split(" ")[0]) + '. Almost done.</h3>' +
          '<p>Your email app should have opened with the request below. Press send and we\'ll get back to you shortly to confirm a time.</p>' +
          (email ? '<p>If it didn\'t open, copy the details below and email them to <a href="mailto:' + email + '">' + email + '</a>' + (phone ? ", or call us at <strong>" + escapeHtml(phone) + "</strong>" : "") + ".</p>" : "") +
          '<pre>' + escapeHtml(body) + '</pre>' +
        '</div>';
    });
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var mount = $("#booking-widget");
  if (mount) {
    var b = cfg.booking || {}; var url = (b.url || "").trim(); var provider = (b.provider || "").toLowerCase();
    if (!url) initFallbackForm(mount);
    else if (provider === "calendly" || /calendly\.com/i.test(url)) initCalendly(mount, url);
    else initCal(mount, url);
  }
})();
