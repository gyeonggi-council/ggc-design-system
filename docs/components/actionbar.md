# 하단 스티키 액션바 — `.ggc-actionbar`

Configure(위저드·작성) 화면의 슬롯 5. **액션바가 없으면 Configure 가 아니다.**
본문 컬럼의 **마지막 요소**로 두면 `position: sticky; bottom: 0` 으로 뷰포트 바닥에 붙는다 —
LNB 폭을 계산할 필요가 없고, 문서 흐름상 본문 다음이라 키보드 순서도 자연스럽다.

## 마크업

```html
<main class="ggc-shell-main ggc-shell-main--wide">
  … 스텝퍼 · 폼 …
  <div class="ggc-actionbar">
    <div class="status">임시저장 2026-08-29 14:32 · 3 / 4 단계 · 조문 작성</div>
    <div class="actions">
      <button class="ggc-btn ggc-btn--secondary" type="button">임시저장</button>
      <button class="ggc-btn ggc-btn--primary" type="button">상신</button>
    </div>
  </div>
</main>
```

상신 중:

```html
<button class="ggc-btn ggc-btn--primary" type="button" disabled>
  <span class="ggc-spinner ggc-spinner--sm" aria-hidden="true"></span> 상신 중
</button>
```

## 변형

| 클래스 | 무엇 |
|---|---|
| `--fixed` | `position: fixed` — 본문 컬럼 밖에 둬야 할 때. 셸 안에서 `left: var(--ggc-lnb-w)`. ≤900 에서 `left: 0` |

## 규칙

- 순서 고정: **임시저장(secondary) → 상신/완료(primary)**. 이전/다음 단계 이동은 스텝퍼 쪽이다.
- `.status` 에는 마지막 저장 시각(절대 시각)과 단계. ≤900px 에서는 숨고 버튼이 가로 가득 찬다.
- 단계 이동으로 입력을 잃게 하지 않는다 — 임시저장이 있는 이유다.
- 배경은 `rgba(255,255,255,.92)` + blur(원본 실측). 고대비에서는 `Canvas` + 상단 테두리.

## 프로필

버튼은 프로필을 따른다. 바 자체 패딩은 같다.

## Tier 2

`ggc-actionbar` (block).

## 근거

archetypes Configure 슬롯 5·6 · 조례초안 작성 위저드.dc.html 실측(하단 바 46px 버튼).
