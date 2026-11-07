/* Header symbol intro (brand guidelines 1.4, Motion): each piece starts
   40% of the symbol's height away from its place, on the line from the
   symbol's centre through the piece's centre, and moves in to lock.
   1.1 s, staggered 90 ms, ease-out. Once per visit, on the first page
   loaded; later pages show the logo still. Skipped for reduced motion. */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem("fs-intro") === "1"; sessionStorage.setItem("fs-intro", "1"); } catch (e) { seen = true; }
  if (reduce || seen || !window.fetch) return;

  var img = document.querySelector("header .brand img");
  if (!img) return;
  fetch(img.getAttribute("src")).then(function (r) { return r.text(); }).then(function (text) {
    var holder = document.createElement("div");
    holder.innerHTML = text;
    var svg = holder.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "fivesights");
    svg.setAttribute("height", "32");
    var pieces = Array.prototype.slice.call(svg.children, 0, 5); /* the five symbol paths */
    img.replaceWith(svg);
    var H = 730.12, CX = 415.83, CY = 365.06, d = 0.4 * H;
    pieces.forEach(function (p, i) {
      var b = p.getBBox();
      var px = b.x + b.width / 2 - CX, py = b.y + b.height / 2 - CY;
      var len = Math.hypot(px, py) || 1;
      p.style.transformBox = "view-box";
      p.style.transform = "translate(" + (px / len * d).toFixed(1) + "px," + (py / len * d).toFixed(1) + "px)";
      p.style.transition = "transform 1.1s ease-out " + (i * 90) + "ms";
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { pieces.forEach(function (p) { p.style.transform = "none"; }); });
    });
  }).catch(function () {});
})();
