/* =============================================================================
 * ggc-behaviors.js — 경기도의회 공통 컴포넌트 동작 v2.0 (2026-08-29)
 * 전제: design/ggc-components.css v2.0 (마크업 계약은 그 파일의 §14·§19·§9 주석)
 *
 * 하는 일은 셋뿐이다. 전부 **마크업의 ARIA 상태를 옮기는 것**이고, 스타일은 CSS 가 그 상태를
 * 보고 그린다. 그래서 이 파일이 없어도 화면은 깨지지 않는다 — 동작만 없다.
 *   ① 탭      role="tab" 의 aria-selected · tabindex(roving) · 패널 hidden · 화살표/Home/End
 *   ② 모달    <dialog>.showModal() · data-ggc-modal-open / -close · 배경 클릭 · 포커스 복귀
 *   ③ drawer  ≤900px 에서 .ggc-lnb[data-open] · ESC · 바깥 클릭
 *   ④ 대민 메뉴 .ggc-main-menu[data-open](모바일 패널) · [data-ggc-submenu] aria-expanded ·
 *             [data-ggc-search-toggle] 통합검색 패널  (ggc-public.css, v2.0)
 *
 * 외부 파일 하나, 인라인 0 — eGovFrame CSP(unsafe-inline 금지)에서도 그대로 붙는다.
 * 의존성 0. React 서비스는 이 파일 대신 Tier 2 레지스트리 컴포넌트를 쓴다.
 *
 * 사용: <script src="ggc-behaviors.js" defer></script>
 *       동적으로 삽입한 마크업은 GGC.init(루트요소) 로 다시 묶는다.
 * ============================================================================= */
