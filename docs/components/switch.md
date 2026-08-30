# 토글 스위치 — `.ggc-switch`

**즉시 적용되는** 켬/끔에만 쓴다 — 알림 수신, 공개 여부, 자동 저장. 저장 버튼을 눌러야 반영되는 선택은
체크박스([check-radio.md](check-radio.md))다. 스위치를 켜면 사용자는 "이미 적용됐다"고 읽는다.

## 마크업

```html
<label class="ggc-switch">
  <input type="checkbox" role="switch" checked>
  <span class="track"></span>
  <span class="text">회부 알림 <span class="state"></span></span>
</label>

<!-- 설정 목록 행 — 글자 왼쪽, 트랙 오른쪽 끝 -->
<label class="ggc-switch ggc-switch--row">
  <input type="checkbox" role="switch">
  <span class="track"></span>
  <span class="text">검토보고서 공개 <span class="state"></span></span>
</label>
```

`.state` 는 비워 둔다 — CSS 가 "켬/끔" 을 그린다. `role="switch"` 가 상태를 읽어 주므로 장식이다.

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 켬 | `checked` — 배경 primary + 손잡이 오른쪽 + "켬" |
| 비활성 | `disabled` — 회색, 글자 subtle. **이유를 `.text` 에 적는다**("필수 수신") |
| 행형 | `--row` — 폭 100%, 트랙이 오른쪽 |

## 키보드 · ARIA

네이티브 체크박스라 `Space` 로 토글, `Tab` 으로 이동. `role="switch"` 는 스크린리더가 "켬/끔" 으로 읽게 한다 —
빠뜨리면 "선택됨/선택 안 됨" 으로 읽어 의미가 흐려진다. 포커스 링은 트랙에 그린다.

## 규칙

- 켬/끔은 색 + 손잡이 위치 + 상태 문구 셋이다. 색만으로 끝내지 않는다.
- 스위치를 바꾸면 **곧바로 저장**한다(`change` 에서 요청). 실패하면 되돌리고 토스트로 알린다([toast.md](toast.md)).
- 라벨은 동사가 아니라 **상태 이름**이다 — "알림 켜기" 가 아니라 "회부 알림".

## 프로필

글자 `--ggc-control-font`(업무 13.5 / 대민 17). 트랙 크기는 같다(40×22).

## Tier 2

`switch` (Phase 9b). Radix Switch + 같은 토큰.

## 근거

KRDS `toggle_switch` · §24.
