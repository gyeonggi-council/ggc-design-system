// app.js — 목업 동작. 세그먼트 aria-pressed 토글만. 서버 없음.
(function () {
  document.querySelectorAll(".ggc-segmented[role=group]").forEach(function (g) {
    g.addEventListener("click", function (e) {
      var b = e.target.closest("button[aria-pressed]"); if (!b || b.disabled) return;
      g.querySelectorAll("button[aria-pressed]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });
})();
