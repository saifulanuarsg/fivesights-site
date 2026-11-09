/* fivesights pulse: a one-screen-at-a-time survey.
   The page sets window.PULSE (survey id, stage, api base and the screens),
   then loads this file. Each screen carries one form; moving between
   screens plays the fold (brand guidelines 1.4, Motion), swan to the
   screen's form. Answers save to this browser as a draft until sent. */
(function () {
  "use strict";
  var P = window.PULSE;
  var root = document.getElementById("pulse");
  if (!P || !root) return;

  /* ---------- the fold ---------- */
  var LOCAL = {
    lower: "M177.10 -78.97L-360.69 -185.94L-18.78 155.97L274.42 155.97Z",
    upper: "M-64.04 74.45L178.34 122.66L136.99 22.82L-170.53 -182.66Z",
    neck: "M-71.23 -281.87L-213.28 -281.87L33.73 314.47L209.67 138.53Z",
    head: "M-96.02 44.48L20.18 44.48L76.82 -12.15L18.72 -70.25Z",
    beak: "M-0.00 -28.78L-43.17 14.39L43.17 14.39Z"
  };
  var STATES = {
    swan: { lower: [0, 644.86, 709.09], upper: [0, 634.86, 486.3], neck: [0, 906.16, 550.59], head: [0, 788.89, 205.19], beak: [0, 879.17, 235.28] },
    stone: { lower: [11.25, 771.88, 449.99], upper: [123.75, 746.26, 712.81], neck: [0, 495.2, 467.83], head: [78.75, 1045.53, 506.44], beak: [78.75, 1033.6, 600.85] },
    canary: { lower: [135, 782.86, 149.77], upper: [135, 558.53, 382.15], neck: [348.75, 936.84, 671.95], head: [191.25, 329.16, 365.84], beak: [101.25, 253.03, 436.05] },
    rhino: { lower: [112.5, 568.4, 472.33], upper: [78.75, 268.01, 590.91], neck: [247.5, 846.31, 467.56], head: [135, 1100.96, 428.87], beak: [225, 1176.79, 471.43] },
    dog: { lower: [236.25, 1083.96, 489.79], upper: [78.75, 249.35, 703.42], neck: [292.5, 700.5, 549.87], head: [56.25, 1167.35, 219.51], beak: [146.25, 1124.62, 133.69] },
    cat: { lower: [247.5, 523.03, 438.21], upper: [90, 835.04, 824.87], neck: [45, 643.41, 753.28], head: [90, 478.4, 92.81], beak: [270, 547.72, 54.9] }
  };
  var ORDER = ["lower", "upper", "neck", "head", "beak"];
  var OFF = { lower: 0, upper: 0.015, neck: 0.03, head: 0.045, beak: 0.045 };
  var NS = "http://www.w3.org/2000/svg", C = [700, 500], K = 1.3;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function bez(t) {
    var x1 = 0.65, x2 = 0.35, u = t;
    for (var i = 0; i < 6; i++) {
      var x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
      var dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
      if (Math.abs(dx) < 1e-6) break;
      u = Math.min(1, Math.max(0, u - x / dx));
    }
    return 3 * (1 - u) * u * u + u * u * u;
  }
  function seg(t, a, b) { return Math.min(1, Math.max(0, (t - a) / (b - a))); }

  var fold = (function () {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1400 1000");
    svg.setAttribute("class", "fold");
    svg.setAttribute("aria-hidden", "true");
    var els = {};
    ORDER.forEach(function (k) {
      var g = document.createElementNS(NS, "g"), p = document.createElementNS(NS, "path");
      p.setAttribute("d", LOCAL[k]);
      p.setAttribute("fill", k === "beak" ? "#EF3340" : "#0A0A0A");
      g.appendChild(p); svg.appendChild(g); els[k] = g;
    });
    var cur = "swan", raf = 0;
    function draw(A, B, T) {
      ORDER.forEach(function (k) {
        var o = OFF[k], a = A[k], b = B[k];
        var e1 = bez(seg(T, o, 0.30 + o)), e2 = bez(seg(T, 0.26 + o * 0.5, 0.74 - o * 0.5)), e3 = bez(seg(T, 0.70 - o, 1 - o));
        var c0e = [C[0] + (a[1] - C[0]) * K, C[1] + (a[2] - C[1]) * K];
        var c1e = [C[0] + (b[1] - C[0]) * K, C[1] + (b[2] - C[1]) * K];
        var a0 = Math.atan2(c0e[1] - C[1], c0e[0] - C[0]), a1 = Math.atan2(c1e[1] - C[1], c1e[0] - C[0]);
        var da = a1 - a0;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        var r0 = Math.hypot(c0e[0] - C[0], c0e[1] - C[1]), r1 = Math.hypot(c1e[0] - C[0], c1e[1] - C[1]);
        var am = a0 + da * e2, rm = r0 + (r1 - r0) * e2;
        var x = a[1] + (c0e[0] - a[1]) * e1 + (C[0] + Math.cos(am) * rm - c0e[0]) + (b[1] - c1e[0]) * e3;
        var y = a[2] + (c0e[1] - a[2]) * e1 + (C[1] + Math.sin(am) * rm - c0e[1]) + (b[2] - c1e[1]) * e3;
        var dr = b[0] - a[0];
        while (dr > 180) dr -= 360;
        while (dr < -180) dr += 360;
        els[k].setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ") rotate(" + (a[0] + dr * e2).toFixed(2) + ")");
      });
    }
    draw(STATES.swan, STATES.swan, 1);
    return {
      el: svg,
      to: function (name) {
        if (!STATES[name] || name === cur) return;
        var A = STATES[cur], B = STATES[name];
        cur = name;
        cancelAnimationFrame(raf);
        if (reduce) { draw(B, B, 1); return; }
        var t0 = performance.now(), dur = 1800;
        (function step(now) {
          var k = Math.min(1, (now - t0) / dur);
          draw(A, B, k);
          if (k < 1) raf = requestAnimationFrame(step);
        })(t0);
      }
    };
  })();

  /* ---------- state ---------- */
  var KEY = "fs-pulse-" + P.survey + "-" + P.stage;
  var state = { step: 0, passcode: "", answers: {} };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved && saved.answers) state = saved; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  var A = state.answers;
  if (!state.pid) state.pid = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)).toLowerCase();
  var SAVES = P.screens.some(function (s) { return s.save; });

  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") el.textContent = attrs[k];
      else if (k === "html") el.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }

  /* ---------- items ---------- */
  var uid = 0;
  function field(item, body) {
    var id = "q" + (++uid);
    var lab = h(item.type === "text" || item.type === "long" || item.type === "word" || item.type === "select" ? "label" : "p",
      { class: "q-label", id: id + "l" }, [item.label, item.optional ? h("span", { class: "opt", text: " optional" }) : null]);
    if (lab.tagName === "LABEL") lab.setAttribute("for", id);
    if (!item.label) lab = null;
    var wrap = h("div", { class: "q q-" + item.type, "data-id": item.id }, [lab, item.hint ? h("p", { class: "q-hint", text: item.hint }) : null]);
    wrap.appendChild(body(id));
    return wrap;
  }

  var RENDER = {
    select: function (item) {
      return field(item, function (id) {
        var s = h("select", { id: id, required: !item.optional, onchange: function () { A[item.id] = s.value; save(); } },
          [h("option", { value: "", text: item.placeholder || "Choose one" })].concat(item.options.map(function (o) {
            return h("option", { value: o, text: o });
          })));
        if (A[item.id]) s.value = A[item.id];
        return s;
      });
    },
    chips: function (item) {
      return field(item, function (id) {
        var g = h("div", { class: "chips", role: "radiogroup", "aria-labelledby": id + "l" });
        item.options.forEach(function (o) {
          var b = h("button", { type: "button", class: "chip", role: "radio", "aria-checked": A[item.id] === o ? "true" : "false", text: o,
            onclick: function () {
              A[item.id] = A[item.id] === o ? "" : o; save();
              g.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-checked", c.textContent === A[item.id] ? "true" : "false"); });
            } });
          g.appendChild(b);
        });
        return g;
      });
    },
    text: function (item) {
      return field(item, function (id) {
        var i = h("input", { id: id, type: "text", maxlength: item.max || 160, placeholder: item.placeholder || "", autocomplete: "off",
          oninput: function () { A[item.id] = i.value; save(); } });
        i.value = A[item.id] || "";
        return i;
      });
    },
    word: function (item) {
      return field(item, function (id) {
        var i = h("input", { id: id, type: "text", maxlength: 30, placeholder: item.placeholder || "", autocomplete: "off", class: "word",
          oninput: function () { A[item.id] = i.value; save(); } });
        i.value = A[item.id] || "";
        return i;
      });
    },
    photo: function (item) {
      return field(item, function (id) {
        var box = h("div", { class: "photo" });
        var prev = h("img", { alt: "", class: "thumb" });
        var note = h("p", { class: "q-hint" });
        function show() {
          var v = A[item.id] || "";
          if (v.indexOf("data:image") === 0) { prev.src = v; prev.style.display = "block"; note.textContent = "Saves when you tap Next."; }
          else if (v.indexOf("photo:") === 0) { prev.style.display = "none"; note.textContent = "Photo saved. Take another to replace it."; }
          else { prev.style.display = "none"; note.textContent = ""; }
        }
        var inp = h("input", { id: id, type: "file", accept: "image/*", capture: "environment", onchange: function () {
          var f = inp.files && inp.files[0]; if (!f) return;
          note.textContent = "Preparing...";
          var img = new Image(), url = URL.createObjectURL(f);
          img.onload = function () {
            var m = 1280, w = img.width, hh = img.height, k = Math.min(1, m / Math.max(w, hh));
            var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(hh * k);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            A[item.id] = c.toDataURL("image/jpeg", 0.7); URL.revokeObjectURL(url); save(); show();
          };
          img.onerror = function () { note.textContent = "That file could not be read. Try a photo."; };
          img.src = url;
        } });
        box.appendChild(h("label", { for: id, class: "btn btn-ghost photo-btn", text: "Take or choose a photo" }));
        box.appendChild(inp); box.appendChild(prev); box.appendChild(note); show();
        return box;
      });
    },
    long: function (item) {
      return field(item, function (id) {
        var t = h("textarea", { id: id, rows: 3, maxlength: item.max || 600, placeholder: item.placeholder || "",
          oninput: function () { A[item.id] = t.value; save(); } });
        t.value = A[item.id] || "";
        return t;
      });
    },
    scale: function (item) {
      return field(item, function (id) {
        var box = h("div", { class: "scale-rows" });
        item.rows.forEach(function (r) {
          var key = item.id + "_" + r.id;
          var g = h("div", { class: "dots", role: "radiogroup", "aria-label": r.label });
          for (var n = 1; n <= 5; n++) (function (n) {
            g.appendChild(h("button", { type: "button", class: "dot", role: "radio", "aria-checked": A[key] === n ? "true" : "false",
              "aria-label": n + " of 5", text: String(n),
              onclick: function () {
                A[key] = n; save();
                g.querySelectorAll(".dot").forEach(function (d, i) { d.setAttribute("aria-checked", i + 1 === n ? "true" : "false"); });
              } }));
          })(n);
          box.appendChild(h("div", { class: "scale-row" }, [h("p", { class: "row-label", text: r.label }), g]));
        });
        box.appendChild(h("div", { class: "scale-ends", "aria-hidden": "true" }, [h("span", { text: item.low }), h("span", { text: item.high })]));
        return box;
      });
    },
    tug: function (item) {
      return field(item, function () {
        var box = h("div", { class: "tug" });
        var STOPS = [0, 17, 33, 50, 67, 83, 100];
        ["now", "next"].forEach(function (which) {
          var key = item.id + "_" + which;
          var g = h("div", { class: "taps", role: "radiogroup",
            "aria-label": (which === "now" ? "Where we are now" : "Where we should be next") + ", from " + item.left + " to " + item.right });
          STOPS.forEach(function (v, n) {
            g.appendChild(h("button", { type: "button", class: "tap", role: "radio", "aria-checked": A[key] === v ? "true" : "false",
              "aria-label": "Point " + (n + 1) + " of 7",
              onclick: function () {
                A[key] = v; save();
                g.querySelectorAll(".tap").forEach(function (b, i) { b.setAttribute("aria-checked", STOPS[i] === v ? "true" : "false"); });
              } }));
          });
          box.appendChild(h("div", { class: "tug-row tug-" + which }, [h("span", { class: "tug-tag", text: which === "now" ? "NOW" : "NEXT" }), g]));
        });
        var poles = h("div", { class: "tug-poles" }, [h("span", { text: item.left }), h("span", { text: item.right })]);
        box.insertBefore(poles, box.firstChild);
        return box;
      });
    }
  };

  function missing(screen) {
    var miss = [];
    (screen.items || []).forEach(function (it) {
      if (it.optional) return;
      if (it.type === "scale") { if (it.rows.some(function (r) { return A[it.id + "_" + r.id] == null; })) miss.push(it.id); }
      else if (it.type === "tug") { if (A[it.id + "_now"] == null || A[it.id + "_next"] == null) miss.push(it.id); }
      else if (!String(A[it.id] || "").trim()) miss.push(it.id);
    });
    return miss;
  }

  /* ---------- screens ---------- */
  var screens = P.screens;
  var stage = h("div", { class: "fold-wrap" }, [fold.el]);
  var bar = h("div", { class: "progress", "aria-hidden": "true" });
  var card = h("main", { class: "card", id: "main", tabindex: "-1" });
  screens.forEach(function () { bar.appendChild(h("span")); });
  root.appendChild(bar); root.appendChild(stage); root.appendChild(card);

  function api(path, body) {
    return fetch(P.api + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { j.status = r.status; return j; }); });
  }

  function show(i, focus) {
    state.step = i; save();
    var s = screens[i];
    fold.to(s.form || "swan");
    Array.prototype.forEach.call(bar.children, function (b, n) { b.className = n < i ? "done" : n === i ? "on" : ""; });
    card.innerHTML = "";
    if (s.kicker) card.appendChild(h("p", { class: "label", text: s.kicker }));
    card.appendChild(h(i === 0 ? "h1" : "h2", { class: "title", text: s.title }));
    if (s.intro) card.appendChild(h("div", { class: "intro", html: s.intro }));
    if (s.privacy) card.appendChild(h("div", { class: "privacy", html: s.privacy }));

    if (s.kind === "gate") {
      var inp = h("input", { id: "pass", type: "text", autocomplete: "off", autocapitalize: "characters", placeholder: "Passcode", value: state.passcode || "" });
      var msg = h("p", { class: "err", role: "alert" });
      var go = h("button", { type: "submit", class: "btn", text: s.cta || "Start" });
      var form = h("form", { class: "gate", onsubmit: function (e) {
        e.preventDefault(); msg.textContent = ""; go.disabled = true; go.textContent = "Checking...";
        api("/api/check", { survey: P.survey, passcode: inp.value }).then(function (j) {
          go.disabled = false; go.textContent = s.cta || "Start";
          if (j.ok) { state.passcode = inp.value.trim(); save(); show(i + 1, true); }
          else msg.textContent = j.status === 401 ? "That passcode does not match. It is in the message from HR." : "Something went wrong. Check your connection and try again.";
        }).catch(function () { go.disabled = false; go.textContent = s.cta || "Start"; msg.textContent = "No connection. Try again in a moment."; });
      } }, [h("label", { for: "pass", class: "q-label", text: "Passcode" }), inp, msg, go]);
      card.appendChild(form);
    } else if (s.kind === "done") {
      if (s.outro) card.appendChild(h("div", { class: "intro", html: s.outro }));
      if (s.again) card.appendChild(h("div", { class: "actions" }, [h("button", { type: "button", class: "btn", text: s.again, onclick: function () {
        try { localStorage.removeItem(KEY + "-sent"); } catch (e) {}
        Object.keys(A).forEach(function (k) { if (k !== "table") delete A[k]; });
        show(1, true);
      } })]));
    } else {
      var list = h("div", { class: "items" });
      (s.items || []).forEach(function (it) { list.appendChild(RENDER[it.type](it)); });
      card.appendChild(list);
      var err = h("p", { class: "err", role: "alert" });
      var last = screens[i + 1] && screens[i + 1].kind === "done";
      var next = h("button", { type: "button", class: "btn", text: last ? (s.cta || "Send") : (s.cta || "Next") });
      var back = i > 1 ? h("button", { type: "button", class: "btn btn-ghost", text: "Back", onclick: function () { show(i - 1, true); } }) : null;
      next.addEventListener("click", function () {
        var miss = missing(s);
        card.querySelectorAll(".q").forEach(function (q) { q.classList.toggle("needs", miss.indexOf(q.dataset.id) > -1); });
        if (miss.length) {
          err.textContent = s.missingText || "One more to go on this screen. The ones marked need an answer.";
          var first = card.querySelector(".q.needs"); if (first) first.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
          return;
        }
        if (!last) {
          if (s.save) {
            api("/api/submit", { survey: P.survey, stage: P.stage, passcode: state.passcode, answers: A, pid: state.pid, step: i }).then(function (j) {
              if (j && j.photos) { Object.keys(j.photos).forEach(function (k) { A[k] = j.photos[k]; }); save(); }
            }).catch(function () {});
          }
          show(i + 1, true); return;
        }
        next.disabled = true; next.textContent = "Sending...";
        api("/api/submit", { survey: P.survey, stage: P.stage, passcode: state.passcode, answers: A, pid: SAVES ? state.pid : undefined, step: i }).then(function (j) {
          if (j.ok) {
            if (SAVES) { try { localStorage.setItem(KEY + "-sent", "1"); } catch (e) {} show(i + 1, true); return; }
            try { localStorage.removeItem(KEY); localStorage.setItem(KEY + "-sent", "1"); } catch (e) {}
            show(i + 1, true);
          } else {
            next.disabled = false; next.textContent = s.cta || "Send";
            err.textContent = j.status === 401 ? "The passcode no longer matches. Reload the page and enter it again." : "That did not send. Your answers are saved on this phone; try again.";
          }
        }).catch(function () {
          next.disabled = false; next.textContent = s.cta || "Send";
          err.textContent = "No connection. Your answers are saved on this phone; try again when you are back online.";
        });
      });
      card.appendChild(err);
      card.appendChild(h("div", { class: "actions" }, [back, next]));
    }
    if (s.foot) card.appendChild(h("p", { class: "foot", html: s.foot }));
    window.scrollTo(0, 0);
    if (focus) card.focus({ preventScroll: true });
  }

  var sent = false;
  try { sent = localStorage.getItem(KEY + "-sent") === "1"; } catch (e) {}
  var start = sent ? screens.length - 1 : Math.min(state.step || 0, screens.length - 2);
  if (!state.passcode && start > 0 && !sent) start = 0;
  show(start, false);
})();
