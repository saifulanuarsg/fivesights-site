/* fivesights session hub: the one page participants open from the QR code.
   fivesights.co/s/<session>  (served by 404.html)  or  fivesights.co/s/?<session> */
(function () {
  "use strict";
  var API = "https://fivesights-pulse.vercel.app";
  var m = location.pathname.match(/^\/s\/([a-z0-9-]{3,60})\/?$/) || [null, (location.search.slice(1).match(/^[a-z0-9-]{3,60}/) || [""])[0]];
  var slug = (m && m[1] || "").toLowerCase();
  var root = document.getElementById("hub");
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function fail(msg) { root.innerHTML = ""; var h = el("h1", "title", msg); root.appendChild(h); }
  var CK = "fs-hub-code-" + (slug || "any");
  var code = ""; try { code = localStorage.getItem(CK) || ""; } catch (e) {}
  var last = "", timer = null;
  function ask(title, err) {
    last = ""; root.innerHTML = "";
    root.appendChild(el("p", "kicker", "fivesights session"));
    root.appendChild(el("h1", "title", title || "Enter your session code"));
    var f = el("form", "codeform"), i = el("input"); i.type = "text"; i.autocapitalize = "characters"; i.autocomplete = "off"; i.placeholder = "Session code"; i.value = "";
    var b = el("button", "btn", "Open"); b.type = "submit"; var m = el("p", "err", err || "");
    f.appendChild(i); f.appendChild(b); f.appendChild(m);
    f.onsubmit = function (e) { e.preventDefault(); code = i.value.trim(); try { localStorage.setItem(CK, code); } catch (x) {} load(); };
    root.appendChild(f); setTimeout(function () { i.focus(); }, 50);
  }
  function draw(j) {
    var sig = JSON.stringify(j); if (sig === last) return; last = sig;
    document.title = j.title + " · fivesights";
    root.innerHTML = "";
    root.appendChild(el("p", "kicker", j.subtitle || "Your session"));
    root.appendChild(el("h1", "title", j.title));
    if (j.note) root.appendChild(el("p", "note", j.note));
    var list = el("div", "links");
    if (!j.links.length) list.appendChild(el("p", "empty", "Nothing to open yet. Keep this page open; links appear here as the session goes on."));
    j.links.forEach(function (l, i) {
      var a = el("a", "link"); a.href = l.url; a.target = "_blank"; a.rel = "noopener";
      var n = el("span", "n", String(i + 1)); a.appendChild(n);
      var b = el("span", "body"); b.appendChild(el("span", "label", l.label)); if (l.desc) b.appendChild(el("span", "desc", l.desc));
      a.appendChild(b); a.appendChild(el("span", "go", "→"));
      var wrap = el("div", "item"); wrap.appendChild(a);
      if (l.passcode) {
        var pc = el("button", "pass"); pc.type = "button";
        pc.appendChild(el("span", "pl", "Passcode")); pc.appendChild(el("span", "pv", l.passcode)); var cp = el("span", "pc", "Copy"); pc.appendChild(cp);
        pc.onclick = function () { (navigator.clipboard ? navigator.clipboard.writeText(l.passcode) : Promise.reject()).then(function () { cp.textContent = "Copied"; setTimeout(function () { cp.textContent = "Copy"; }, 1500); }).catch(function () {}); };
        wrap.appendChild(pc);
      }
      list.appendChild(wrap);
    });
    root.appendChild(list);
    root.appendChild(el("p", "save", "Keep this page: add it to your home screen or bookmark it. New links appear here as the session goes on."));
  }
  function load() {
    if (!slug && !code) return ask();
    var q = (slug ? "s=" + encodeURIComponent(slug) : "") + (code ? (slug ? "&" : "") + "code=" + encodeURIComponent(code) : "");
    fetch(API + "/api/hub?" + q, { cache: "no-store" }).then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.needCode) return ask(j.title, j.error);
        if (!j.ok) { if (!slug) { try { localStorage.removeItem(CK); } catch (e) {} return ask("", j.error); } return fail(j.error || "This session page is not available."); }
        if (!slug && j.slug) { try { history.replaceState(null, "", "/s/" + j.slug); localStorage.setItem("fs-hub-code-" + j.slug, code); } catch (e) {} slug = j.slug; CK = "fs-hub-code-" + slug; }
        draw(j);
        if (!timer) timer = setInterval(function () { if (!document.hidden) load(); }, 20000);
      })
      .catch(function () { if (!last) fail("No connection. Try again in a moment."); });
  }
  load();
  document.addEventListener("visibilitychange", function () { if (!document.hidden) load(); });
})();
