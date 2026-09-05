# 0009 — 업무 프로필은 shadcn 기본 밀도, KRDS 는 접근성 바닥만 (2026-09-05)

## 상황
v2.0 의 업무(기본) 프로필 치수는 Claude Design 목업의 실측값이었다 — 버튼 42 · 입력 44 · 글자 13.5px · 셀 패딩 11×10 · 카드 패딩 18×22.
shadcn/ui 기본(버튼·입력 36 · 글자 14 · 셀 8)보다 **성겨서** 업무 화면인데 첫 화면에 행이 3개 들어오고, shadcn 블록(sidebar · data-table ·
dashboard-01)과 조립할 때마다 치수 보정이 필요했다. 제목 토큰이 없어 h1 18 · 카드 제목 16 · 본문 13.5 로 위계 비율이 1.3 에 그쳤고,
아이콘은 lucide 를 선언만 하고 실제로는 📋 ◷ ✕ 이모지·유니코드를 썼다. 사용자 지적: **"내부 업무지원용으로는 아쉽다. 디자인이 한눈에 안 들어온다."**
같은 자리에서 "업무용 시스템에서는 KRDS 를 빼야 하지 않나" 도 물었다. 실측 진단은 [`docs/audit/2026-09-05-shadcn-krds-audit.md`](../audit/2026-09-05-shadcn-krds-audit.md).

## 결정
1. **업무 프로필 치수 = shadcn 기본 밀도.** `--ggc-control-h-sm/-h/-h-lg` 32/36/40 · `--ggc-input-h` `--ggc-search-h` 36 · `--ggc-control-font`
   `--ggc-label-font` `--ggc-table-font` 14 · `--ggc-cell-pad` 8px 12px · `--ggc-row-pad` 12px 16px · `--ggc-card-pad` 16px 20px. **색은 불변.**
2. **타이포 스케일 토큰 신설** — `--ggc-text-xs~3xl`(12/13/14/16/18/20/24/30) · `--ggc-leading-*` · `--ggc-h1/h2/h3-size` · `--ggc-kpi-size`.
   위계는 색이 아니라 **크기·굵기·간격**으로 만든다. 값은 Tailwind 기본 스텝에서 가져왔다 — 사이 값을 발명하지 않는다.
3. **아이콘은 lucide 전용.** 정본 스프라이트 `design/ggc-icons.svg`(Tier 1) · `lucide-react`(Tier 2). 이모지·유니코드 기호를 UI 아이콘으로 쓰지 않는다.
   `--ggc-icon` 16 · `--ggc-icon-lg` 20. 상태 배지의 텍스트 병기 규칙은 그대로다(색 단독 금지) — 기호만 아이콘으로 바뀐다.
4. **업무 프로필에서 KRDS 는 접근성 바닥만 남긴다.** KRDS 치수(48/17) · 셸(마스트헤드 · 아이덴티파이어 · 공개 헤더/푸터) · 컴포넌트 마크업
   참조는 업무 프로필에서 **제외**한다. 남기는 것은 KWCAG 2.2 AA 4.5:1 · `:focus-visible` 링 · `forced-colors` 보강 · ARIA 상태 — 「장애인차별금지법」은
   공공기관 내부 시스템에도 적용되므로 이것은 KRDS 를 따르는 것이 아니라 법을 따르는 것이다.
5. **대민 프로필은 무변경.** `[data-ggc-profile="public"]` 블록은 KRDS 치수 그대로이고, 타이포 스케일도 KRDS 스텝(body 17 · title 20/24/32)으로 덮어쓴다.
   프로필이 덮어쓸 수 있는 토큰 목록(검사기 `PROFILE_VARS`)에 타이포 스케일·아이콘 치수를 추가했다 — 치수이기 때문이다.

## 근거
- shadcn 기본 밀도는 업무 도구(Linear · Vercel · GitHub) 가 수렴한 값이고, 이 저장소의 Tier 2 가 shadcn 레지스트리인 이상 그 밀도와 어긋나면 블록을 가져올 때마다 보정이 생긴다.
- `domain-language.md` 가 이미 "한 화면에 15~20행" 을 요구한다. v2.0 치수로는 1440×900 에서 불가능했다.
- KRDS 는 **대민 서비스**의 표준이다. 48px 터치 타깃과 17px 본문은 도민을 위한 값이지 하루 8시간 표를 대조하는 담당자를 위한 값이 아니다.
  `docs/krds-alignment.md §9` 에 업무 프로필의 KRDS 적용 범위를 표로 못박았다.
- 색은 바꾸지 않는다(ADR 0001 · 계약 §9). "탁하다" 는 인상은 팔레트가 아니라 위계 부재에서 왔다 — 진단 문서 §3.

## 결과
- `design/ggc-tokens.css` v3.0 ⚠ D1 · `design/check_design.py` `PROFILE_VARS` 확장 · `design/ggc-icons.svg` 신설(정본 6번째 파일)
- `docs/contract.md` §2 · §3 · §9 개정 · `docs/krds-alignment.md §9` · `docs/guides/typography.md` · `docs/guides/icons.md`
- Tier 1 `ggc-components.css` v3.0(치수는 토큰이라 자동 반영, 제목 유틸 `.ggc-h1/h2/h3` 신설) · Tier 2 레지스트리 v3(ADR 0011)
- v2 소비자: `docs/migration/v2-to-v3.md` — 사본 재복사 후 컨트롤이 6px 작아지고 글자가 0.5px 커진다. 리플로우가 있다.
