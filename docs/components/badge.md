# 배지 · 태그 — `.ggc-badge` · `.ggc-tag`

**알약형 배지는 상태**(결재 · 회기 · 역할), **사각 태그는 분류 · 출처**다. 한 화면에서 같은 모양이 두 뜻으로 읽히지 않게 둘을 섞지 않는다.

## 마크업

```html
<!-- 상태 (결재) -->
<span class="ggc-badge ggc-badge--approved">✓ 승인</span>
<span class="ggc-badge ggc-badge--pending">◷ 대기</span>
<span class="ggc-badge ggc-badge--rejected">✕ 반려</span>
<span class="ggc-badge ggc-badge--paid">₩ 지급완료</span>
<!-- 상태 (회기) -->
<span class="ggc-badge ggc-badge--session">● 회기 중</span>
<span class="ggc-badge ggc-badge--meeting">◆ 회의일</span>
<span class="ggc-badge ggc-badge--recess">○ 비회기</span>
<!-- 역할 (신원) — 상태와 다른 축 -->
<span class="ggc-badge ggc-badge--role-member">의원</span>
<span class="ggc-badge ggc-badge--role-staff">사무처</span>
<span class="ggc-badge ggc-badge--role-policy">정책지원관</span>
<span class="ggc-badge ggc-badge--role-other">기타</span>
<!-- 태그 -->
<span class="ggc-tag">조례</span>
<span class="ggc-tag ggc-tag--primary">본회의</span>
<span class="ggc-tag ggc-tag--warning">계속심사</span>
```

## 규칙

- **텍스트나 기호를 반드시 함께.** 색만 남기면 색각 이상 사용자가 구분할 수 없고, 고대비에서는 배경이 평탄화돼 일곱 종이 같아 보인다.
  기호 어휘: ✓ 승인 · ◷ 대기 · ✕ 반려 · ● 회기 중 · ◆ 회의일 · ○ 비회기 · ⚠ 경고. 이모지는 쓰지 않는다.
- 상태 라벨은 **그 업무의 결재 단계 어휘**(접수 · 검토 · 결재 · 시행 · 완료 · 반려)다. 영문 라벨을 남기지 않는다.
- 상태 어휘가 늘었다고 색을 늘리지 않는다 — 7 변형으로 표현하고, 모자라면 정본을 먼저 고친다.
- 금/앰버(정책지원관 쌍)를 역할 배지 밖으로 확산시키지 않는다.

## Tier 2

`badge` — `<Badge variant="approved|pending|rejected|paid|session|meeting|recess|role-member|…">`, `<Tag variant="primary|info|success|warning|danger">`.

## 근거

ggc-tokens.css `.ggc-badge`(토큰 파일에 있어 토큰만 복사해도 따라온다) · ggc-components.css §5 `.ggc-tag` · KRDS badge/tag.
