# 의안 스튜디오 2.0 B안 화면 캡처

[참고 HTML 원본](../ggc-legislative-studio-v2.html)을 수정하지 않고 Chromium에서 각 화면을 가상 데이터 초기 상태로 열어 캡처했다.
운영 서비스 반영이나 실제 서명·AI·접수·외부 연계의 검증 결과를 뜻하지 않는다.

- 원본 SHA-256: `cf40f047d284f906c487b6080bb74cc3df565b0da14de19761a90c443b058451`
- PC: 1440 × 900 CSS px, 배율 1.
- 모바일: 390 × 844 CSS px iframe에서 같은 원본을 렌더링한 뒤 해당 뷰포트만 자른 PNG. 별도 모바일 시안을 그린 것이 아니다.
- 각 이미지는 첫 화면이며, 긴 내용과 넓은 표·단계는 스크롤로 이어진다.
- 의안·인물·문서 데이터는 가상 예시다. 업무용 비공개 초안 예시와 도민용 공개 예시 화면을 구분한다.

| 파일 | 화면 경로 | 크기 |
|---|---|---|
| `desktop-dashboard.png` | `#dashboard` | 1440 × 900 |
| `desktop-bills.png` | `#bills/all` | 1440 × 900 |
| `desktop-editor.png` | `#studio/editor` | 1440 × 900 |
| `desktop-public.png` | `#public/home` | 1440 × 900 |
| `mobile-dashboard.png` | `#dashboard` | 390 × 844 |
| `mobile-bills.png` | `#bills/all` | 390 × 844 |
| `mobile-editor.png` | `#studio/editor` | 390 × 844 |

## 다시 캡처할 때

1. 원본 HTML을 새 브라우저 작업공간에서 연다. 운영 데이터나 기존 사용자 작업을 가져오지 않는다.
2. 위 화면 경로로 이동하고, PC 또는 모바일 뷰포트를 설정한다. 모바일 메뉴는 닫힌 기본 상태로 둔다.
3. 원본 렌더링이 끝난 것을 확인한 뒤 첫 화면을 PNG로 캡처한다. 캡처용 라벨이나 가짜 UI를 화면 위에 추가하지 않는다.
4. 이미지, 이 문서의 원본 해시, 루트 README의 이미지 경로를 함께 갱신한다.

`design/examples/shots/`의 기존 정본 생성물과는 별도의 참고 시안 캡처다. 정본 이미지나 기존 생성 스크립트는 덮어쓰지 않는다.