(function () {
  "use strict";
  var GGC = window.GGC = window.GGC || {};

  /* ------------------------------------------------------------------ ① 탭 */
  function initTabs(root) {
    (root || document).querySelectorAll(".ggc-tabs").forEach(function (tabs) {
      if (tabs.__ggcTabs) return;
      var list = tabs.querySelector('[role="tablist"]');
      if (!list) return;
      tabs.__ggcTabs = true;
      var tabEls = [].slice.call(list.querySelectorAll('[role="tab"]'));

      function select(tab, focus) {
        tabEls.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls") || "");
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
        tabs.dispatchEvent(new CustomEvent("ggc:tabchange", { detail: { tab: tab }, bubbles: true }));
      }

      tabEls.forEach(function (t) {
        t.addEventListener("click", function () { select(t, false); });
        t.addEventListener("keydown", function (e) {
          var i = tabEls.indexOf(t), n = tabEls.length, j = null;
          if (e.key === "ArrowRight") j = (i + 1) % n;
          else if (e.key === "ArrowLeft") j = (i - 1 + n) % n;
          else if (e.key === "Home") j = 0;
          else if (e.key === "End") j = n - 1;
          if (j === null) return;
          e.preventDefault();
          select(tabEls[j], true);
        });
      });

      var current = tabEls.filter(function (t) {
        return t.getAttribute("aria-selected") === "true";
      })[0] || tabEls[0];
      if (current) select(current, false);
    });
  }

  /* ---------------------------------------------------------------- ② 모달 */
  var openerOf = typeof WeakMap === "function" ? new WeakMap() : null;

  function resolve(target) {
    return typeof target === "string" ? document.querySelector(target) : target;
  }

  function anyOpen() {
    return !!document.querySelector("dialog.ggc-modal[open]");
  }

  function openModal(target, opener) {
    var dialog = resolve(target);
    if (!dialog || dialog.open || typeof dialog.showModal !== "function") return;
    if (openerOf) openerOf.set(dialog, opener || document.activeElement);
    dialog.showModal();
    document.documentElement.setAttribute("data-ggc-modal-active", "");
    /* 첫 포커스: autofocus > 본문의 첫 입력 > 주 버튼 > 닫기 */
    var first = dialog.querySelector("[autofocus]") ||
      dialog.querySelector(".body input:not([type=hidden]), .body select, .body textarea") ||
      dialog.querySelector(".foot .ggc-btn--primary") ||
      dialog.querySelector(".close");
    if (first) first.focus();
    dialog.dispatchEvent(new CustomEvent("ggc:open", { bubbles: true }));
  }

  function closeModal(target, value) {
    var dialog = resolve(target);
    if (!dialog || !dialog.open) return;
    dialog.close(value);
  }

  function initModals(root) {
    (root || document).querySelectorAll("dialog.ggc-modal").forEach(function (dialog) {
      if (dialog.__ggcModal) return;
      dialog.__ggcModal = true;
      function released() {
        if (!anyOpen()) document.documentElement.removeAttribute("data-ggc-modal-active");
        var back = openerOf && openerOf.get(dialog);
        if (back && typeof back.focus === "function" && document.contains(back)) back.focus();
      }
      /* 'close' 이벤트는 브라우저가 한 박자 늦게 보낸다(ESC 경로에서 실측 수백 ms).
         open 속성이 사라지는 순간을 직접 보고 잠금을 푼다 — 누가 닫았든 같다. */
      if (typeof MutationObserver === "function") {
        new MutationObserver(function () { if (!dialog.open) released(); })
          .observe(dialog, { attributes: true, attributeFilter: ["open"] });
      } else {
        dialog.addEventListener("close", released);
      }
      /* 배경 클릭으로 닫기 — 확인 다이얼로그(--alert)는 명시적 선택만 받는다 */
      dialog.addEventListener("click", function (e) {
        if (e.target === dialog && !dialog.classList.contains("ggc-modal--alert")) dialog.close();
      });
    });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;
    /* 값이 있는 트리거만 오프너다 — <html> 의 잠금 표식(data-ggc-modal-active)과 이름을
       달리 둔 이유가 이것이다. 같은 이름이면 모달 안의 모든 클릭이 <html> 을 오프너로 잡는다
       (2026-08-29 실제로 그랬다). */
    var opener = t.closest("[data-ggc-modal-open]");
    if (opener && opener.getAttribute("data-ggc-modal-open")) {
      e.preventDefault();
      openModal(opener.getAttribute("data-ggc-modal-open"), opener);
      return;
    }
    var closer = t.closest("[data-ggc-modal-close]");
    if (closer) {
      e.preventDefault();
      closeModal(closer.closest("dialog.ggc-modal"), closer.getAttribute("data-ggc-modal-close") || "");
    }
  });

  /* --------------------------------------------------------------- ③ drawer */
  function lnb() { return document.querySelector(".ggc-lnb"); }

  function setDrawer(open) {
    var nav = lnb();
    if (!nav) return;
    if (open) nav.setAttribute("data-open", "true"); else nav.removeAttribute("data-open");
    document.querySelectorAll("[data-ggc-drawer-toggle]").forEach(function (b) {
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function toggleDrawer() {
    var nav = lnb();
    if (nav) setDrawer(nav.getAttribute("data-open") !== "true");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-ggc-drawer-toggle]") : null;
    if (t) { e.preventDefault(); toggleDrawer(); return; }
    var nav = lnb();
    if (nav && nav.getAttribute("data-open") === "true" && !nav.contains(e.target)) setDrawer(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var nav = lnb();
    if (nav && nav.getAttribute("data-open") === "true") setDrawer(false);
  });

  /* ------------------------------------------ ④ 대민 주 메뉴 · 통합검색 (ggc-public.css) */
  function mainMenu() { return document.querySelector(".ggc-main-menu"); }

  function setMenu(open) {
    var nav = mainMenu();
    if (!nav) return;
    if (open) nav.setAttribute("data-open", "true"); else nav.removeAttribute("data-open");
    if (open) document.documentElement.setAttribute("data-ggc-menu-active", "");
    else document.documentElement.removeAttribute("data-ggc-menu-active");
    document.querySelectorAll("[data-ggc-menu-toggle]").forEach(function (b) {
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (open) {
      var first = nav.querySelector(".head .close, a, button");
      if (first) first.focus();
    }
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var toggle = e.target.closest("[data-ggc-menu-toggle]");
    if (toggle) {
      e.preventDefault();
      var nav = mainMenu();
      var open = !(nav && nav.getAttribute("data-open") === "true");
      setMenu(open);
      if (!open && toggle.closest(".ggc-main-menu")) {
        var outer = document.querySelector(".ggc-header [data-ggc-menu-toggle]");
        if (outer) outer.focus();
      }
      return;
    }
    /* 2단 펼침 — 모바일 아코디언. PC 에서는 hover/focus-within 이 CSS 로 열지만
       aria-expanded 도 같이 옮겨 키보드·터치에서 상태가 맞게 한다 */
    var sub = e.target.closest("[data-ggc-submenu]");
    if (sub) {
      e.preventDefault();
      var on = sub.getAttribute("aria-expanded") === "true";
      sub.closest(".depth1") && sub.closest(".depth1").querySelectorAll("[data-ggc-submenu]").forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
      });
      sub.setAttribute("aria-expanded", on ? "false" : "true");
      return;
    }
    var search = e.target.closest("[data-ggc-search-toggle]");
    if (search) {
      e.preventDefault();
      var panel = document.getElementById(search.getAttribute("aria-controls") || "") ||
        document.querySelector(".ggc-header .site-search");
      if (!panel) return;
      var isOpen = panel.getAttribute("data-open") === "true";
      if (isOpen) panel.removeAttribute("data-open"); else panel.setAttribute("data-open", "true");
      search.setAttribute("aria-expanded", isOpen ? "false" : "true");
      if (!isOpen) { var inp = panel.querySelector("input"); if (inp) inp.focus(); }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var nav = mainMenu();
    if (nav && nav.getAttribute("data-open") === "true") {
      setMenu(false);
      var outer = document.querySelector(".ggc-header [data-ggc-menu-toggle]");
      if (outer) outer.focus();
    }
  });

  /* ------------------------------------------------------------------ 공개 */
  GGC.toggleMenu = function () { var nav = mainMenu(); setMenu(!(nav && nav.getAttribute("data-open") === "true")); };
  GGC.initTabs = initTabs;
  GGC.initModals = initModals;
  GGC.openModal = openModal;
  GGC.closeModal = closeModal;
  GGC.toggleDrawer = toggleDrawer;
  GGC.init = function (root) { initTabs(root); initModals(root); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { GGC.init(); });
  } else {
    GGC.init();
  }
})();
