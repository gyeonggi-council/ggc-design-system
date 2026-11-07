# 아바타 — `.ggc-avatar`

사람 · 기관 · AI 를 한 칸으로 보인다. 옆에는 늘 **실명 · 역할 · 부서**(계약 §2 — UUID 금지). v4.0(ADR 0016).

## 마크업

```html
<span class="ggc-avatar" aria-hidden="true">김</span>
<span class="ggc-avatar" role="img" aria-label="사용자"><svg aria-hidden="true"><use href="#i-user"/></svg></span>
<span class="ggc-avatar ggc-avatar--square ggc-avatar--ai" role="img" aria-label="AI 의정 비서"><svg aria-hidden="true"><use href="#i-bot"/></svg></span>
<div class="ggc-avatar-row">
  <span class="ggc-avatar ggc-avatar--member" aria-hidden="true">김</span>
  <span class="who"><span class="name">김○○ 의원</span><span class="meta">기획재정위원회 · 위원장</span></span>
</div>
<div class="ggc-avatar-group" aria-label="검토자 6명">
  <span class="ggc-avatar ggc-avatar--sm" aria-hidden="true">김</span><span class="ggc-avatar ggc-avatar--sm" aria-hidden="true">이</span>
  <span class="more">+4</span>
</div>
```

사진은 `<img>` 를 안에 넣는다(`alt` 는 실명). 사진이 없으면 **머리글자 한 자**, 그것도 없으면 lucide `user`.

## 변형

| 클래스 | 언제 |
|---|---|
| `--sm` / 기본 / `--lg` | 행 안 · 카드 머리 · 상세 머리 (`--ggc-space-6` / `-7` / `-9`) |
| `--square` | 기관 · 시스템 · AI — 사람과 모양으로 가른다 |
| `--ai` | AI — 잉크 바탕(`--ggc-accent`) + 흰 아이콘. `--square` 와 함께 |
| `--member` `--staff` `--policy` `--other` | 역할 색쌍 — [배지](badge.md)의 역할 축과 같은 뜻으로만 |
| `.ggc-avatar-row` | 아바타 + 이름 + 메타 한 줄. 이름은 잘리지 않고 메타만 말줄임 |
| `.ggc-avatar-group` | 겹쳐 쌓기. 넷을 넘으면 `.more` 「+n」 — 전원은 누르면 목록 |

## 키보드 · ARIA

- 이름이 옆에 있으면 아바타는 `aria-hidden="true"`(같은 말 두 번 읽지 않는다). 아바타만 있으면 `role="img" aria-label="실명"`.
- 묶음은 `aria-label="검토자 6명"` 처럼 **수**를 준다. 누르는 아바타는 `<button>` 으로 감싼다 — span 에 click 을 달지 않는다.

## 프로필

치수는 간격 토큰(`--ggc-space-*`)이라 프로필과 무관하다. 대민 화면에서는 글자만 커진다.

## 규칙

- 색은 역할의 뜻으로만. 이름 해시로 색을 돌리는 「랜덤 아바타」는 만들지 않는다 — 한 화면에 주색이 는다.
- 아바타만으로 사람을 가리키지 않는다(색 단독 · 그림 단독 금지). 행에는 이름이 함께 있다.
- 하지 말 것: 아바타에 상태 점 얹기(상태는 [배지](badge.md)) · 그라데이션 · 테두리 장식.

## Tier 2

`avatar`(`Avatar` `AvatarImage` `AvatarFallback`) — shadcn 공식 + 토큰. AI 는 `className="rounded-md bg-primary text-primary-foreground"`.

## 근거

Astryx Avatar · 계약 §2(실명 · 역할 · 부서) · ggc-components.css §46.
