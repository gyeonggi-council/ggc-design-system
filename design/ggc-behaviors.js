/* =============================================================================
 * ggc-behaviors.js — 경기도의회 공통 컴포넌트 동작 v3.2 (2026-10-24)
 * 전제: design/ggc-components.css v3.2 (마크업 계약은 그 파일의 §14·§19·§9 주석)
 *
 * 하는 일은 전부 **마크업의 ARIA 상태를 옮기는 것**이고, 스타일은 CSS 가 그 상태를
 * 보고 그린다. 그래서 이 파일이 없어도 화면은 깨지지 않는다 — 동작만 없다.
 *   ① 탭      role="tab" 의 aria-selected · tabindex(roving) · 패널 hidden · 화살표/Home/End
 *   ② 모달    <dialog>.showModal() · data-ggc-modal-open / -close · 배경 클릭 · 포커스 복귀
 *   ③ drawer  PC 접기 [data-ggc-lnb-toggle] · ≤900px 「전체메뉴」 오른쪽 서랍 .ggc-lnb[data-open] · ESC · 바깥 클릭 (v3.2 — 단추 둘로 나눔)
 *   ④ 대민 메뉴 .ggc-main-menu[data-open](모바일 패널) · [data-ggc-submenu] aria-expanded ·
 *             [data-ggc-search-toggle] 통합검색 패널  (ggc-public.css, v2.0)
 *   ⑤ 토스트   GGC.toast({title, desc, variant, duration, action}) · [data-ggc-toast] 선언형 · 3개 상한 · hover/focus 에 정지
 *   ⑥ 메뉴     details.ggc-menu — 열리면 첫 항목, ↑↓ Home End, ESC/바깥 클릭/실행 시 닫고 summary 복귀
 *   ⑦ 파일     [data-ggc-file] — change/drop → .ggc-file-list 갱신, 삭제를 input.files 에 되돌림(DataTransfer)
 *   ⑧ 툴팁     ESC 로 hover/focus 중인 .ggc-tooltip 닫기(WCAG 1.4.13), 떠나면 복구
 *   ⑨ 리스트박스 [data-ggc-listbox] — aria-activedescendant · ↑↓ Home End · Enter/Space · 앞글자 · .filter
 *   ⑩ 페이지 내 내비 [data-ggc-in-page-nav] — 기준선(25%)을 지난 마지막 제목에 aria-current="location"
 *   ⑪ 긴 작업  [data-ggc-job] — 경과 시간 글자 · 오래 걸리면 data-slow (v3.2)
 *   ⑫ 링크 화면 .ggc-solo — 글자 크게(aria-pressed · 기억) · iOS 키보드가 덮으면 html[data-ggc-typing] · .ggc-modal--full 뒤 문서 고정 (v3.2)
 *   ⑬ 서명    [data-ggc-signature] — 그리기 · 다시 쓰기 · 폭이 바뀔 때만 새로 · ggc:signature 이벤트 (v3.2)
 *   ⑭ 문서 보기 [data-ggc-viewer] — 배율 · 폭 맞춤 · 쪽 이동 · 지금 쪽 · 상태에 따라 단추 끄기 (v3.2)
 *   ⑮ 두 칸   [data-ggc-split] — 경계 끌기·키보드 · 폭 기억 · 접기(세션) · ≤1100px 한 칸씩 (v3.2)
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
  var lockY = 0;

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
    if (dialog.classList.contains("ggc-modal--full") && !document.documentElement.hasAttribute("data-ggc-modal-lock")) {
      /* 전체 화면 창(v3.2) — 뒤 문서를 제자리에 고정한다. overflow:hidden 만으로는 iOS·카톡이 뒤를 끌어 올린다 */
      lockY = window.pageYOffset || 0;
      document.body.style.top = -lockY + "px";
      document.documentElement.setAttribute("data-ggc-modal-lock", "");
    }
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
        if (!anyOpen()) {
          document.documentElement.removeAttribute("data-ggc-modal-active");
          if (document.documentElement.hasAttribute("data-ggc-modal-lock")) {
            document.documentElement.removeAttribute("data-ggc-modal-lock");
            document.body.style.top = "";
            window.scrollTo(0, lockY);
          }
        }
        var back = openerOf && openerOf.get(dialog);
        if (back && typeof back.focus === "function" && document.contains(back)) back.focus({ preventScroll: true });   /* 되살린 스크롤을 다시 움직이지 않게 */
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

  /* --------------------------------------------------------------- ③ drawer
   * v3.2(ADR 0014) — 단추 둘. 마크업에 없으면 만든다.
   *   [data-ggc-lnb-toggle]    PC(>900) · GNB 맨 앞 · LNB 를 아이콘 줄로 접고 편다(접힘은 이 화면에서 기억)
   *   [data-ggc-drawer-toggle] ≤900 · GNB 맨 끝 「전체메뉴」 · 오른쪽 서랍을 연다 — 대민 셸 .action.menu 와 같은 자리·같은 말.
   *                            옛 마크업이 GNB 맨 앞에 두었어도 맨 끝으로 옮긴다(보이는 순서 = 읽는 순서) */
  function lnb() { return document.querySelector(".ggc-lnb"); }
  var drawerMedia = window.matchMedia('(max-width: 900px)');
  var drawerOpener, drawerBackdrop, lnbCollapsed = false;
  var MENU_SVG = '<svg class="ggc-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';   // lucide menu
  var CLOSE_SVG = '<svg class="ggc-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>';   // lucide x

  function initDrawer() {
    var nav = lnb(), header = document.querySelector('.ggc-shell > .ggc-gnb');
    if (!nav || !header || nav.__ggcDrawer) return;
    nav.__ggcDrawer = true;
    if (!nav.id) nav.id = 'ggc-navigation';
    lnbCollapsed = nav.classList.contains('ggc-lnb--icon');
    var collapse = header.querySelector('[data-ggc-lnb-toggle]');
    if (!collapse) {
      collapse = document.createElement('button');
      collapse.type = 'button';
      collapse.className = 'ggc-icon-btn';
      collapse.setAttribute('data-ggc-lnb-toggle', '');
      collapse.innerHTML = MENU_SVG;
      header.prepend(collapse);
    }
    collapse.setAttribute('aria-controls', nav.id);
    var toggle = header.querySelector('[data-ggc-drawer-toggle]');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.setAttribute('data-ggc-drawer-toggle', '');
    }
    if (!toggle.textContent.trim()) {   // 아이콘만 있던 옛 단추 — 대민 셸처럼 「전체메뉴」 글자를 붙이고, 글자와 다른 aria-label 은 지운다(WCAG 2.5.3)
      toggle.classList.remove('ggc-icon-btn');
      toggle.classList.add('ggc-gnb-menu');
      toggle.removeAttribute('aria-label');
      if (!toggle.querySelector('svg')) toggle.insertAdjacentHTML('afterbegin', MENU_SVG);
      toggle.insertAdjacentHTML('beforeend', '<span>전체메뉴</span>');
    }
    toggle.classList.remove('ex-only-narrow');
    toggle.setAttribute('aria-controls', nav.id);
    header.append(toggle);
    var head = document.createElement('div');
    head.className = 'ggc-drawer-head';
    var title = document.createElement('p');
    title.className = 'title';
    title.textContent = '전체메뉴';
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {   // 서랍(대화상자)의 이름
      title.id = nav.id + '-title';
      nav.setAttribute('aria-labelledby', title.id);
    }
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'ggc-icon-btn ggc-drawer-close';
    close.setAttribute('aria-label', '메뉴 닫기');
    close.innerHTML = CLOSE_SVG;
    close.addEventListener('click', function () { setDrawer(false); });
    head.append(title, close);
    nav.prepend(head);
    drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'ggc-drawer-backdrop';
    drawerBackdrop.hidden = true;
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(drawerBackdrop);
    function sync() {
      var had = document.activeElement, menuFocus = had && had !== document.body && (nav.contains(had) || had === toggle || had === collapse);
      setDrawer(false);
      nav.classList.toggle('ggc-lnb--icon', !drawerMedia.matches && lnbCollapsed);   // 서랍은 늘 펼친 모양 · PC 로 돌아오면 접힘을 되살린다
      navLabels();
      // 900 경계를 넘으면 초점이 숨은 단추·닫힌 서랍에 남는다 — 그때만 이 폭에서 보이는 메뉴 단추로 넘긴다(본문의 초점은 그대로)
      var now = document.activeElement;
      if (menuFocus && (!now || now === document.body || !now.getClientRects().length || (nav.inert && nav.contains(now)))) {
        (drawerMedia.matches ? toggle : collapse).focus({ preventScroll: true });
      }
    }
    drawerMedia.addEventListener('change', sync);
    sync();
  }

  function navLabels() {
    var nav = lnb();
    if (!nav) return;
    var open = nav.getAttribute('data-open') === 'true', collapsed = nav.classList.contains('ggc-lnb--icon');
    document.querySelectorAll('[data-ggc-lnb-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', String(!collapsed));
      b.setAttribute('aria-label', collapsed ? '메뉴 펼치기' : '메뉴 접기');
    });
    document.querySelectorAll('[data-ggc-drawer-toggle]').forEach(function (b) {
      b.setAttribute('aria-expanded', String(open));
      if (!b.textContent.trim()) b.setAttribute('aria-label', open ? '메뉴 닫기' : '전체메뉴 열기');   // 글자 없는 옛 단추만 — 「전체메뉴」 글자가 있으면 그 글자가 이름이다
    });
  }

  function setDrawer(open) {
    var nav = lnb();
    if (!nav) return;
    var wasOpen = nav.getAttribute('data-open') === 'true';
    open = open && drawerMedia.matches;
    if (open && !wasOpen) drawerOpener = document.activeElement;
    if (open) nav.setAttribute("data-open", "true"); else nav.removeAttribute("data-open");
    if (drawerBackdrop) drawerBackdrop.hidden = !open;
    document.documentElement.toggleAttribute('data-ggc-drawer-active', open);
    nav.inert = drawerMedia.matches && !open;
    if (open) { nav.setAttribute('role', 'dialog'); nav.setAttribute('aria-modal', 'true'); }
    else { nav.removeAttribute('role'); nav.removeAttribute('aria-modal'); }
    navLabels();
    if (open) { var first = nav.querySelector('button, a'); if (first) first.focus(); }
    else if (wasOpen && drawerOpener && drawerOpener.isConnected) drawerOpener.focus();
  }

  function toggleCollapse() {
    var nav = lnb();
    if (!nav || drawerMedia.matches) return;
    lnbCollapsed = nav.classList.toggle('ggc-lnb--icon');
    nav.querySelectorAll('a').forEach(function (a) { a.title = a.textContent.trim(); });
    navLabels();
  }

  /* GGC.toggleDrawer — PC 는 접기, ≤900 은 서랍(예전 한 단추 시절과 같은 뜻) */
  function toggleDrawer() {
    var nav = lnb();
    if (!nav) return;
    if (!drawerMedia.matches) toggleCollapse();
    else setDrawer(nav.getAttribute("data-open") !== "true");
  }

  document.addEventListener("click", function (e) {
    var c = e.target.closest ? e.target.closest("[data-ggc-lnb-toggle]") : null;
    if (c) { e.preventDefault(); toggleCollapse(); return; }
    var t = e.target.closest ? e.target.closest("[data-ggc-drawer-toggle]") : null;
    if (t) { e.preventDefault(); var n = lnb(); if (n) setDrawer(n.getAttribute("data-open") !== "true"); return; }
    var nav = lnb();
    if (nav && nav.getAttribute("data-open") === "true" && !nav.contains(e.target)) setDrawer(false);
    if (nav && e.target.closest && e.target.closest('.ggc-lnb a')) setDrawer(false);
  });

  document.addEventListener("keydown", function (e) {
    var nav = lnb();
    if (!nav || nav.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') { e.preventDefault(); setDrawer(false); }
    if (e.key === 'Tab') {
      var focusable = [].slice.call(nav.querySelectorAll('a[href], button, input, select, [tabindex="0"]')).filter(function (el) { return !el.disabled && el.getClientRects().length; });
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
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

  /* --------------------------------------------------------------- ⑤ 토스트 */
  var TOAST_MAX = 3;
  var TOAST_ICON = { success: "✓", warning: "⚠", danger: "✕", info: "ⓘ" };

  function toastRegion() {
    var region = document.querySelector(".ggc-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "ggc-toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-label", "알림");
      document.body.appendChild(region);
    }
    return region;
  }

  function dismissToast(el) {
    if (!el || el.hasAttribute("data-leaving")) return;
    el.setAttribute("data-leaving", "");
    if (el.__ggcTimer) clearTimeout(el.__ggcTimer);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 160);
  }

  function toast(opts) {
    opts = typeof opts === "string" ? { title: opts } : (opts || {});
    var region = toastRegion();
    var el = document.createElement("div");
    el.className = "ggc-toast" + (opts.variant ? " ggc-toast--" + opts.variant : "");

    var icon = document.createElement("span");
    icon.className = "icon"; icon.setAttribute("aria-hidden", "true");
    icon.textContent = opts.icon != null ? opts.icon : (TOAST_ICON[opts.variant] || "•");
    var body = document.createElement("div"); body.className = "body";
    var title = document.createElement("b"); title.className = "title"; title.textContent = opts.title || "";
    body.appendChild(title);
    if (opts.desc) { var d = document.createElement("span"); d.className = "desc"; d.textContent = opts.desc; body.appendChild(d); }
    el.appendChild(icon); el.appendChild(body);
    if (opts.action && opts.action.label) {
      var a = document.createElement("button"); a.type = "button"; a.className = "action"; a.textContent = opts.action.label;
      a.addEventListener("click", function () {
        if (typeof opts.action.onClick === "function") opts.action.onClick();
        dismissToast(el);
      });
      el.appendChild(a);
    }
    var close = document.createElement("button");
    close.type = "button"; close.className = "close"; close.setAttribute("aria-label", "닫기"); close.textContent = "✕";
    close.addEventListener("click", function () { dismissToast(el); });
    el.appendChild(close);

    /* 상한 — 가장 오래된 것부터 닫는다(닫히는 중인 것은 세지 않는다) */
    var live = [].slice.call(region.querySelectorAll(".ggc-toast:not([data-leaving])"));
    while (live.length >= TOAST_MAX) dismissToast(live.shift());
    region.appendChild(el);

    var duration = opts.duration != null ? opts.duration : (opts.action ? 8000 : 5000);
    if (duration > 0) {
      var arm = function (ms) { clearTimeout(el.__ggcTimer); el.__ggcTimer = setTimeout(function () { dismissToast(el); }, ms); };
      arm(duration);
      /* 읽는 동안은 사라지지 않는다(WCAG 2.2.1) — 떠나면 2초 뒤 */
      el.addEventListener("mouseenter", function () { clearTimeout(el.__ggcTimer); });
      el.addEventListener("focusin", function () { clearTimeout(el.__ggcTimer); });
      el.addEventListener("mouseleave", function () { if (!el.contains(document.activeElement)) arm(2000); });
      el.addEventListener("focusout", function (e) { if (!el.contains(e.relatedTarget) && !el.matches(":hover")) arm(2000); });
    }
    el.dispatchEvent(new CustomEvent("ggc:toast", { bubbles: true }));
    return el;
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-ggc-toast]") : null;
    if (!t) return;
    toast({
      title: t.getAttribute("data-ggc-toast") || "",
      desc: t.getAttribute("data-ggc-toast-desc") || "",
      variant: t.getAttribute("data-ggc-toast-variant") || ""
    });
  });

  /* ------------------------------------------------------------ ⑥ 드롭다운 메뉴 */
  function menuItems(menu) {
    return [].slice.call(menu.querySelectorAll('[role="menuitem"]')).filter(function (i) {
      return !i.disabled && i.getAttribute("aria-disabled") !== "true";
    });
  }

  function closeMenu(menu, refocus) {
    if (!menu.open) return;
    menu.open = false;
    if (refocus) { var s = menu.querySelector("summary"); if (s) s.focus(); }
  }

  function initMenus(root) {
    (root || document).querySelectorAll("details.ggc-menu").forEach(function (menu) {
      if (menu.__ggcMenu) return;
      menu.__ggcMenu = true;
      var summary = menu.querySelector("summary");
      if (summary) {
        summary.setAttribute("aria-haspopup", "menu");
        summary.setAttribute("aria-expanded", menu.open ? "true" : "false");
      }
      menu.addEventListener("toggle", function () {
        if (summary) summary.setAttribute("aria-expanded", menu.open ? "true" : "false");
        if (!menu.open) return;
        document.querySelectorAll("details.ggc-menu[open]").forEach(function (o) { if (o !== menu) o.open = false; });
        var items = menuItems(menu);
        if (items.length) items[0].focus();
      });
      menu.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { if (menu.open) { e.preventDefault(); closeMenu(menu, true); } return; }
        if (!menu.open) return;
        if (e.key === "Tab") { closeMenu(menu, false); return; }
        var items = menuItems(menu);
        if (!items.length) return;
        var i = items.indexOf(document.activeElement), j = null;
        if (e.key === "ArrowDown") j = i < 0 ? 0 : (i + 1) % items.length;
        else if (e.key === "ArrowUp") j = i < 0 ? items.length - 1 : (i - 1 + items.length) % items.length;
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = items.length - 1;
        if (j === null) return;
        e.preventDefault();
        items[j].focus();
      });
      /* 항목을 실행하면 닫는다 — 링크는 이동하고, 버튼은 자기 일을 한 뒤다 */
      menu.addEventListener("click", function (e) {
        var item = e.target.closest ? e.target.closest('[role="menuitem"]') : null;
        if (!item || !menu.contains(item)) return;
        if (item.disabled || item.getAttribute("aria-disabled") === "true") { e.preventDefault(); return; }
        closeMenu(menu, true);
      });
    });
  }

  document.addEventListener("click", function (e) {
    document.querySelectorAll("details.ggc-menu[open]").forEach(function (menu) {
      if (!menu.contains(e.target)) menu.open = false;
    });
  });

  /* ------------------------------------------------------------- ⑦ 파일 업로드 */
  function formatSize(n) {
    if (n < 1024) return n + "B";
    if (n < 1048576) return Math.round(n / 1024) + "KB";
    return (n / 1048576).toFixed(1) + "MB";
  }

  function initFiles(root) {
    (root || document).querySelectorAll("[data-ggc-file]").forEach(function (box) {
      if (box.__ggcFile) return;
      box.__ggcFile = true;
      var input = box.querySelector('input[type="file"]');
      var drop = box.querySelector(".drop");
      var list = box.querySelector(".ggc-file-list");
      if (!input) return;
      var files = [];

      function sync() {
        /* 삭제를 input.files 에 되돌린다 — 폼 전송이 목록과 같아야 한다 */
        if (typeof DataTransfer === "function") {
          try {
            var dt = new DataTransfer();
            files.forEach(function (f) { dt.items.add(f); });
            input.files = dt.files;
          } catch (err) { /* 구형 — 목록만 유지 */ }
        }
        if (list) {
          list.innerHTML = "";
          files.forEach(function (f, i) {
            var li = document.createElement("li");
            var name = document.createElement("span"); name.className = "name"; name.textContent = f.name;
            var size = document.createElement("span"); size.className = "size"; size.textContent = formatSize(f.size);
            var rm = document.createElement("button");
            rm.type = "button"; rm.className = "remove"; rm.textContent = "✕";
            rm.setAttribute("aria-label", f.name + " 삭제");
            rm.addEventListener("click", function () { files.splice(i, 1); sync(); input.focus(); });
            li.appendChild(name); li.appendChild(size); li.appendChild(rm);
            list.appendChild(li);
          });
        }
        box.dispatchEvent(new CustomEvent("ggc:files", { detail: { files: files.slice() }, bubbles: true }));
      }

      function add(newFiles) {
        var max = parseInt(box.getAttribute("data-ggc-file-max") || "0", 10);
        if (!input.multiple) files = [];
        [].slice.call(newFiles || []).forEach(function (f) {
          if (!input.multiple && files.length) return;
          if (max && files.length >= max) return;
          files.push(f);
        });
        sync();
      }

      input.addEventListener("change", function () { add(input.files); });
      if (drop) {
        drop.addEventListener("click", function (e) {
          /* 라벨 클릭은 브라우저가 input 을 연다 — 그 밖의 영역만 대신 연다 */
          if (e.target.closest && e.target.closest("label, input")) return;
          input.click();
        });
        ["dragenter", "dragover"].forEach(function (t) {
          drop.addEventListener(t, function (e) { e.preventDefault(); drop.setAttribute("data-over", ""); });
        });
        ["dragleave", "drop"].forEach(function (t) {
          drop.addEventListener(t, function (e) { e.preventDefault(); drop.removeAttribute("data-over"); });
        });
        drop.addEventListener("drop", function (e) {
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) add(e.dataTransfer.files);
        });
      }
    });
  }

  /* ------------------------------------------------------------ ⑧ 툴팁 ESC */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".ggc-tooltip-wrap").forEach(function (w) {
      if (w.matches(":hover, :focus-within")) w.setAttribute("data-ggc-tooltip-dismissed", "");
    });
  });
  document.addEventListener("focusout", function (e) {
    var w = e.target.closest ? e.target.closest(".ggc-tooltip-wrap") : null;
    if (w && !w.contains(e.relatedTarget)) w.removeAttribute("data-ggc-tooltip-dismissed");
  });
  document.addEventListener("mouseout", function (e) {
    var w = e.target.closest ? e.target.closest(".ggc-tooltip-wrap") : null;
    if (w && !w.contains(e.relatedTarget)) w.removeAttribute("data-ggc-tooltip-dismissed");
  });

  /* ------------------------------------------------------------ ⑨ 리스트박스 */
  function initListboxes(root) {
    (root || document).querySelectorAll("[data-ggc-listbox]").forEach(function (box) {
      if (box.__ggcListbox) return;
      box.__ggcListbox = true;
      var list = box.querySelector('[role="listbox"]');
      if (!list) return;
      var filter = box.querySelector(".filter");
      var hidden = box.querySelector('input[type="hidden"]');
      var none = box.querySelector(".none");
      var multi = list.getAttribute("aria-multiselectable") === "true";
      if (!list.hasAttribute("tabindex")) list.tabIndex = 0;
      var uid = 0;

      function all() { return [].slice.call(list.querySelectorAll('[role="option"]')); }
      function visible() { return all().filter(function (o) { return !o.hidden; }); }
      function enabled(o) { return o.getAttribute("aria-disabled") !== "true"; }
      function ensureId(o) { if (!o.id) o.id = (list.id || "ggc-lb") + "-o" + (++uid); return o.id; }
      function active() { return document.getElementById(list.getAttribute("aria-activedescendant") || ""); }
      function setActive(o, scroll) {
        all().forEach(function (x) { x.classList.toggle("is-active", x === o); });
        if (o) list.setAttribute("aria-activedescendant", ensureId(o)); else list.removeAttribute("aria-activedescendant");
        if (o && scroll !== false && typeof o.scrollIntoView === "function") o.scrollIntoView({ block: "nearest" });
      }
      function valueOf(o) {
        return o.getAttribute("data-value") != null ? o.getAttribute("data-value") : o.textContent.trim();
      }
      function values() {
        return all().filter(function (o) { return o.getAttribute("aria-selected") === "true"; }).map(valueOf);
      }
      function select(o) {
        if (!o || !enabled(o)) return;
        if (multi) {
          o.setAttribute("aria-selected", o.getAttribute("aria-selected") === "true" ? "false" : "true");
        } else {
          all().forEach(function (x) { x.setAttribute("aria-selected", x === o ? "true" : "false"); });
        }
        setActive(o);
        if (hidden) hidden.value = values().join(",");
        box.dispatchEvent(new CustomEvent("ggc:change", { detail: { values: values(), option: o }, bubbles: true }));
      }

      list.addEventListener("click", function (e) {
        var o = e.target.closest ? e.target.closest('[role="option"]') : null;
        if (o && list.contains(o)) { select(o); list.focus(); }
      });
      list.addEventListener("focus", function () {
        if (active()) return;
        var first = all().filter(function (o) { return o.getAttribute("aria-selected") === "true" && !o.hidden; })[0] ||
          visible().filter(enabled)[0];
        if (first) setActive(first, false);
      });
      var typed = "", typedAt = 0;
      list.addEventListener("keydown", function (e) {
        var opts = visible().filter(enabled);
        if (!opts.length) return;
        var cur = active(), i = opts.indexOf(cur), j = null;
        if (e.key === "ArrowDown") j = Math.min(i + 1, opts.length - 1);
        else if (e.key === "ArrowUp") j = Math.max(i - 1, 0);
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = opts.length - 1;
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(cur); return; }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          var now = Date.now();
          typed = (now - typedAt < 600 ? typed : "") + e.key.toLowerCase();
          typedAt = now;
          var hit = opts.filter(function (o) { return o.textContent.trim().toLowerCase().indexOf(typed) === 0; })[0];
          if (hit) { e.preventDefault(); setActive(hit); if (!multi) select(hit); }
          return;
        }
        if (j === null) return;
        e.preventDefault();
        setActive(opts[j]);
        if (!multi) select(opts[j]);      /* 단일 선택은 선택이 포커스를 따라간다 — 네이티브 select 와 같다 */
      });

      if (filter) {
        filter.addEventListener("input", function () {
          var q = filter.value.trim().toLowerCase();
          var n = 0;
          all().forEach(function (o) {
            var hit = !q || o.textContent.toLowerCase().indexOf(q) >= 0;
            o.hidden = !hit;
            if (hit) n++;
          });
          if (none) none.hidden = n > 0;
          var cur = active();
          if (cur && cur.hidden) setActive(null);
          box.dispatchEvent(new CustomEvent("ggc:filter", { detail: { query: q, count: n }, bubbles: true }));
        });
        filter.addEventListener("keydown", function (e) {
          if (e.key === "ArrowDown") { e.preventDefault(); list.focus(); }
        });
      }
    });
  }

  /* -------------------------------------------------------- ⑩ 페이지 내 내비 */
  function initInPageNav(root) {
    (root || document).querySelectorAll("[data-ggc-in-page-nav]").forEach(function (nav) {
      if (nav.__ggcIpn) return;
      nav.__ggcIpn = true;
      var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
      var targets = links.map(function (a) {
        return document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      }).filter(Boolean);
      if (!targets.length) return;
      function mark(id) {
        links.forEach(function (a) {
          if (decodeURIComponent(a.getAttribute("href").slice(1)) === id) a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        });
      }
      /* 현재 절 = 기준선(뷰포트 위 25%)을 **지난 마지막 제목**. 제목이 기준선에 걸린
         순간만 보는 방식(IntersectionObserver 띠)은 제목 사이의 긴 본문에서 갱신을
         건너뛴다 — 실측으로 확인하고 스크롤 계산으로 바꿨다(2026-08-30). */
      function update() {
        /* 문서 끝까지 내려오면 마지막 절 — 페이지 맨 아래 절은 기준선을 영영 못 지난다(실측) */
        var sc = document.scrollingElement || document.documentElement;
        if (sc.scrollTop + window.innerHeight >= sc.scrollHeight - 2) {
          mark(targets[targets.length - 1].id);
          return;
        }
        var line = window.innerHeight * 0.25;
        var cur = targets[0];
        targets.forEach(function (t) {
          if (t.getBoundingClientRect().top <= line) cur = t;
        });
        mark(cur.id);
      }
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        (window.requestAnimationFrame || setTimeout)(function () { ticking = false; update(); });
      }
      /* scroll 은 버블하지 않는다 — capture 로 문서 어느 스크롤 컨테이너의 스크롤도 잡는다
         (본문이 window 가 아니라 내부 컨테이너에서 스크롤되는 셸 배치가 실제로 있다) */
      document.addEventListener("scroll", onScroll, { capture: true, passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      update();
    });
  }

  /* ------------------------------------------------------- ⑪ 긴 작업 진행 */
  /* 하는 일은 둘뿐이다 — 경과 시간 글자 갱신, 오래 걸리면 data-slow. 상태(data-state)는 서비스가 바꾼다.
     경과 시간은 live 영역 밖이라 화면 낭독기가 매초 읽지 않는다(단계 이름 .now 만 role=status). */
  var jobStart = typeof WeakMap === "function" ? new WeakMap() : null, jobTimer = null;
  function fmtElapsed(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m ? m + "분 " + s + "초" : s + "초";
  }
  function isActive(job) { return /^(queued|running|stopping)$/.test(job.getAttribute("data-state") || ""); }
  function tickJobs() {
    if (!document.querySelector("[data-ggc-job]")) { clearInterval(jobTimer); jobTimer = null; return; }   /* 작업 부품이 사라지면 멈춘다 — 다시 생기면 GGC.initJobs() */
    /* 끝난 작업은 처음 본 시각을 잊는다 — 같은 요소로 다시 시작하면 경과를 0 부터 잰다 */
    document.querySelectorAll("[data-ggc-job]").forEach(function (j) {
      if (isActive(j)) return;
      if (jobStart) jobStart.delete(j);
      j.removeAttribute("data-slow");
    });
    var jobs = document.querySelectorAll('[data-ggc-job][data-state="running"], [data-ggc-job][data-state="queued"], [data-ggc-job][data-state="stopping"]');
    if (!jobs.length) return;
    var now = Date.now();
    jobs.forEach(function (job) {
      var start = Date.parse(job.getAttribute("data-ggc-job-start") || "");
      if (isNaN(start)) {
        if (jobStart && !jobStart.has(job)) jobStart.set(job, now);
        start = jobStart ? jobStart.get(job) : now;
      }
      var sec = Math.max(0, Math.floor((now - start) / 1000));
      var t = job.querySelector(".elapsed time");
      if (t) t.textContent = fmtElapsed(sec);
      var slow = parseInt(job.getAttribute("data-ggc-job-slow") || "", 10);
      if (slow && sec >= slow) job.setAttribute("data-slow", ""); else job.removeAttribute("data-slow");
      /* 같은 요소로 새 작업을 시작하면 서비스가 data-ggc-job-start 를 새 시각으로 바꾼다 — 경과와 '오래 걸림'이 처음부터 다시 잰다 */
    });
  }
  function initJobs(root) {
    if (!(root || document).querySelector("[data-ggc-job]")) return;
    tickJobs();
    if (!jobTimer) jobTimer = setInterval(tickJobs, 1000);
  }

  /* ------------------------------------------------- ⑫ 휴대폰 1인 링크 화면 */
  /* 글자 크게 — 단추는 마크업에서 hidden 으로 시작한다(스크립트가 없으면 누를 수 없는 단추가 남지 않게).
     같은 오리진의 다른 링크 화면에서도 크게 보이도록 localStorage 에 기억한다. */
  function initSolo(root) {
    (root || document).querySelectorAll(".ggc-solo").forEach(function (solo) {
      if (solo.__ggcSolo) return;
      solo.__ggcSolo = true;
      var btn = solo.querySelector("[data-ggc-text-toggle]");
      if (!btn) return;
      function apply(lg) {
        if (lg) solo.setAttribute("data-ggc-text", "lg"); else solo.removeAttribute("data-ggc-text");
        btn.setAttribute("aria-pressed", lg ? "true" : "false");
      }
      var saved = null;
      try { saved = localStorage.getItem("ggc-text"); } catch (e) { /* 저장소가 막힌 브라우저 — 기억만 못 한다 */ }
      apply(saved === "lg");
      btn.hidden = false;
      btn.addEventListener("click", function () {
        var lg = solo.getAttribute("data-ggc-text") !== "lg";
        apply(lg);
        try { localStorage.setItem("ggc-text", lg ? "lg" : ""); } catch (e) { /* 위와 같다 */ }
      });
    });
    initTyping();
  }
  /* 키보드가 화면을 덮는 브라우저(iOS)는 레이아웃 높이(innerHeight)를 그대로 두고 보이는 높이만 줄인다.
     interactive-widget=resizes-content 를 따르는 브라우저(안드로이드)는 둘이 같이 줄어 여기 걸리지 않는다. */
  var typingBound = false;
  function initTyping() {
    if (typingBound || !window.visualViewport || !document.querySelector(".ggc-solo")) return;
    typingBound = true;
    var vv = window.visualViewport;
    function check() {
      var a = document.activeElement;
      var field = a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
      var covered = window.innerHeight - vv.height * vv.scale > 120;
      if (field && covered) document.documentElement.setAttribute("data-ggc-typing", "");
      else document.documentElement.removeAttribute("data-ggc-typing");
    }
    vv.addEventListener("resize", check);
    document.addEventListener("focusin", check);
    document.addEventListener("focusout", function () { setTimeout(check, 0); });
  }

  /* -------------------------------------------------------------- ⑬ 서명 패드 */
  /* 손가락 하나 · pointer capture · 패드 안 터치는 스크롤로 넘기지 않는다(카톡이 위아래 끌기를 가져가지 않게).
     획을 점 목록으로 들고 있다가 패드 크기가 바뀌면(주소창 · 키보드 · 회전) 같은 비율로 다시 그린다 — 지우지 않는다.
     잉크 색은 CSS(canvas { color }) 의 계산값 — 여기에 색 리터럴을 두지 않는다. 내보내기(PNG)는 서비스 몫이다. */
  function initSignatures(root) {
    (root || document).querySelectorAll("[data-ggc-signature]").forEach(function (wrap) {
      if (wrap.__ggcSignature) return;
      var canvas = wrap.querySelector("canvas");
      if (!canvas || !canvas.getContext) return;
      wrap.__ggcSignature = true;
      var ctx = canvas.getContext("2d"), status = wrap.querySelector(".status");
      var strokes = [], cur = null, pid = null, scale = 1, last = null, pending = false;
      function say(text) { if (status) status.textContent = text; }
      function setInked(on) { wrap.setAttribute("data-state", on ? "inked" : "empty"); }
      function dot(p) { ctx.beginPath(); ctx.arc(p.x * scale, p.y * scale, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fill(); }
      function seg(a, b) { ctx.beginPath(); ctx.moveTo(a.x * scale, a.y * scale); ctx.lineTo(b.x * scale, b.y * scale); ctx.stroke(); }
      function redraw() {
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.restore();
        strokes.forEach(function (st) { dot(st[0]); for (var i = 1; i < st.length; i++) seg(st[i - 1], st[i]); });
      }
      /* 점은 처음 패드 크기 기준 좌표로 저장한다. 크기가 바뀌면 처음 크기와 모든 점이 들어가는 범위를
         가로·세로 중 작은 배율로 똑같이 줄이거나 늘린다 — 찌그러뜨리지 않고, 회전 뒤 넓은 자리에 그린 획도 잘리지 않는다 */
      var origin = null;
      function bounds() {
        var w = origin.w, h = origin.h;
        strokes.forEach(function (st) { st.forEach(function (p) { if (p.x > w) w = p.x; if (p.y > h) h = p.y; }); });
        return { w: w, h: h };
      }
      function size() {
        /* 레이아웃 크기(clientWidth)로 잰다 — 창 열기 애니메이션의 transform 크기로 비트맵을 만들면 흐려지고 잉크가 비켜 찍힌다 */
        var r = { width: canvas.clientWidth, height: canvas.clientHeight };
        if (!r.width || !r.height) return;              /* 숨겨진 창 안 — 열릴 때 다시 온다 */
        if (pid !== null) { pending = true; return; }   /* 긋는 중에는 다시 맞추지 않는다 — 손을 뗀 뒤에 */
        var dpr = Math.min(window.devicePixelRatio || 1, 3);
        var w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
        if (last && w === last.w && h === last.h) return;   /* 같은 값을 넣어도 캔버스가 지워진다 — 바뀔 때만 */
        last = { w: w, h: h };
        canvas.width = w; canvas.height = h;
        if (!origin) origin = { w: r.width, h: r.height };
        var b = bounds();
        scale = Math.min(r.width / b.w, r.height / b.h);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 2.5;
        ctx.strokeStyle = ctx.fillStyle = getComputedStyle(canvas).color;
        redraw();
      }
      function at(e) {   /* 포인터 캡처 중 패드 밖으로 나간 점은 가장자리로 자른다 · 화면 좌표(transform 포함)를 레이아웃 좌표로 */
        var r = canvas.getBoundingClientRect(), fx = canvas.clientWidth / (r.width || 1), fy = canvas.clientHeight / (r.height || 1);
        return { x: Math.min(canvas.clientWidth, Math.max(0, (e.clientX - r.left) * fx)) / scale,
                 y: Math.min(canvas.clientHeight, Math.max(0, (e.clientY - r.top) * fy)) / scale };
      }
      canvas.addEventListener("pointerdown", function (e) {
        if (pid !== null || (e.pointerType === "mouse" && e.button !== 0)) return;   /* 두 번째 손가락은 받지 않는다 */
        if (!origin) size();
        pid = e.pointerId;
        if (canvas.setPointerCapture) canvas.setPointerCapture(pid);
        cur = [at(e)];
        strokes.push(cur);
        dot(cur[0]);
        e.preventDefault();
      });
      canvas.addEventListener("pointermove", function (e) {
        if (e.pointerId !== pid || !cur) return;
        var p = at(e);
        seg(cur[cur.length - 1], p);
        cur.push(p);
        if (wrap.getAttribute("data-state") !== "inked" && cur.length > 2) setInked(true);
        e.preventDefault();
      });
      function end(e) {
        if (e.pointerId !== pid) return;
        pid = null; cur = null;
        if (pending) { pending = false; size(); }
        /* 안내 글은 손을 뗀 뒤에 — 긋는 중에 글이 생겨 패드 높이가 바뀌면 잉크가 손가락에서 비켜 찍힌다 */
        if (wrap.getAttribute("data-state") === "inked") say("서명을 입력했습니다 — 아직 제출되지 않았습니다");
        if (wrap.getAttribute("data-state") === "inked") wrap.dispatchEvent(new CustomEvent("ggc:signature", { bubbles: true, detail: { canvas: canvas, empty: false } }));
      }
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { canvas.addEventListener(t, end); });
      ["touchstart", "touchmove"].forEach(function (t) {
        canvas.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false });
      });
      function clear() {
        strokes = []; cur = null; redraw();
        setInked(false); say("");
        wrap.dispatchEvent(new CustomEvent("ggc:signature", { bubbles: true, detail: { canvas: canvas, empty: true } }));
      }
      wrap.__ggcSignatureClear = clear;
      var btn = wrap.querySelector("[data-ggc-signature-clear]");
      if (btn) btn.addEventListener("click", clear);
      if (typeof ResizeObserver === "function") new ResizeObserver(size).observe(canvas);
      else window.addEventListener("resize", size);
      setInked(false);
      size();
    });
  }

  /* ------------------------------------------------------ ⑭ 문서 미리보기 틀 */
  /* 배율(50~300%) · 폭 맞춤 · 쪽 이동 · 지금 쪽 표시. 배율은 CSS 변수(--ggc-viewer-zoom)로 넘긴다 — CSSOM 이라 CSP 에 걸리지 않는다.
     캔버스로 그리는 렌더러는 ggc:viewer-zoom 을 받아 다시 그린다. 상태가 ready·partial 이 아니면 쪽·배율 단추를 끈다(내려받기는 남는다). */
  function initViewers(root) {
    (root || document).querySelectorAll("[data-ggc-viewer]").forEach(function (v) {
      if (v.__ggcViewer) return;
      var body = v.querySelector(".ggc-viewer-body");
      if (!body) return;
      v.__ggcViewer = true;
      var zoom = 1, zoomOut = v.querySelector(".ggc-viewer-tools .zoom"), pageOut = v.querySelector(".ggc-viewer-tools .page output");
      function pages() { return [].slice.call(v.querySelectorAll(".ggc-viewer-page")); }
      function current() {
        var list = pages(), line = body.getBoundingClientRect().top + body.clientHeight * 0.25, idx = 0;
        /* 끝까지 내려왔으면 마지막 쪽 — 짧은 마지막 쪽은 기준선을 영영 못 지난다 */
        if (list.length && body.scrollTop + body.clientHeight >= body.scrollHeight - 2 && body.scrollTop > 0) return list.length - 1;
        list.forEach(function (p, i) { if (p.getBoundingClientRect().top <= line) idx = i; });
        return idx;
      }
      function showPage() { var t = String(current() + 1); if (pageOut && pageOut.textContent !== t) pageOut.textContent = t; }
      function setZoom(z) {
        var ratio = body.scrollHeight ? body.scrollTop / body.scrollHeight : 0;
        zoom = Math.min(3, Math.max(0.5, Math.round(z * 100) / 100));
        v.querySelectorAll('[data-ggc-viewer-zoom="in"], [data-ggc-viewer-zoom="out"]').forEach(function (btn) { btn.disabled = false; });
        v.style.setProperty("--ggc-viewer-zoom", String(zoom));
        body.scrollTop = ratio * body.scrollHeight;
        if (zoomOut) zoomOut.textContent = Math.round(zoom * 100) + "%";
        v.querySelectorAll('[data-ggc-viewer-zoom="fit"]').forEach(function (b) { b.setAttribute("aria-pressed", zoom === 1 ? "true" : "false"); });
        limits();
        v.dispatchEvent(new CustomEvent("ggc:viewer-zoom", { bubbles: true, detail: { zoom: zoom } }));
      }
      v.addEventListener("click", function (e) {
        var z = e.target.closest && e.target.closest("[data-ggc-viewer-zoom]");
        if (z && v.contains(z)) {
          var k = z.getAttribute("data-ggc-viewer-zoom");
          setZoom(k === "in" ? zoom + 0.25 : k === "out" ? zoom - 0.25 : 1);
          return;
        }
        var b = e.target.closest && e.target.closest("[data-ggc-viewer-page]");
        if (b && v.contains(b)) {
          var list = pages(), i = current();
          var j = b.getAttribute("data-ggc-viewer-page") === "next" ? Math.min(list.length - 1, i + 1) : Math.max(0, i - 1);
          if (list[j]) body.scrollTop += list[j].getBoundingClientRect().top - body.getBoundingClientRect().top;
          showPage();
        }
      });
      var ticking = false;
      body.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        (window.requestAnimationFrame || setTimeout)(function () { ticking = false; showPage(); });
      }, { passive: true });
      function limits() {   /* 배율 끝에서는 그쪽 단추를 끈다 — 눌러도 아무 일 없는 단추가 남지 않게 */
        v.querySelectorAll('[data-ggc-viewer-zoom="out"]').forEach(function (b) { if (zoom <= 0.5) b.disabled = true; });
        v.querySelectorAll('[data-ggc-viewer-zoom="in"]').forEach(function (b) { if (zoom >= 3) b.disabled = true; });
      }
      function syncState() {
        var s = v.getAttribute("data-state") || "ready", on = s === "ready" || s === "partial";
        v.querySelectorAll("[data-ggc-viewer-zoom], [data-ggc-viewer-page]").forEach(function (btn) { btn.disabled = !on; });
        if (on) { limits(); showPage(); }
      }
      if (typeof MutationObserver === "function") {
        new MutationObserver(syncState).observe(v, { attributes: true, attributeFilter: ["data-state"] });
      }
      syncState();
    });
  }

  /* -------------------------------------------------------- ⑮ 좌우 두 칸 작업대 */
  /* 경계 끌기 · 키보드(←/→ 10px, Shift 50px, Home/End, Enter = 접기/펼치기 — APG window splitter) · 더블클릭 = 기본 폭.
     폭만 localStorage 에 기억한다. 접힘은 기억하지 않는다 — 다음에 열었을 때 목록이 사라져 있지 않게(less.md R9).
     [data-ggc-split-step] 단추는 끌기의 한 번 누르기 대안(WCAG 2.5.7).
     ≤1100px 에서는 data-pane 으로 한 칸씩 — 전환하면 그 칸으로 초점을 옮기고, 목록의 스크롤 위치를 되살린다. */
  var narrowMq = window.matchMedia ? window.matchMedia("(max-width: 1100px)") : null;
  function store(kind, key, val) {
    try {
      var s = window[kind];
      if (val === undefined) return s.getItem(key);
      if (val === null) s.removeItem(key); else s.setItem(key, String(val));
    } catch (e) { /* 저장소가 막힌 브라우저 — 기억만 못 한다 */ }
    return null;
  }
  function splitShow(sp, pane) {
    sp = resolve(sp);
    if (!sp) return;
    var list = sp.querySelector(".ggc-split-list");
    if (list && pane === "view" && sp.getAttribute("data-pane") !== "view") sp.__ggcListTop = list.scrollTop;
    sp.setAttribute("data-pane", pane);
    var box = sp.querySelector(pane === "view" ? ".ggc-split-view" : ".ggc-split-list");
    if (!box || !(narrowMq && narrowMq.matches)) return;
    /* 목록으로 돌아오면 고른 행으로, 보기로 가면 그 칸 제목으로 — 초점이 스크롤을 움직이지 않게 한 뒤 스크롤을 되살린다 */
    var target = (pane === "list" && box.querySelector('[aria-current="true"], [aria-selected="true"]')) || box.querySelector("h1, h2, h3") || box;
    if (!target.matches("a[href], button, input, select, textarea, [tabindex]")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (list && pane === "list" && typeof sp.__ggcListTop === "number") list.scrollTop = sp.__ggcListTop;   /* display:none 이 지운 스크롤 */
  }
  function initSplits(root) {
    (root || document).querySelectorAll("[data-ggc-split]").forEach(function (sp) {
      if (sp.__ggcSplit) return;
      sp.__ggcSplit = true;
      var key = "ggc-split:" + (sp.getAttribute("data-ggc-split") || "default");
      var list = sp.querySelector(".ggc-split-list"), handle = sp.querySelector(".ggc-split-handle");
      var unit = parseFloat(getComputedStyle(sp).getPropertyValue("--ggc-space-11")) || 80;
      function bounds() { return { min: unit * 3, max: Math.max(unit * 3, Math.min(unit * 7, sp.clientWidth * 0.45)) }; }
      function report() {
        if (!handle || !list) return;
        var b = bounds();
        handle.setAttribute("aria-valuemin", String(Math.round(b.min)));
        handle.setAttribute("aria-valuemax", String(Math.round(b.max)));
        handle.setAttribute("aria-valuenow", String(Math.round(list.getBoundingClientRect().width)));
      }
      function setW(px, save) {
        var b = bounds();
        px = Math.round(Math.min(b.max, Math.max(b.min, px)));
        sp.style.setProperty("--ggc-split-w", px + "px");
        report();
        if (save) store("localStorage", key, px);
      }
      function reset() { sp.style.removeProperty("--ggc-split-w"); store("localStorage", key, null); report(); }
      function setCollapsed(on) {
        if (on) sp.setAttribute("data-collapsed", ""); else sp.removeAttribute("data-collapsed");
        sp.querySelectorAll("[data-ggc-split-toggle]").forEach(function (t) {
          t.setAttribute("aria-expanded", on ? "false" : "true");
          var lb = t.querySelector(".label");   /* 글이 상태를 따라가게(선택) — 접은 뒤에도 「목록 접기」로 남지 않게 */
          if (lb) lb.textContent = on ? (t.getAttribute("data-label-closed") || "목록 펼치기") : (t.getAttribute("data-label-open") || "목록 접기");
        });
      }
      var saved = parseInt(store("localStorage", key) || "", 10);
      if (saved) sp.style.setProperty("--ggc-split-w", saved + "px");   /* 경계는 CSS clamp 가 지킨다 */
      if (handle && list) {
        var startX = 0, startW = 0, drag = null;
        handle.addEventListener("pointerdown", function (e) {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          drag = e.pointerId; startX = e.clientX; startW = list.getBoundingClientRect().width;
          if (handle.setPointerCapture) handle.setPointerCapture(drag);
          sp.setAttribute("data-dragging", "");
          e.preventDefault();
        });
        handle.addEventListener("pointermove", function (e) { if (e.pointerId === drag) setW(startW + e.clientX - startX, false); });
        function stop(e) {
          if (e.pointerId !== drag) return;
          drag = null; sp.removeAttribute("data-dragging");
          setW(list.getBoundingClientRect().width, true);
        }
        ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { handle.addEventListener(t, stop); });   /* 덮개가 남지 않게 */
        handle.addEventListener("dblclick", reset);
        handle.addEventListener("keydown", function (e) {
          var w = list.getBoundingClientRect().width, b = bounds(), step = e.shiftKey ? 50 : 10;
          if (e.key === "ArrowLeft") setW(w - step, true);
          else if (e.key === "ArrowRight") setW(w + step, true);
          else if (e.key === "Home") setW(b.min, true);
          else if (e.key === "End") setW(b.max, true);
          else if (e.key === "Enter") {
            /* 접으면 경계가 사라진다 — 다시 펼 단추가 있을 때만 접고, 초점을 그 단추로 옮긴다 */
            var tg = sp.querySelector("[data-ggc-split-toggle]");
            if (!tg) return;
            setCollapsed(true); tg.focus();
          }
          else return;
          e.preventDefault();
        });
        if (typeof ResizeObserver === "function") new ResizeObserver(report).observe(sp);
        handle.tabIndex = 0;   /* 초점은 동작이 있을 때만 — 스크립트가 없으면 빈 탭 정지가 남지 않게 */
        report();
      }
      sp.addEventListener("click", function (e) {
        var s = e.target.closest && e.target.closest("[data-ggc-split-show]");
        if (s && sp.contains(s)) splitShow(sp, s.getAttribute("data-ggc-split-show"));
        var t = e.target.closest && e.target.closest("[data-ggc-split-toggle]");
        if (t && sp.contains(t)) setCollapsed(!sp.hasAttribute("data-collapsed"));
        var st = e.target.closest && e.target.closest("[data-ggc-split-step]");
        /* 좁은 화면·접힌 상태에서는 목록 폭이 0 으로 재진다 — 그 값으로 PC 에서 기억한 폭을 덮지 않는다 */
        if (st && sp.contains(st) && list && !(narrowMq && narrowMq.matches) && !sp.hasAttribute("data-collapsed")) {
          setW(list.getBoundingClientRect().width + (parseFloat(st.getAttribute("data-ggc-split-step")) || 0), true);
        }
      });
      if (!sp.hasAttribute("data-pane")) sp.setAttribute("data-pane", "list");
      /* 넓은 화면에서 보기 칸에 초점이 있는 채로 좁아지면 그 칸을 보인다 — 초점이 숨은 칸에 갇히지 않게 */
      if (narrowMq && narrowMq.addEventListener) narrowMq.addEventListener("change", function (e) {
        if (!e.matches) return;
        var view = sp.querySelector(".ggc-split-view"), a = document.activeElement;
        if (view && a && view.contains(a)) sp.setAttribute("data-pane", "view");
      });
    });
  }

  /* ------------------------------------------------------------------ 공개 */
  GGC.toggleMenu = function () { var nav = mainMenu(); setMenu(!(nav && nav.getAttribute("data-open") === "true")); };
  GGC.initTabs = initTabs;
  GGC.initModals = initModals;
  GGC.openModal = openModal;
  GGC.closeModal = closeModal;
  GGC.toggleDrawer = toggleDrawer;
  GGC.toast = toast;
  GGC.dismissToast = dismissToast;
  GGC.initMenus = initMenus;
  GGC.initFiles = initFiles;
  GGC.initListboxes = initListboxes;
  GGC.initInPageNav = initInPageNav;
  GGC.initJobs = initJobs;
  GGC.initSolo = initSolo;
  GGC.initSignatures = initSignatures;
  GGC.signatureClear = function (el) { el = resolve(el); if (el && el.__ggcSignatureClear) el.__ggcSignatureClear(); };
  GGC.initViewers = initViewers;
  GGC.initSplits = initSplits;
  GGC.splitShow = splitShow;
  GGC.init = function (root) {
    initDrawer();
    (root || document).querySelectorAll('.ggc-tooltip-wrap').forEach(function (wrap) {
      if (wrap.__ggcPosition) return; wrap.__ggcPosition = true;
      function position() {
        var tip = wrap.querySelector('.ggc-tooltip'); if (!tip) return;
        tip.style.marginLeft = '0px';
        var rect = tip.getBoundingClientRect(), edge = 12;
        var shift = rect.right > window.innerWidth - edge ? window.innerWidth - edge - rect.right : rect.left < edge ? edge - rect.left : 0;
        tip.style.marginLeft = shift + 'px';
      }
      wrap.addEventListener('mouseenter', position); wrap.addEventListener('focusin', position);
    });
    initTabs(root); initModals(root); initMenus(root); initFiles(root); initListboxes(root); initInPageNav(root);
    initJobs(root); initSolo(root); initSignatures(root); initViewers(root); initSplits(root);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { GGC.init(); });
  } else {
    GGC.init();
  }
})();
