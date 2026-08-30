# 탭 — `.ggc-tabs` · `.ggc-tablist` · `.ggc-tab` · `.ggc-tabpanel`

한 레코드의 여러 면(개요 · 심사 경과 · 첨부 · 이력)을 한 화면에서 전환한다. KRDS `tab(line)` 구조.
**페이지 이동에는 쓰지 않는다** — 그건 LNB 나 브레드크럼이다.

## 마크업

```html
<div class="ggc-tabs">
  <div class="ggc-tablist" role="tablist" aria-label="의안 정보">
    <button class="ggc-tab" role="tab" id="t1" aria-selected="true"  aria-controls="p1" type="button">개요</button>
    <button class="ggc-tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1" type="button">심사 경과 <span class="count">3</span></button>
  </div>
  <div class="ggc-tabpanel" role="tabpanel" id="p1" aria-labelledby="t1">…</div>
  <div class="ggc-tabpanel" role="tabpanel" id="p2" aria-labelledby="t2" hidden>…</div>
</div>
```

카드 안에 두면(`.ggc-card > .ggc-tabs`) 좌우 패딩이 카드에 맞춰진다.

## 키보드 · ARIA (`ggc-behaviors.js`)

| 키 | 동작 |
|---|---|
| `Tab` | 선택된 탭 하나에만 들어간다(roving tabindex) → 다음 `Tab` 은 패널 본문으로 |
| `←` `→` | 이전·다음 탭 선택 + 포커스 (끝에서 순환) |
| `Home` `End` | 첫·마지막 탭 |
| 클릭 | 선택 |

선택 시 `aria-selected` · `tabindex` · 패널 `hidden` 을 스크립트가 옮기고 `ggc:tabchange` 이벤트를 낸다.
스크립트가 없으면 마크업에 적힌 초기 선택 상태로만 보인다.

## 규칙

- 선택 표시는 **색 + 하단 2px 선** 둘 다다. 고대비에서는 outline 으로 복원된다.
- 탭 라벨은 명사구, 건수는 `.count`. 탭이 6개를 넘으면 정보 구조를 다시 본다.
- 패널 안의 첫 화면(빈 상태 포함)도 함께 만든다.

## 프로필

탭 글자는 `--ggc-control-font`(업무 13.5 / 대민 17). 마크업은 같다.

## Tier 2

`tabs` (Radix Tabs, GGC 테마).

## 근거

KRDS `html/code/tab.html` · WAI-ARIA Tabs 패턴.
