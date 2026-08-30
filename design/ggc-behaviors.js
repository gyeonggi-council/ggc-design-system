/* =============================================================================
 * ggc-behaviors.js — 경기도의회 공통 컴포넌트 동작 v2.0 (2026-08-29)
 * 전제: design/ggc-components.css v2.0 (마크업 계약은 그 파일의 §14·§19·§9 주석)
 *
 * 하는 일은 전부 **마크업의 ARIA 상태를 옮기는 것**이고, 스타일은 CSS 가 그 상태를
 * 보고 그린다. 그래서 이 파일이 없어도 화면은 깨지지 않는다 — 동작만 없다.
 *   ① 탭      role="tab" 의 aria-selected · tabindex(roving) · 패널 hidden · 화살표/Home/End
 *   ② 모달    <dialog>.showModal() · data-ggc-modal-open / -close · 배경 클릭 · 포커스 복귀
 *   ③ drawer  ≤900px 에서 .ggc-lnb[data-open] · ESC · 바깥 클릭
 *   ④ 대민 메뉴 .ggc-main-menu[data-open](모바일 패널) · [data-ggc-submenu] aria-expanded ·
 *             [data-ggc-search-toggle] 통합검색 패널  (ggc-public.css, v2.0)
 *   ⑤ 토스트   GGC.toast({title, desc, variant, duration, action}) · [data-ggc-toast] 선언형 · 3개 상한 · hover/focus 에 정지
 *   ⑥ 메뉴     details.ggc-menu — 열리면 첫 항목, ↑↓ Home End, ESC/바깥 클릭/실행 시 닫고 summary 복귀
 *   ⑦ 파일     [data-ggc-file] — change/drop → .ggc-file-list 갱신, 삭제를 input.files 에 되돌림(DataTransfer)
 *   ⑧ 툴팁     ESC 로 hover/focus 중인 .ggc-tooltip 닫기(WCAG 1.4.13), 떠나면 복구
 *   ⑨ 리스트박스 [data-ggc-listbox] — aria-activedescendant · ↑↓ Home End · Enter/Space · 앞글자 · .filter
 *   ⑩ 페이지 내 내비 [data-ggc-in-page-nav] — 기준선(25%)을 지난 마지막 제목에 aria-current="location"
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
  GGC.init = function (root) {
    initTabs(root); initModals(root); initMenus(root); initFiles(root); initListboxes(root); initInPageNav(root);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { GGC.init(); });
  } else {
    GGC.init();
  }
})();
