/* The fivesights fold, from final/fivesights_swan_to_forms.html (brand
   guidelines 1.4, Motion). Three beats: open outward, turn while apart,
   close. 3.2 s each way, cubic-bezier(0.65, 0, 0.35, 1), pieces staggered.

   <svg class="fold-stage" data-from="swan" data-to="stone" data-mode="loop">
     loop: swan to stone and back, holding each state (home hero only).
     once: plays from -> to once when scrolled into view, then holds.
   Reduced motion: shows the end state (the stone for the loop). */
(function () {
  var D = {
    W: 1400, H: 1000,
    local: {
      lower: "M177.10 -78.97L-360.69 -185.94L-18.78 155.97L274.42 155.97Z",
      upper: "M-64.04 74.45L178.34 122.66L136.99 22.82L-170.53 -182.66Z",
      neck: "M-71.23 -281.87L-213.28 -281.87L33.73 314.47L209.67 138.53Z",
      head: "M-96.02 44.48L20.18 44.48L76.82 -12.15L18.72 -70.25Z",
      beak: "M-0.00 -28.78L-43.17 14.39L43.17 14.39Z"
    },
    states: {
      swan: { lower: [0, 644.86, 709.09], upper: [0, 634.86, 486.3], neck: [0, 906.16, 550.59], head: [0, 788.89, 205.19], beak: [0, 879.17, 235.28] },
      stone: { lower: [11.25, 771.88, 449.99], upper: [123.75, 746.26, 712.81], neck: [0.0, 495.2, 467.83], head: [78.75, 1045.53, 506.44], beak: [78.75, 1033.6, 600.85] },
      flight: { lower: [135, 782.86, 149.77], upper: [135, 558.53, 382.15], neck: [348.75, 936.84, 671.95], head: [191.25, 329.16, 365.84], beak: [101.25, 253.03, 436.05] }
    }
  };
  var ORDER = ["lower", "upper", "neck", "head", "beak"];
  var OFF = { lower: 0, upper: 0.015, neck: 0.03, head: 0.045, beak: 0.045 };
  var NS = "http://www.w3.org/2000/svg";
  var C = [D.W / 2, D.H / 2], K = 1.3;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* cubic-bezier(0.65, 0, 0.35, 1), solved for x by Newton steps */
  function bez(t) {
    var x1 = 0.65, y1 = 0, x2 = 0.35, y2 = 1, u = t;
    for (var i = 0; i < 6; i++) {
      var x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
      var dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
      if (Math.abs(dx) < 1e-6) break;
      u -= x / dx;
      u = Math.min(1, Math.max(0, u));
    }
    return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  }
  function seg(t, a, b) { return Math.min(1, Math.max(0, (t - a) / (b - a))); }

  function Stage(svg) {
    var els = {};
    ORDER.forEach(function (k) {
      var g = document.createElementNS(NS, "g");
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", D.local[k]);
      p.setAttribute("fill", k === "beak" ? "#EF3340" : "#0A0A0A");
      g.appendChild(p);
      svg.appendChild(g);
      els[k] = g;
    });
    this.draw = function (A, B, T) {
      ORDER.forEach(function (k) {
        var o = OFF[k], a = A[k], b = B[k];
        var e1 = bez(seg(T, o, 0.30 + o)), e2 = bez(seg(T, 0.26 + o * 0.5, 0.74 - o * 0.5)), e3 = bez(seg(T, 0.70 - o, 1 - o));
        var c0 = [a[1], a[2]], c1 = [b[1], b[2]];
        var c0e = [C[0] + (c0[0] - C[0]) * K, C[1] + (c0[1] - C[1]) * K];
        var c1e = [C[0] + (c1[0] - C[0]) * K, C[1] + (c1[1] - C[1]) * K];
        var a0 = Math.atan2(c0e[1] - C[1], c0e[0] - C[0]), a1 = Math.atan2(c1e[1] - C[1], c1e[0] - C[0]);
        var da = a1 - a0;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        var r0 = Math.hypot(c0e[0] - C[0], c0e[1] - C[1]), r1 = Math.hypot(c1e[0] - C[0], c1e[1] - C[1]);
        var am = a0 + da * e2, rm = r0 + (r1 - r0) * e2;
        var mx = C[0] + Math.cos(am) * rm, my = C[1] + Math.sin(am) * rm;
        var x = c0[0] + (c0e[0] - c0[0]) * e1 + (mx - c0e[0]) + (c1[0] - c1e[0]) * e3;
        var y = c0[1] + (c0e[1] - c0[1]) * e1 + (my - c0e[1]) + (c1[1] - c1e[1]) * e3;
        var dr = b[0] - a[0];
        while (dr > 180) dr -= 360;
        while (dr < -180) dr += 360;
        els[k].setAttribute("transform", "translate(" + x.toFixed(2) + "," + y.toFixed(2) + ") rotate(" + (a[0] + dr * e2).toFixed(3) + ")");
      });
    };
  }

  function run(svg) {
    var from = D.states[svg.dataset.from || "swan"];
    var to = D.states[svg.dataset.to || "stone"];
    var mode = svg.dataset.mode || "once";
    var cap = svg.dataset.caption ? document.getElementById(svg.dataset.caption) : null;
    var stage = new Stage(svg);
    var caps = cap ? { from: cap.dataset.from, to: cap.dataset.to } : null;

    function caption(which) {
      if (!cap) return;
      cap.style.opacity = 0;
      setTimeout(function () { cap.innerHTML = caps[which]; cap.style.opacity = 1; }, 380);
    }
    function animate(A, B, done) {
      var t0 = performance.now(), dur = 3200;
      function step(now) {
        var k = Math.min(1, (now - t0) / dur);
        stage.draw(A, B, k);
        if (k < 1) requestAnimationFrame(step); else if (done) done();
      }
      requestAnimationFrame(step);
    }

    if (reduce) {
      stage.draw(to, to, 1);
      if (cap) cap.innerHTML = caps.to;
      return;
    }
    stage.draw(from, from, 1);
    if (cap) cap.innerHTML = caps.from;

    if (mode === "loop") {
      var atStone = false, hidden = false;
      document.addEventListener("visibilitychange", function () { hidden = document.hidden; });
      (function cycle() {
        setTimeout(function () {
          if (hidden) { cycle(); return; }
          var A = atStone ? to : from, B = atStone ? from : to;
          caption(atStone ? "from" : "to");
          animate(A, B, function () { atStone = !atStone; cycle(); });
        }, atStone ? 2400 : 1600);
      })();
    } else {
      var started = false;
      var go = function () { if (started) return; started = true; caption("to"); animate(from, to); };
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { setTimeout(go, 400); io.disconnect(); } });
        }, { threshold: 0.6 });
        io.observe(svg);
      } else { go(); }
    }
  }

  document.querySelectorAll("svg.fold-stage").forEach(run);
})();
