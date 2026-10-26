# 토글팁 — `.ggc-toggletip` (v3.3)

ⓘ 를 **누르면** 열리는 짧은 설명이다. 집계 기준 · 용어 풀이 · 전 회기 대비처럼, 읽지 않아도 일은 할 수 있는 보충 설명에 쓴다.
[툴팁](tooltip.md)은 마우스 · 초점에만 보여 휴대폰에서 못 연다 — 휴대폰 · 화면낭독기 사용자도 읽어야 하는 보충 설명은 이것이다.
상태 · 마감 · 오류처럼 판단에 필요한 정보는 화면에 적는다([ADR 0015](../decisions/0015-key-info-on-screen-details-on-demand.md)).

## 마크업

```html
<span class="label">접수 의안</span>
<details class="ggc-toggletip">
  <summary aria-label="접수 의안 집계 기준">
    <svg class="ggc-icon" aria-hidden="true"><use href="#i-info"/></svg>
  </summary>
  <div class="ggc-toggletip-body">제380회 정례회 접수분. 전 회기보다 12건 많다.</div>
</details>
```

네이티브 `<details>` 라 스크립트 없이 열고 닫힌다. `summary` 의 이름은 **무엇에 대한 설명인지**를 말한다(「설명」 「정보」만으로 두지 않는다).

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 위치 | 기본은 아래 · 왼쪽 정렬. `--end` 는 오른쪽 정렬(오른쪽 끝 칸) |
| 폭 | 최대 320(`--ggc-space-11` × 4). 화면이 좁으면 양옆 16 을 남긴다 |
| 가장자리 | 열 때 화면 밖으로 나가면 behaviors ⑥ 이 안쪽으로 민다 |
| 하나만 | 하나를 열면 다른 토글팁은 닫힌다 |

## 키보드 · ARIA

`summary` 가 단추 역할이다 — 누르기 · `Enter` · `Space` 로 열고 닫는다. 열림 상태는 브라우저가 화면낭독기에 알린다.
`Esc` · 바깥 누르기로 닫히고 초점은 `summary` 로 돌아온다. [정보 서랍](sheet.md) 안이면 첫 `Esc` 는 토글팁만 닫는다.
본문 안 링크는 `Tab` 으로 닿는다. `role="tooltip"` 을 쓰지 않는다 — 누르면 열리는 펼침 단추다.

## 규칙

- 한 덩어리 · 두세 문장. 길면 [정보 서랍](sheet.md)이나 상세 화면이다.
- 링크는 하나까지. 단추 · 입력이 필요하면 [모달](modal.md)이다.
- 열마다 · 칸마다 ⓘ 를 붙이지 않는다. 덜어낸 글자 대신 단추를 늘리는 것이다.
- 눌러야만 아는 정보로 사용자를 막지 않는다 — 없어도 그 화면의 일을 끝낼 수 있어야 한다.

## 프로필

업무 · 대민 같다. 본문 글자는 `--ggc-text-sm`(프로필이 키운다).

## Tier 2

`popover` — shadcn 공식(Radix Popover). 트리거는 `Button variant="ghost" size="icon"` + lucide `InfoIcon`.

## 근거

[ADR 0015](../decisions/0015-key-info-on-screen-details-on-demand.md) · W3C APG Disclosure · 정본 §46.
