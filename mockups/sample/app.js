// app.js — 목업 동작. 세그먼트 aria-pressed 토글 · 작업대 칸 전환 · 확인 창 결과 토스트 · 인쇄. 서버 없음.
(function () {
  document.querySelectorAll(".ggc-segmented[role=group]").forEach(function (g) {
    g.addEventListener("click", function (e) {
      var b = e.target.closest("button[aria-pressed]"); if (!b || b.disabled) return;
      g.querySelectorAll("button[aria-pressed]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });
  document.querySelectorAll("[data-work-pane]").forEach(function (b) {
    b.addEventListener("click", function () {
      var work = b.closest(".ggc-work"); if (!work) return;
      work.setAttribute("data-pane", b.getAttribute("data-work-pane"));
      work.querySelectorAll("[data-work-pane]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });
  // data-sm-toast="제목|설명|변형" — 확인 창의 실행 단추가 결과를 토스트로 알린다(목업이라 실제로 보내지 않는다)
  document.querySelectorAll("[data-sm-toast]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-sm-toast").split("|");
      if (window.GGC && GGC.toast) GGC.toast({ title: t[0], desc: t[1], variant: t[2] || "success" });
    });
  });
  document.querySelectorAll("[data-sm-print]").forEach(function (b) {
    b.addEventListener("click", function () { window.print(); });
  });
})();
