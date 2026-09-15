/* =============================================================================
 * examples.js — 갤러리 전용. 빌드 도구 없이 파일을 더블클릭해 열어도 동작한다.
 *
 * 하는 일은 둘뿐이고, 둘 다 같은 이유에서 존재한다 —
 * **값을 마크업에 적지 않기 위해서.**
 *
 *   ① revealMarkup()  렌더된 데모의 실제 innerHTML 을 읽어 코드블록을 채운다.
 *                     → 화면과 예제 코드가 갈라질 자리가 없다.
 *   ② paintSwatches() getComputedStyle 로 토큰 **실측값**을 읽어 스와치와
 *                     대비비를 채운다. → 갤러리가 정본을 배신할 수 없고,
 *                     고대비(prefers-contrast) 를 켜면 숫자가 즉시 따라 바뀐다.
 *   ③ bindProfileToggle() <html data-ggc-profile="public"> 을 켜고 끈다(v2.0).
 *                     값은 토큰 파일의 프로필 블록에서 오고 여기는 속성만 바꾼다.
 *
 * 정본이 두 달간 문서와 어긋나 있던 원인이 "값을 옮겨 적은 것" 이었다.
 * 갤러리는 그 실패를 반복하지 않는다.
 * ============================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------ ① 마크업 추출 */

  function dedent(src) {
    var lines = src.replace(/\t/g, "  ").split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    var pad = Infinity;
    lines.forEach(function (l) {
      if (!l.trim()) return;
      pad = Math.min(pad, l.match(/^ */)[0].length);
    });
    if (!isFinite(pad)) pad = 0;
    return lines.map(function (l) { return l.slice(pad); }).join("\n");
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* 속성을 먼저 칠하고 태그를 나중에 칠한다. 순서를 뒤집으면 방금 넣은
     class="t" 를 속성 규칙이 다시 잡아 중첩이 깨진다. */
  function highlight(esc) {
    return esc
      .replace(/([a-zA-Z-]+)="([^"]*)"/g,
        '<span class="a">$1</span>="<span class="v">$2</span>"')
      .replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g,
        '$1<span class="t">$2</span>');
  }

  function revealMarkup() {
    document.querySelectorAll(".ex-reveal[data-src]").forEach(function (box) {
      var target = document.querySelector(box.getAttribute("data-src"));
      var pre = box.querySelector(".ex-code");
      if (!target || !pre) return;
      pre.innerHTML = highlight(escapeHtml(dedent(target.innerHTML)));
    });
  }

  /* ------------------------------------------------- ② 토큰 실측 · 대비 계산 */

  function readVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name).trim();
  }

  /* CSS 색 문자열 -> [r,g,b]. 브라우저에게 계산을 넘긴다 —
     hex·rgb()·색이름·color-mix 를 직접 파싱하면 반드시 어딘가 틀린다. */
  var probe = null;
  function toRgb(color) {
    if (!probe) {
      probe = document.createElement("span");
      probe.style.display = "none";
      document.body.appendChild(probe);
    }
    probe.style.color = "";
    probe.style.color = color;
    var m = getComputedStyle(probe).color.match(/[\d.]+/g);
    return m ? [+m[0], +m[1], +m[2]] : null;
  }

  function toHex(rgb) {
    return "#" + rgb.map(function (v) {
      return ("0" + Math.round(v).toString(16)).slice(-2);
    }).join("");
  }

  /* WCAG 2.1 상대휘도 */
  function luminance(rgb) {
    var a = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function contrast(fg, bg) {
    var a = luminance(fg), b = luminance(bg);
    var hi = Math.max(a, b), lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }

  /* 배경 위에 얹을 글자색을 자동으로 고른다 (흰/먹 중 대비가 큰 쪽) */
  function readable(bg) {
    return contrast(bg, [255, 255, 255]) >= contrast(bg, [19, 23, 34])
      ? "#ffffff" : "#131722";
  }

  function paintSwatches() {
    document.querySelectorAll(".ex-swatch[data-token]").forEach(function (el) {
      var name = el.getAttribute("data-token");
      var min = parseFloat(el.getAttribute("data-min") || "4.5");
      var use = el.getAttribute("data-use") || "";

      var val = readVar(name);
      var rgb = toRgb(val);
      if (!rgb) return;

      /* data-on 은 쉼표로 여러 배경을 받는다 — 상태색은 자기 틴트 위와 흰 위를
         둘 다 봐야 판단이 선다(배지냐 채움 버튼이냐로 갈린다). */
      var ratios = (el.getAttribute("data-on") || "")
        .split(",").map(function (s) { return s.trim(); }).filter(Boolean)
        .map(function (onName) {
          var onRgb = toRgb(readVar(onName));
          if (!onRgb) return "";
          var c = contrast(rgb, onRgb);
          var cls = c >= min ? "pass" : (c >= 3 ? "warn" : "fail");
          return '<div class="pair">' +
            '<span class="ratio ' + cls + '">' + c.toFixed(2) + ":1</span>" +
            '<span class="vs">on ' + escapeHtml(onName.replace("--ggc-", "")) + "</span>" +
            "</div>";
        }).join("");

      el.innerHTML =
        '<div class="chip" style="background:' + val + ";color:" + readable(rgb) + '">가나다 Aa</div>' +
        '<div class="body">' +
          '<div class="name">' + escapeHtml(name) + "</div>" +
          '<div class="hex">' + toHex(rgb) + "</div>" +
          (use ? '<div class="use">' + escapeHtml(use) + "</div>" : "") +
          ratios +
        "</div>";
    });

    /* 간격·형태 스케일 막대 */
    document.querySelectorAll(".ex-scale [data-size]").forEach(function (el) {
      var name = el.getAttribute("data-size");
      var val = readVar(name);
      var bar = el.querySelector(".bar");
      var px = el.querySelector(".px");
      var key = el.querySelector(".key");
      if (key) key.textContent = name;
      if (bar) bar.style.width = "calc(" + val + " * 6)";
      if (px) px.textContent = val;
    });
    document.querySelectorAll(".ex-scale [data-radius]").forEach(function (el) {
      var name = el.getAttribute("data-radius");
      var val = readVar(name);
      var bar = el.querySelector(".bar");
      var px = el.querySelector(".px");
      var key = el.querySelector(".key");
      if (key) key.textContent = name;
      if (bar) { bar.style.width = "120px"; bar.style.height = "44px"; bar.style.borderRadius = val; }
      if (px) px.textContent = val;
    });

    /* 임의 토큰의 실측값 — 치수 토큰처럼 색도 막대도 아닌 값을 글자로 보여 준다.
       프로필을 켜면 같은 이름의 값이 바뀌므로 토글 뒤에 다시 돈다. */
    document.querySelectorAll("[data-var]").forEach(function (el) {
      el.textContent = readVar(el.getAttribute("data-var")) || "—";
    });
  }

  /* ------------------------------------------------------ ③ 프로필 미리보기 */

  /* <html data-ggc-profile="public"> 을 켜고 끈다. 값은 토큰 파일의 프로필 블록에서
     오고 여기는 속성 하나만 바꾼다 — 갤러리가 값을 알 필요가 없다. */
  function bindProfileToggle() {
    document.querySelectorAll("[data-ex-profile-toggle]").forEach(function (btn) {
      var root = document.documentElement;
      function render() {
        var on = root.getAttribute("data-ggc-profile") === "public";
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.textContent = on ? "업무 프로필로 되돌리기" : "대민 프로필 켜 보기";
      }
      btn.addEventListener("click", function () {
        if (root.getAttribute("data-ggc-profile") === "public") {
          root.removeAttribute("data-ggc-profile");
        } else {
          root.setAttribute("data-ggc-profile", "public");
        }
        render();
        paintSwatches();
      });
      render();
    });
  }

  /* ------------------------------------------------- ④ 토스트 데모 (action 있는 것) */

  /* 선언형(data-ggc-toast)은 behaviors.js 가 처리한다. action 콜백이 있는 예시만 여기서 만든다 */
  function bindToastDemo() {
    document.querySelectorAll("[data-ex-toast-undo]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!window.GGC || !window.GGC.toast) return;
        window.GGC.toast({
          title: "의안 3건을 보관함으로 옮겼다", icon: "▣",
          action: { label: "실행 취소", onClick: function () {
            window.GGC.toast({ title: "되돌렸다 — 목록으로 돌아왔다", variant: "info" });
          } }
        });
      });
    });
  }

  /* --------------------------------------------------------------- 현재 페이지 */

  function markCurrentNav() {
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".ggc-lnb-item").forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (href === here) a.setAttribute("aria-current", "page");
    });
  }

  /* Interactive work examples share the same records and controls at every width. */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function workLink(name) { return document.querySelector('main[data-page]') ? '#' + name : name + '.html'; }
  function workNotice(title, content) {
    var old = document.querySelector('#work-dialog');
    if (old) old.remove();
    var dialog = el('dialog', 'ggc-modal');
    dialog.id = 'work-dialog';
    dialog.setAttribute('aria-labelledby', 'work-dialog-title');
    var head = el('div', 'head');
    var heading = el('h2', 'title', title); heading.id = 'work-dialog-title';
    head.appendChild(heading);
    var body = el('div', 'body');
    if (typeof content === 'string') body.textContent = content; else body.appendChild(content);
    var foot = el('div', 'foot');
    var close = el('button', 'ggc-btn ggc-btn--secondary', '닫기'); close.type = 'button';
    close.addEventListener('click', function () { dialog.close(); });
    foot.appendChild(close); dialog.append(head, body, foot); document.body.appendChild(dialog);
    window.GGC.initModals(); window.GGC.openModal(dialog);
    return body;
  }
  function download(name, text, type) {
    var blob = new Blob([text], { type: type || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob), a = el('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function initWork() {
    document.querySelectorAll('main.ggc-work').forEach(function (main) {
      if (main.__work) return; main.__work = true;
      var notes = [].slice.call(main.querySelectorAll(':scope > .ex-note'));
      var guide = el('details', 'ex-work-guide');
      guide.appendChild(el('summary', '', '화면 가이드 · 예시 데이터'));
      notes.forEach(function (note) { guide.appendChild(note); }); main.appendChild(guide);
      main.dataset.pane = 'primary';
      main.querySelectorAll('[data-work-pane]').forEach(function (button) {
        button.addEventListener('click', function () { setPane(main, button.dataset.workPane); });
      });
      if (main.classList.contains('ggc-work-explore')) initExplore(main);
      if (main.classList.contains('ggc-work-wizard')) initWizard(main);
      if (main.classList.contains('ggc-work-dashboard')) {
        main.querySelectorAll('.ggc-page-head button').forEach(function (b) {
          b.addEventListener('click', function () { location.href = workLink(b.textContent.includes('등록') ? 'wizard' : 'explore'); });
        });
        main.querySelectorAll('a[href="#main"]').forEach(function (a) {
          a.href = workLink('explore');
          if (/일정|3건/.test(a.textContent)) {
            a.addEventListener('click', function (e) {
              e.preventDefault();
              var card = a.closest('.ggc-card');
              var content = el('div');
              card.querySelectorAll('.ggc-list-row').forEach(function (row) { content.appendChild(row.cloneNode(true)); });
              workNotice(card.querySelector('.title').textContent, content);
            });
          }
          if (a.textContent.includes('내려받기')) a.addEventListener('click', function (e) {
            e.preventDefault();
            var table = a.closest('.ggc-card').querySelector('table');
            download('위원회-처리현황.csv', '\uFEFF' + [].map.call(table.rows, function (r) { return [].map.call(r.cells, function (c) { return '"' + c.textContent.trim().replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n'), 'text/csv;charset=utf-8');
          });
        });
      }
    });
    document.querySelectorAll('.ggc-shell > .ggc-gnb .ggc-search input').forEach(function (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return; e.preventDefault();
        var main = document.querySelector('main.ggc-work-explore');
        if (main && !main.hidden) { main.querySelector('#work-q').value = input.value; main.querySelector('form').requestSubmit(); }
        else if (document.querySelector('main[data-page]')) {
          location.hash = 'explore';
          if (main) { main.querySelector('#work-q').value = input.value; main.querySelector('form').requestSubmit(); }
        } else location.href = 'explore.html?q=' + encodeURIComponent(input.value);
      });
    });
    document.querySelectorAll('.ggc-shell > .ggc-gnb button[aria-label^="알림"]').forEach(function (b) {
      b.addEventListener('click', function () { workNotice('알림 · 예시 데이터', '검토 대기 의안 1건, 회의 일정 1건, 조례 정비 요청 1건이 있습니다. 대시보드와 의안 목록에서 확인할 수 있습니다.'); });
    });
  }
  function setPane(main, pane) {
    main.dataset.pane = pane;
    main.querySelectorAll('[data-work-pane]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.workPane === pane)); });
  }
  function initExplore(main) {
    var form = main.querySelector('form'), table = main.querySelector('table'), tbody = table.tBodies[0];
    var rows = [].slice.call(tbody.rows), labels = [].map.call(table.tHead.rows[0].cells, function (c) { return c.textContent.trim(); });
    var records = rows.map(function (row) { return { row: row, values: [].map.call(row.cells, function (c) { return c.textContent.trim(); }) }; });
    var q = form.querySelector('#work-q'), committee = form.querySelector('#work-c'), status = form.querySelector('#work-s'), term = form.querySelector('#work-t');
    // There is no signed-in user's committee in this offline example. Default to all records.
    committee.options[0].remove(); committee.options[0].selected = true;
    status.options[1].selected = true;
    form.querySelectorAll('input[type="checkbox"]').forEach(function (c) { c.checked = false; c.defaultChecked = false; });
    var known = [].map.call(committee.options, function (o) { return o.text; });
    records.forEach(function (r) { if (!known.includes(r.values[3])) { committee.add(new Option(r.values[3])); known.push(r.values[3]); } });
    var cards = el('div', 'ggc-work-records'); table.parentElement.after(cards);
    var empty = el('div', 'ggc-empty'); empty.appendChild(el('p', '', '조건에 맞는 의안이 없습니다. 검색어와 필터를 변경해 주세요.'));
    var reset = el('button', 'ggc-btn ggc-btn--secondary', '검색 조건 초기화'); reset.type = 'button'; reset.addEventListener('click', function () { form.reset(); }); empty.appendChild(reset); cards.after(empty);
    var pager = main.querySelector('.ggc-pagination'); pager.replaceChildren();
    var summary = el('span', 'summary'); var prev = el('button', 'ggc-btn ggc-btn--secondary ggc-btn--sm', '이전'); var next = el('button', 'ggc-btn ggc-btn--secondary ggc-btn--sm', '다음');
    prev.type = next.type = 'button';
    var size = el('select'); size.setAttribute('aria-label', '페이지당 의안 수');
    [5, 10, 15, 20].forEach(function (n) { size.add(new Option(n + '건씩', n)); });
    var mobile = window.matchMedia('(max-width: 600px)'), cardMode = mobile.matches, pageSize = cardMode ? 5 : 15, pageIndex = 0, filtered = records.slice();
    size.value = String(pageSize); pager.append(summary, prev, size, next);
    var view = main.querySelector('[data-work-view]'), sort = main.querySelector('#work-sort');
    function recordDetails(record) {
      var dl = el('dl', 'ggc-work-detail');
      record.values.slice(0, 8).forEach(function (v, i) { dl.append(el('dt', '', labels[i]), el('dd', '', v)); });
      return dl;
    }
    function openRecord(record) {
      var content = el('div'); content.appendChild(recordDetails(record));
      content.appendChild(el('p', '', '예시 데이터입니다. 실제 의안 처리나 제출은 수행하지 않습니다.'));
      var write = el('a', 'ggc-btn ggc-btn--primary', '초안 작성 화면'); write.href = workLink('wizard');
      write.addEventListener('click', function () { var d = document.querySelector('#work-dialog'); if (d) d.close(); });
      content.appendChild(write); workNotice(record.values[0] + ' · 의안 상세', content);
    }
    records.forEach(function (r) {
      [].forEach.call(r.row.cells, function (c) { c.title = c.textContent.trim(); });
      r.row.querySelectorAll('a, button').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openRecord(r); }); });
    });
    function render() {
      var count = Math.max(1, Math.ceil(filtered.length / pageSize)); pageIndex = Math.min(pageIndex, count - 1);
      var visible = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
      tbody.replaceChildren(); cards.replaceChildren();
      visible.forEach(function (r) {
        tbody.appendChild(r.row);
        var card = el('article', 'ggc-work-record');
        var line = el('div', 'ggc-work-tools'); line.appendChild(el('code', '', r.values[0])); line.appendChild(r.row.cells[7].firstElementChild.cloneNode(true)); card.appendChild(line);
        var title = el('h2'); var link = el('a', '', r.values[1]); link.href = '#'; link.addEventListener('click', function (e) { e.preventDefault(); openRecord(r); }); title.appendChild(link); card.appendChild(title);
        card.appendChild(el('p', '', r.values[3] + ' · ' + r.values[5]));
        var controls = el('div', 'ggc-work-tools');
        var details = el('details'); details.appendChild(el('summary', '', '모든 정보')); details.appendChild(recordDetails(r));
        var action = el('button', 'ggc-btn ggc-btn--secondary ggc-btn--sm', r.values[8]); action.type = 'button'; action.addEventListener('click', function () { openRecord(r); });
        controls.appendChild(action); card.append(details, controls); cards.appendChild(card);
      });
      table.parentElement.hidden = cardMode || !filtered.length; cards.hidden = !cardMode || !filtered.length; empty.hidden = !!filtered.length;
      main.querySelector('[data-work-count]').textContent = '총 ' + filtered.length + '건 · ' + sort.selectedOptions[0].text;
      summary.textContent = (pageIndex + 1) + ' / ' + count + '쪽'; prev.disabled = pageIndex === 0; next.disabled = pageIndex >= count - 1;
      view.textContent = cardMode ? '표 보기' : '카드 보기'; view.setAttribute('aria-pressed', String(cardMode));
      table.parentElement.scrollTop = 0;
    }
    function filter() {
      var query = q.value.trim().toLowerCase(), kinds = [].map.call(form.querySelectorAll('input[type="checkbox"]:checked'), function (c) { return c.parentElement.textContent.trim(); });
      filtered = records.filter(function (r) {
        return (!query || r.values.slice(0, 2).join(' ').toLowerCase().includes(query)) &&
          (committee.value === '전체' || r.values[3] === committee.value) &&
          (status.value === '전체' || (status.value === '처리 대기' ? r.values[7] !== '의결' : r.values[7] === status.value)) &&
          (!kinds.length || kinds.includes(r.values[2])) && term.selectedIndex !== 1;
      });
      filtered.sort(function (a, b) { return sort.value === 'title' ? a.values[1].localeCompare(b.values[1], 'ko') : sort.value === 'oldest' ? a.values[5].localeCompare(b.values[5]) : b.values[5].localeCompare(a.values[5]); });
      var n = Number(committee.value !== '전체') + Number(status.value !== '전체') + Number(term.selectedIndex !== 0) + kinds.length;
      main.querySelector('[data-work-filter-count]').textContent = n ? '· ' + n + '개 적용' : '· 전체';
      pageIndex = 0; render();
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); filter(); });
    // Search already updates on input. Re-rendering again on blur would remove the
    // result link between pointerdown and click, swallowing the user's first click.
    form.addEventListener('change', function (e) { if (e.target !== q) filter(); });
    q.addEventListener('input', filter); sort.addEventListener('change', filter);
    form.addEventListener('reset', function (e) { e.preventDefault(); q.value = ''; committee.value = '전체'; status.value = '전체'; term.selectedIndex = 0; form.querySelectorAll('input[type="checkbox"]').forEach(function (c) { c.checked = false; }); filter(); });
    prev.addEventListener('click', function () { pageIndex--; render(); }); next.addEventListener('click', function () { pageIndex++; render(); });
    size.addEventListener('change', function () { pageSize = Number(size.value); pageIndex = 0; render(); });
    view.addEventListener('click', function () { cardMode = !cardMode; render(); });
    mobile.addEventListener('change', function (e) { cardMode = e.matches; pageSize = cardMode ? 5 : 15; size.value = String(pageSize); pageIndex = 0; render(); });
    main.querySelector('[data-work-export]').addEventListener('click', function () {
      var csv = [labels.slice(0, 8)].concat(filtered.map(function (r) { return r.values.slice(0, 8); })).map(function (row) { return row.map(function (v) { return '"' + (/^[=+\-@]/.test(v) ? "'" : '') + v.replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
      download('의안목록.csv', '\uFEFF' + csv, 'text/csv;charset=utf-8');
    });
    q.value = new URLSearchParams(location.search).get('q') || ''; filter();
  }
  function initWizard(main) {
    var editor = main.querySelector('.ggc-work-editor'), rail = main.querySelector('.ggc-work-secondary');
    var fields = ['w1', 'w2', 'w3', 'w4', 'w5'].map(function (id) { return main.querySelector('#' + id); });
    var names = ['개요 설정', '유사 조례 검토', '조문 작성', '검토 · 제출'];
    var panels = names.map(function (_, i) { var p = el('section', 'ggc-work-step'); p.dataset.step = String(i); return p; });
    var toolbar = main.querySelector('.ggc-work-actions');
    var initial = [].slice.call(editor.children).filter(function (n) { return n !== toolbar && !n.classList.contains('ggc-work-editor-head'); });
    // Move existing controls, never copy them: input survives tab and step switches.
    panels[0].appendChild(initial[0]); panels[0].appendChild(initial[1]);
    initial.slice(2).forEach(function (node) { panels[2].appendChild(node); });
    var similar = rail.children[1]; panels[1].appendChild(similar.cloneNode(true));
    panels[1].appendChild(el('p', '', '예시 조례를 대조한 뒤 다음 단계에서 조문을 작성합니다.'));
    panels.forEach(function (p) { editor.appendChild(p); });
    var guide = main.querySelector('.ex-work-guide'); main.insertBefore(toolbar, guide);
    // Duplicate progress is available as a disclosure; references are immediately visible.
    var progress = rail.firstElementChild, details = el('details', 'ggc-card ggc-card--pad');
    details.appendChild(el('summary', '', '전체 진행 상황')); progress.before(details); details.appendChild(progress);
    var step = 2, key = 'ggc-example-draft-v1', status = main.querySelector('.ggc-work-save-status');
    var extraFields = [];
    function addField(value) {
      var field = el('div', 'ggc-field'), id = 'work-extra-' + (extraFields.length + 1);
      var label = el('label', '', '추가 조문 ' + (extraFields.length + 1)); label.htmlFor = id;
      var input = el('textarea'); input.id = id; input.rows = 3; input.required = true; input.value = value || '';
      input.addEventListener('input', function () { status.textContent = '저장하지 않은 변경사항'; });
      field.append(label, input); panels[2].appendChild(field); extraFields.push(input);
      return input;
    }
    try {
      var saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved && Array.isArray(saved.values)) {
        fields.forEach(function (f, i) { if (typeof saved.values[i] === 'string') f.value = saved.values[i]; });
        if (Array.isArray(saved.extra)) saved.extra.filter(function (v) { return typeof v === 'string'; }).forEach(addField);
        status.textContent = '이 기기에 저장한 예시 초안 불러옴';
      }
    } catch (_) { status.textContent = '이 환경에서는 기기 저장을 사용할 수 없습니다'; }
    function save() {
      try { localStorage.setItem(key, JSON.stringify({ values: fields.map(function (f) { return f.value; }), extra: extraFields.map(function (f) { return f.value; }) })); status.textContent = '이 기기에 임시저장됨 · ' + new Date().toLocaleTimeString('ko-KR'); }
      catch (_) { status.textContent = '저장하지 못했습니다. 검토 단계에서 초안을 내려받아 주세요.'; }
    }
    main.querySelector('[data-work-save]').addEventListener('click', save);
    fields.forEach(function (f) { f.required = true; f.addEventListener('input', function () { f.removeAttribute('aria-invalid'); status.textContent = '저장하지 않은 변경사항'; }); });
    function reviewText() { return fields.concat(extraFields).map(function (f) { return f.closest('.ggc-field').querySelector('label').textContent.trim() + '\n' + f.value; }).join('\n\n'); }
    function validate() {
      var invalid = fields.concat(extraFields).find(function (f) { return !f.value.trim(); });
      if (!invalid) return true;
      step = panels.findIndex(function (p) { return p.contains(invalid); }); show();
      invalid.setAttribute('aria-invalid', 'true'); invalid.focus(); invalid.reportValidity(); return false;
    }
    function show() {
      setPane(main, 'primary'); panels.forEach(function (p, i) { p.hidden = i !== step; });
      editor.querySelector('.ggc-work-editor-head').textContent = (step + 1) + '단계 · ' + names[step];
      main.querySelectorAll('.ggc-wizard').forEach(function (wizard) {
        wizard.querySelectorAll('.ggc-wizard-step').forEach(function (node, i) {
          node.classList.toggle('is-current', i === step); node.classList.toggle('is-done', i < step);
          if (i === step) node.setAttribute('aria-current', 'step'); else node.removeAttribute('aria-current');
          var b = node.querySelector('.dot'); b.textContent = String(i + 1); b.setAttribute('aria-label', (i + 1) + '단계 ' + names[i]);
        });
      });
      toolbar.querySelector('.ggc-wizard-mini').textContent = (step + 1) + ' / 4';
      toolbar.querySelector('[data-work-prev]').disabled = step === 0;
      toolbar.querySelector('[data-work-next]').textContent = step === 3 ? '초안 내려받기' : '다음';
      if (step === 3) {
        panels[3].replaceChildren(el('p', '', '예시 초안입니다. 내용을 확인하고 파일로 내려받을 수 있습니다. 실제 제출은 수행하지 않습니다.'));
        fields.concat(extraFields).forEach(function (f) { panels[3].appendChild(el('h3', 'ggc-h3', f.closest('.ggc-field').querySelector('label').textContent)); panels[3].appendChild(el('p', 'ex-work-review', f.value)); });
      }
    }
    main.querySelectorAll('.ggc-wizard').forEach(function (w) { w.querySelectorAll('.dot').forEach(function (b, i) { b.addEventListener('click', function () { step = i; show(); }); }); });
    toolbar.querySelector('[data-work-prev]').addEventListener('click', function () { step = Math.max(0, step - 1); show(); });
    toolbar.querySelector('[data-work-next]').addEventListener('click', function () { if (step === 3) { if (validate()) download('조례-예시초안.txt', reviewText()); } else { step++; show(); } });
    editor.querySelector('.ggc-btn--dashed').addEventListener('click', function () {
      addField('').focus(); status.textContent = '저장하지 않은 변경사항';
    });
    main.querySelectorAll('.ggc-work-secondary button:not(.dot)').forEach(function (b) { b.addEventListener('click', function () {
      if (b.textContent.includes('이동')) { step = 2; show(); main.querySelector('#w5').focus(); }
      else workNotice('예시 검토 의견', '이 화면의 조문과 검토 의견은 가상 데이터입니다. 실제 작성 시 최신 법령 원문과 소관 부서의 검토를 확인해 주세요.');
    }); });
    main.querySelectorAll('.ggc-work-secondary a, .ggc-work-step a').forEach(function (a) { a.href = workLink('explore'); });
    show();
  }

  function boot() {
    revealMarkup();
    paintSwatches();
    markCurrentNav();
    bindProfileToggle();
    bindToastDemo();
    initWork();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
