# 텍스트 목록 — `.ggc-text-list`

안내문 · 유의사항 · 제출 서류처럼 **본문(`.ggc-prose`) 밖** 목록. `ul`/`ol` 그대로에 내어쓰기만 얹는다 —
둘째 줄이 표식 아래가 아니라 글자 아래에 온다.

## 마크업

```html
<ol class="ggc-text-list">
  <li>의안 원문 (HWP) <span class="note">조문 · 제안 이유 · 신구조문대비표를 하나로</span></li>
  <li>비용추계서 또는 생략 사유서</li>
  <li>관련 법령 목록
    <ul><li>상위법 조문</li><li>타 시·도 유사 조례</li></ul>
  </li>
</ol>

<ul class="ggc-text-list ggc-text-list--check">
  <li>의안 원문 — 2026-08-25 제출</li>
</ul>
<ul class="ggc-text-list ggc-text-list--dash">
  <li>관련 법령 목록은 아직 제출되지 않았다 — 회부 전까지 낸다</li>
</ul>
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 번호 | `<ol>` |
| 하이픈 | `--dash` — 짧은 안내 |
| 완료 | `--check` — ✓ (success). 완료 항목 · 제출 완료 서류 |
| 표식 없음 | `--none` |
| 촘촘히 | `--tight` |
| 보조 문구 | `li` 안 `.note` |

## 규칙

- 한 항목은 한 문장이다. 두 문장이면 `.note` 로 나누거나 항목을 쪼갠다.
- `--check` 는 **완료된 사실**에만 — 할 일 목록에는 체크박스([check-radio.md](check-radio.md))다.
- 표식을 마크업에 적지 않는다("- ", "✓ "). 스크린리더가 읽는다.
- 2단까지. 3단이 필요하면 구조가 잘못됐다 — 표나 절로 바꾼다.

## 프로필

글자 13.5px 고정. 대민에서는 `.ggc-public` 본문 크기를 따르지 않는다 — 필요하면 `.ggc-prose` 안 목록을 쓴다.

## Tier 2

없음 — `<ul className="ggc-text-list">` 그대로.

## 근거

KRDS `text_list` · §35.
