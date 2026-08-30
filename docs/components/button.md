# 버튼 — `.ggc-btn`

## 마크업

```html
<button class="ggc-btn ggc-btn--primary" type="button">＋ 의안 등록</button>
<button class="ggc-btn ggc-btn--secondary" type="button">임시저장</button>
<button class="ggc-btn ggc-btn--ghost" type="button">미리보기</button>
<button class="ggc-btn ggc-btn--secondary ggc-btn--sm" type="button">검토</button>
<button class="ggc-btn ggc-btn--primary ggc-btn--lg" type="button">상신</button>
<button class="ggc-btn ggc-btn--dashed" type="button">＋ 조문 직접 추가</button>
<button class="ggc-btn ggc-btn--primary" type="button" disabled><span class="ggc-spinner ggc-spinner--sm" aria-hidden="true"></span> 상신 중</button>
```

`<a class="ggc-btn …">` 도 같은 모습이다 — 페이지 이동은 `<a>`, 동작은 `<button type="button">`.

## 변형 · 크기

| 클래스 | 언제 |
|---|---|
| `--primary` | 화면의 **주 액션 하나** (상신 · 등록 · 검색). 유일하게 그림자 |
| `--secondary` | 보조 (임시저장 · 취소 · 내려받기) |
| `--ghost` | 셋째 이하 · 카드 안 링크성 동작 |
| `--dashed` | "＋ 추가" 자리 표시 (가로 가득) |
| `--sm` / `--lg` / `--block` | 행 안 액션 / 서식 제출 · 위저드 하단 / 가로 가득 |

높이는 `--ggc-control-h-sm` / `--ggc-control-h` / `--ggc-control-h-lg` — 업무 34/42/46, 대민 40/48/56.

## 규칙

- 라벨은 **명사구** — "저장하기" 가 아니라 "임시저장". 방향 기호를 붙인다(`＋ 의안 등록`, `← 이전`, `다음 →`).
- 파괴적 동작(반려 · 회수 · 삭제)은 primary 를 빨갛게 칠하지 말고 **확인형 모달**로 한 단계 둔다.
- 처리 중은 `disabled` + 스피너 + "…중" 라벨. 아이콘만인 버튼은 `.ggc-icon-btn` + `aria-label`.
- 포커스 링을 지우지 않는다. hover 는 토큰(`--ggc-primary-dark`)이 준다.

## Tier 2

`button` — `variant="default|secondary|ghost|dashed|destructive|link"`, `size="sm|default|lg|icon"`.

## 근거

ggc-components.css §6 · 대시보드.dc.html 실측(34/42/44/46 → 정규화) · KRDS button.
