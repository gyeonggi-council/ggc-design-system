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

  /* --------------------------------------------------------------- 현재 페이지 */

  function markCurrentNav() {
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".ggc-lnb-item").forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (href === here) a.setAttribute("aria-current", "page");
    });
  }

  function boot() {
    revealMarkup();
    paintSwatches();
    markCurrentNav();
    bindProfileToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
