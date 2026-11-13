// app.js — 목업 동작. 세그먼트 · 작업대 칸 전환 · 확인 창 결과 토스트 · 인쇄 · 실시간 자막 흉내 · 집중모드. 서버 없음.
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
  // 실시간 자막 흉내 — 몇 초마다 「지금 발언」이 자막 목록으로 내려가고 새 발언이 온다.
  // 읽던 사람을 최신 위치로 끌고 가지 않는다(Operate 규칙): 맨 아래를 보고 있을 때만 따라 내려가고, 아니면 「새 자막 n · 최신으로」 단추를 띄운다.
  var SCRIPT = [
    "결산 잉여금 규모는 자료로 제출하겠습니다. 올해는 분기마다 추계를 다시 점검하고 있습니다.",
    "분기 점검 결과도 함께 제출해 주시기 바랍니다. 다음 질의는 체납액 징수입니다.",
    "고액 체납자 명단 공개 이후 징수율이 얼마나 올랐는지 설명해 주십시오.",
    "공개 이후 1년 동안 고액 체납액의 징수율이 12퍼센트포인트 올랐습니다.",
    "시군별 차이가 있을 텐데, 징수율이 낮은 시군에 대한 지원 계획이 있습니까?",
    "징수 전담 인력을 순회 배치하는 방안을 내년 예산안에 반영했습니다."
  ];
  document.querySelectorAll("[data-sm-live]").forEach(function (live) {
    var list = live.querySelector("[data-sm-lines]"), jump = live.querySelector("[data-sm-jump]");
    var nowT = live.querySelector("[data-sm-now-time]"), nowP = live.querySelector("[data-sm-now-text]");
    var count = live.querySelector("[data-sm-count]"), newN = live.querySelector("[data-sm-new]"), now = live.querySelector(".sm-now");
    if (!list || !nowP) return;
    var i = 0, unseen = 0, clock = nowT.textContent.split(":").map(Number);
    function atBottom() { return list.scrollHeight - list.scrollTop - list.clientHeight < 24; }
    function toBottom() { list.scrollTop = list.scrollHeight; unseen = 0; jump.hidden = true; }
    function place() { if (now && jump) live.style.setProperty("--sm-now-h", now.offsetHeight + "px"); }
    function tick() {
      var follow = atBottom();
      var li = document.createElement("li");
      li.innerHTML = "<time></time><p></p>";
      li.firstChild.textContent = nowT.textContent; li.lastChild.textContent = nowP.textContent;
      list.appendChild(li);
      if (count) count.textContent = String(Number(count.textContent) + 1);
      clock[2] += 20 + (i % 3) * 9; while (clock[2] >= 60) { clock[2] -= 60; clock[1] += 1; }
      nowT.textContent = clock.map(function (n) { return (n < 10 ? "0" : "") + n; }).join(":");
      nowP.textContent = SCRIPT[i++ % SCRIPT.length];
      place();
      if (follow) toBottom(); else { unseen += 1; newN.textContent = String(unseen); jump.hidden = false; }
    }
    list.addEventListener("scroll", function () { if (atBottom()) { unseen = 0; jump.hidden = true; } });
    if (jump) jump.addEventListener("click", toBottom);
    toBottom(); place();
    setInterval(tick, 4500);
  });
  // 집중모드 — 글자 크기 세 단계
  document.querySelectorAll("[data-sm-size]").forEach(function (g) {
    g.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-size]"); if (!b) return;
      var root = g.closest("[data-sm-live]"); if (root) root.setAttribute("data-size", b.getAttribute("data-size"));
      var list = root && root.querySelector("[data-sm-lines]"); if (list) list.scrollTop = list.scrollHeight;
    });
  });
  // 집중모드 — 브라우저 전체 화면(Esc 로 빠진다)
  document.querySelectorAll("[data-sm-fullscreen]").forEach(function (b) {
    var label = b.querySelector("[data-sm-fs-label]");
    if (!document.fullscreenEnabled) { b.hidden = true; return; }
    b.addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
    });
    document.addEventListener("fullscreenchange", function () { if (label) label.textContent = document.fullscreenElement ? "전체 화면 끝내기" : "전체 화면"; });
  });
})();
