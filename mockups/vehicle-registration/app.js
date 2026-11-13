// app.js — 목업 동작. 세그먼트 aria-pressed 토글 · 작업대 칸 전환 · 모달 결과 토스트. 서버 없음.
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
  document.querySelectorAll("[data-ggc-modal-close='approve'], [data-ggc-modal-close='reject']").forEach(function (b) {
    b.addEventListener("click", function () {
      var ok = b.getAttribute("data-ggc-modal-close") === "approve";
      if (window.GGC && GGC.toast) GGC.toast({ title: ok ? "승인했습니다" : "반려했습니다", desc: ok ? "출입 시스템에 등록됨 · 신청자에게 문자 발송" : "사유가 신청자에게 전달됨", variant: ok ? "success" : "warning" });
    });
  });
})();
