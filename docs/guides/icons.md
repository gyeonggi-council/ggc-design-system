# 아이콘 — lucide 하나로 (v3.0)

결정: [ADR 0009](../decisions/0009-work-profile-shadcn-density.md) §3. 이모지(📋 📄 🗓) · 유니코드 기호(◷ ✕ ● ◆ ○ ▲ ＋ →)를 UI 아이콘으로 쓰지 않는다.
글꼴 렌더러마다 모양이 다르고 Pretendard 옆에서 이질적이며, 제품 인상이 가장 크게 갈리는 지점이었다(진단 §3-5).

## 정본

| 무엇 | 어디 | 생성 |
|---|---|---|
| 원천 svg | `design/icons/lucide/*.svg` — lucide-static 1.41.0 에서 그대로 복사(ISC, `LICENSE` 동봉). 손으로 고치지 않는다 | — |
| 스프라이트 (Tier 1) | `design/ggc-icons.svg` — `<symbol id="i-<이름>">` 90종 | `python design/build-icons.py` |
| 갤러리 인라인 | 각 쪽 `<body>` 첫 줄 `<!-- ggc-icons:begin -->…<!-- ggc-icons:end -->` | 같은 스크립트가 갈아 끼운다 |
| Tier 2 | `lucide-react` — 공식 shadcn 소스가 쓰는 그대로 | — |

새 아이콘이 필요하면 lucide-static 의 svg 를 `design/icons/lucide/` 에 복사하고 스크립트를 돌린다. **다른 세트를 섞지 않는다.**
낡았는지는 `check_design.py --canon` D6 gen 이 본다(`build-icons.py --check`).

## 쓰는 법 — Tier 1

```html
<!-- 서비스: 스프라이트를 정적루트에 복사(D1 대조)하고 같은 오리진에서 참조 -->
<button class="ggc-btn ggc-btn--primary"><svg class="ggc-icon" aria-hidden="true"><use href="ggc-icons.svg#i-plus"/></svg>의안 등록</button>

<!-- 망분리 정적 HTML · file:// 은 외부 <use> 가 막힌다 — 갤러리처럼 <body> 첫 줄에 인라인하고 #i-plus 로 참조 -->
<svg class="ggc-icon" aria-hidden="true"><use href="#i-plus"/></svg>
```

- `.ggc-icon` 16 · `.ggc-icon--lg` 20 · `.ggc-icon--sm` 14. 값은 `--ggc-icon` · `--ggc-icon-lg`(대민 20/24).
- 색은 `currentColor` — 부모 글자색을 따른다. 장식 아이콘은 `--ggc-text-faint`, 동작 아이콘은 `--ggc-text-muted`.
- **svg 는 항상 `aria-hidden="true"`.** 아이콘만 있는 버튼은 버튼에 `aria-label` 을 둔다.
- 버튼 · 배지 · 행 아이콘 박스 · 사이드바 항목 · KPI 타일 · 검색 · 알림 버튼은 CSS 가 크기를 잡는다(§3 · §5 · §6 · §9 · §37).

## 쓰는 법 — Tier 2

```tsx
import { PlusIcon, ClockIcon } from "lucide-react"
<Button><PlusIcon />의안 등록</Button>
<Badge variant="pending"><ClockIcon />대기</Badge>
```

공식 소스가 `[&_svg]:size-4` 로 크기를 잡는다. 크기를 바꿀 때만 `className="size-5"`.

## 상태 · 동작 아이콘 어휘 (갤러리 · 문서 공통)

| 뜻 | lucide | 비고 |
|---|---|---|
| 회기 중 · 회부 · 심사(진행) | `circle-dot` | `.ggc-badge--session` |
| 회의일 | `calendar-check` | `.ggc-badge--meeting` |
| 비회기 | `circle` | `.ggc-badge--recess` |
| 승인 · 완료 | `check` · `circle-check` | `.ggc-badge--approved`, 스텝퍼 완료 |
| 대기 · 접수 · 계속심사 | `clock` | `.ggc-badge--pending` |
| 반려 · 오류 | `x` · `circle-x` | `.ggc-badge--rejected` |
| 경고 · 주의 | `triangle-alert` | `.ggc-alert--warning` |
| 안내 | `info` | `.ggc-alert--info` |
| 추이 상승 / 하락 | `trending-up` / `trending-down` | `.ggc-stat .trend` |
| 추가 · 등록 | `plus` | 주 액션 버튼 |
| 이전 / 다음 (쪽) | `chevron-left` / `chevron-right` | 페이지네이션 |
| 뒤로 / 앞으로 (동선) | `arrow-left` / `arrow-right` | 위저드 이전·다음, "자세히" |
| 내려받기 / 올리기 / 인쇄 | `download` / `upload` / `printer` | |
| 검색 / 알림 / 메뉴 | `search` / `bell` / `menu` | 헤더 |
| 조례 · 법령 | `scale` · `scroll-text` | 행 아이콘 |
| 의안 · 문서 | `file-text` · `clipboard-list` | |
| 일정 | `calendar` · `calendar-days` | |
| 사용자 · 의원 | `user` · `users` | |
| 사이드바 접기 | `panel-left` | `SidebarTrigger` |

배지 · 버튼 안 아이콘은 **항상 텍스트와 함께** — 색 단독 금지 규칙은 그대로다(계약 §3).
