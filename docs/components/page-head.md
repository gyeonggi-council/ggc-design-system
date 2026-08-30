# 페이지 헤더 — `.ggc-page-head`

브레드크럼 + 제목 + 메타 + **주 액션 하나**. 모든 업무 화면의 첫 줄이다.
Monitor 첫 화면만 인사말형(`--greeting`)을 쓰고 나머지는 경로형이다(archetypes "헤더 제목부 2형").

## 마크업

```html
<div class="ggc-page-head">
  <nav class="ggc-breadcrumb" aria-label="현재 경로">
    <ol><li><a href="/">홈</a></li><li><a href="/bills">의안</a></li><li aria-current="page">의안 목록</li></ol>
  </nav>
  <div class="row">
    <div>
      <h1 class="title">의안 목록</h1>
      <p class="meta">제12대 · 제380회 정례회 · 접수 147건 · 처리 대기 21건</p>
    </div>
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
| `--greeting` | Monitor 첫 화면 인사말 — `{이름}님, 오늘 처리할 {업무} {N}건이 있습니다` (17px/800). 브레드크럼 없음 |

## 규칙

- **주 액션은 하나**(primary). 보조는 secondary·ghost. 둘 이상 primary 를 두면 무엇을 눌러야 하는지 흐려진다.
- 메타에 **기관 맥락**을 적는다 — 제N대 · 제NNN회 · 소관 · 건수. 상대시간("3시간 전")은 쓰지 않는다.
- 제목은 화면당 하나의 `<h1>` 이다.

## 프로필

치수 차이 없음(제목 18px 고정). 대민 화면은 페이지 헤더 대신 KRDS 페이지 타이틀 패턴을 쓴다(Phase 4).

## Tier 2

레지스트리 항목 `ggc-page-head` (Phase 7).

## 근거

`skills/ggc-design/references/archetypes.md` 헤더 제목부 2형 · 계약 §2(사용자 표기는 실명·역할·부서).
