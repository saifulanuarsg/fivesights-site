/* Placeholder preview only: the full-screen film player. */
(function () {
  var p = document.querySelector(".player");
  if (!p) return;
  var playBtn = p.querySelector("[data-pause]");
  function open() { p.classList.add("open"); document.body.style.overflow = "hidden"; requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add("playing"); }); }); }
  function close() { p.classList.remove("open", "playing"); document.body.style.overflow = ""; }
  document.querySelectorAll("[data-film]").forEach(function (b) { b.addEventListener("click", open); });
  p.querySelector("[data-close]").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  playBtn.addEventListener("click", function () {
    var playing = p.classList.toggle("playing");
    playBtn.textContent = playing ? "Pause" : "Play";
  });
  p.querySelector("[data-sound]").addEventListener("click", function (e) {
    e.target.textContent = e.target.textContent === "Sound off" ? "Sound on" : "Sound off";
  });
})();
