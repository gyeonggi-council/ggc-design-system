# 브랜드 자산 — 파비콘과 의회 마크

복사원은 `design/brand/dist/` **하나**다. 다른 서비스의 `public/` 이나 업로드 폴더에서 가져오지 않는다 — 같은 바이트가 여섯 곳에
흩어져 "어느 것이 옳은가"를 판별할 수 없던 일이 있었다. 상세 절차(`.ico` 오리진 규칙 · Next 파일 관례 · 검증)는
`skills/ggc-design/references/brand-assets.md`, 출처와 파생 근거는 `design/brand/SOURCE.md`.

## 파일

| 파일 | 크기 | 어디에 |
|---|---|---|
| `favicon.ico` | 16+32+48 | **오리진 루트에 하나만** — 브라우저의 암묵 `/favicon.ico` 요청은 항상 루트로 간다 |
| `favicon-32.png` | 32×32 | 모든 서비스 (`<link rel="icon">` 또는 Next `app/icon.png`) |
| `apple-touch-icon-180.png` | 180×180 | 모든 서비스 (`<link rel="apple-touch-icon">` 또는 Next `app/apple-icon.png`) |
| `assembly-mark.png` | 270×268 | GNB 브랜드 슬롯 40×40 · 대민 헤더 로고 48×48 |
| `MANIFEST.sha256` | | 정본 무결성 — `check_design.py --canon` 이 대조한다 |

배경판은 네이비 `--ggc-primary` 다(2026-08-22 결정) — 마크의 금색 고리가 네이비 위에서 밝은·어두운 탭 양쪽에 읽힌다.

## 선언 3줄 (Next 제외)

```html
<link rel="icon" type="image/png" sizes="32x32" href="{정적루트}/favicon-32.png?v=1">
<link rel="apple-touch-icon" href="{정적루트}/apple-touch-icon-180.png?v=1">
<meta name="theme-color" content="#3C5D93">
```

`?v=1` 은 캐시 무효화 손잡이 — 정본 바이트가 바뀔 때만 올린다. Next App Router 는 `app/icon.png` · `app/apple-icon.png` 파일 관례를 쓰고
`<link>` 를 손으로 쓰지 않는다(`app/favicon.ico` 는 두지 않는다).

## 만들지 않는 것

`favicon.svg`(마크가 3색 래스터라 SVG 로 다시 그리면 마크를 다시 디자인하는 일) · `favicon-16.png`(`.ico` 안에 있다) ·
`manifest.webmanifest`(PWA 계획 없음, 세션 게이트에서 401) · `mask-icon`.

## 마크 외 CI 자산

가로조합 로고 · 축약 로고 · 슬로건은 이 저장소에 넣지 않는다. 브랜드 아이덴티티 정본은 별도 저장소 `ggc-design-guide` 이며
대외 배포 판단은 그쪽에서 난다. 대민 마스트헤드·아이덴티파이어의 **국가 상징(태극기) 이미지**도 이 저장소에 없다 — 서비스가 정부 제공 자산으로 채운다.

## 검증 — 파비콘은 강제 새로고침으로 갱신되지 않는다

Chrome 은 파비콘을 별도 DB 에 보관한다. **시크릿 창 또는 새 프로필**로 본다. 배포 후에는 서빙되는 바이트의 sha256 을 `MANIFEST.sha256` 과 대조하고,
렌더된 HTML 의 `rel="icon"` 이 **페이지당 정확히 1개**인지 센다.
