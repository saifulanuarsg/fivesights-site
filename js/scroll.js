/* Scroll experience, rebuild of 16 Nov 2026 (pattern from the 13 Nov
   reference brief, built to brand guidelines 1.4).

   Every word stays in the HTML as plain text. This script only adds
   classes and custom properties, so with JavaScript off, or with
   reduced motion on, every section shows in its end state.

   [data-reveal]   fades and rises in once, when it enters the viewport.
   [data-words]    splits its text into words that come in one by one.
   [data-scrub]    gets --e (0 to 1 as its top moves from the bottom of
                   the viewport to the top) and --t (0 to 1 across its
                   whole pass through the viewport). With data-steps="n"
                   it also turns on its [data-step] children in turn as
                   you scroll through it (the pinned scroll sentence). */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { root.classList.remove("motion"); return; }

  /* Header tucks away while you scroll down and comes back when you
     scroll up, so phones get the whole screen for the pinned sections. */
  (function () {
    var h = document.querySelector("header.nav"), last = window.scrollY, tick = false;
    if (!h) return;
    window.addEventListener("scroll", function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (Math.abs(y - last) > 6) { h.classList.toggle("tuck", y > last && y > 160); last = y; }
        tick = false;
      });
    }, { passive: true });
    h.addEventListener("focusin", function () { h.classList.remove("tuck"); });
  })();

  /* Words */
  document.querySelectorAll("[data-words]").forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var s = document.createElement("span");
            s.className = "w"; s.style.setProperty("--i", i++); s.textContent = p;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(el);
  });

  /* Reveals */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  document.querySelectorAll("[data-reveal], [data-words]").forEach(function (el) {
    /* Anything already on the first screen comes in at once, so the
       hero never waits on the observer. */
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
    else io.observe(el);
  });

  /* Scroll-driven sections */
  var scrubs = Array.prototype.slice.call(document.querySelectorAll("[data-scrub]"));
  if (!scrubs.length) return;
  var ticking = false;
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    scrubs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var e = clamp((vh - r.top) / (vh * 0.85));
      var t = clamp((vh - r.top) / (vh + r.height));
      el.style.setProperty("--e", e.toFixed(4));
      el.style.setProperty("--t", t.toFixed(4));
      var n = +el.dataset.steps;
      if (n) {
        var span = r.height - vh;
        var p = span > 0 ? clamp(-r.top / span) : (r.top < vh * 0.5 ? 1 : 0);
        var on = r.top < vh * 0.6 ? Math.min(n, 1 + Math.floor(p * n)) : 0;
        if (el._on !== on) {
          el._on = on;
          el.querySelectorAll("[data-step]").forEach(function (s) {
            var k = +s.dataset.step;
            s.classList.toggle("on", k <= on);
            s.classList.toggle("past", k < on);
          });
        }
      }
    });
  }
  function ask() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);
  update();
})();
