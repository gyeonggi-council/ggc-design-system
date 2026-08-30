# 알림 · 콜아웃 — `.ggc-alert`

인라인 알림. 화면 안에 놓이는 상태·안내·오류다. 화면 밖에서 잠깐 떴다 사라지는 토스트(`.ggc-toast`, P1)와 다르다.
기존 `.ggc-qr-callout`(§11)을 일반화한 것 — 로그인 화면은 그대로 두고 새 코드는 이것을 쓴다.

## 마크업

```html
<div class="ggc-alert ggc-alert--warning" role="status">
  <span class="icon" aria-hidden="true">⚠</span>
  <div class="body">
    <strong class="title">기한 임박</strong>
    <p>회부 후 30일이 2026-09-02 에 지난다. 「경기도의회 회의규칙」 제42조에 따라 계속심사 여부를 결정해야 한다.</p>
  </div>
  <div class="actions"><a class="ggc-btn ggc-btn--secondary ggc-btn--sm" href="…">의안 보기</a></div>
  <button class="close" type="button" aria-label="닫기">✕</button>
</div>
```

## 변형

| 클래스 | 기호 | 언제 | `role` |
|---|---|---|---|
| (없음) | § ⓘ | 근거 조문·참고 안내 | `status` 또는 없음 |
| `--info` | ⓘ | 회기 중 · 진행 상태 | `status` |
| `--success` | ✓ | 상신 완료 · 저장됨 | `status` |
| `--warning` | ⚠ | 기한 임박 · 확인 필요 | `status` |
| `--danger` | ✕ | 처리 불가 · 오류 | `alert` |
| `--banner` | | 본문 상단 가로 띠 — 긴급 공지 (KRDS critical alerts) | `alert` |

## 규칙

- **기호 + 제목 + 문구.** 색만으로 구분하지 않는다. 고대비에서는 좌측 4px 테두리로 구분된다.
- 오류 문구는 **사유와 근거**를 준다 — "입력값이 잘못되었습니다" 가 아니라
  "위원 정수 상한(25명)을 초과한다 — 「청년기본법 시행령」 제6조 제2항".
- `role="alert"` 는 즉시 읽어야 하는 오류에만. 나머지는 `status`. 둘 다 `aria-live` 를 내포한다.
- 닫기(`.close`)는 정보성에만 둔다. 오류는 원인이 해소돼야 사라진다.

## 프로필

치수 차이 없음(글자 13px). 대민 화면에서는 `--banner` 를 KRDS critical alerts 자리(마스트헤드 아래)에 둔다.

## Tier 2

`alert` (shadcn Alert, GGC 테마).

## 근거

KRDS `critical_alerts.html` · 기존 `.ggc-qr-callout` · domain-language "오류 문구는 사유와 근거를 함께".
