# 페이지 헤더 — `.ggc-page-head`

본문 첫 줄 — **메타 + 주 액션 하나**. 브레드크럼과 제목(`<h1>`)은 GNB 제목부(`.ggc-gnb-page`, [shell.md](shell.md))에 있다(v2.1, ADR 0008).
Monitor 첫 화면만 인사말형(`--greeting`)을 쓴다 — 인사말은 `<p class="title">` 이고 h1 이 아니다.

## 마크업

```html
<div class="ggc-page-head">
  <div class="row">
    <p class="meta">제12대 · 제380회 정례회 · 접수 147건 · 처리 대기 21건</p>
    <div class="actions">
      <button class="ggc-btn ggc-btn--secondary" type="button">엑셀 내려받기</button>
      <button class="ggc-btn ggc-btn--primary" type="button">＋ 의안 등록</button>
    </div>
  </div>
</div>
```

## 변형

| 클래스 | 무엇 |
|---|---|
| `--greeting` | Monitor 첫 화면 인사말 — `<p class="title">{이름}님, 오늘 처리할 {업무} {N}건이 있습니다</p>` (17px/800) + `.meta`. h1 은 GNB 에 있고 브레드크럼 없음 |
| (셸 ⓐ) | GNB 가 없는 유틸리티 바만 셸에서는 예전처럼 브레드크럼 + `<h1 class="title">` 을 여기 둔다 — 이 경우에만 |

## 규칙

- **주 액션은 하나**(primary). 보조는 secondary·ghost. 둘 이상 primary 를 두면 무엇을 눌러야 하는지 흐려진다.
- 메타에 **기관 맥락**을 적는다 — 제N대 · 제NNN회 · 소관 · 건수. 상대시간("3시간 전")은 쓰지 않는다.
- 화면당 `<h1>` 은 하나이고 **GNB 제목부에 있다.** 여기엔 두지 않는다(셸 ⓐ 예외).

## 프로필

치수 차이 없음(제목 18px 고정). 대민 화면은 페이지 헤더 대신 KRDS 페이지 타이틀 패턴을 쓴다(Phase 4).

## Tier 2

레지스트리 항목 `ggc-page-head` (Phase 7).

## 근거

`skills/ggc-design/references/archetypes.md` "GNB 제목부" · 계약 §2 · ADR 0008.
