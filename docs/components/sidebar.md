# 사이드바 — `@ggc/sidebar` · `@ggc/ggc-shell` (Tier 2, v3.0)

shadcn 공식 `sidebar` 를 그대로 쓴다. 폭 `--ggc-lnb-w`(256) · 접힘 `--ggc-lnb-w-icon`(48) · ≤768 은 Sheet(drawer) · 단축키 ⌘/Ctrl+B.
색은 테마가 `--sidebar-*` 를 토큰으로 매핑한다(흰 면 · 활성 `--ggc-primary-light` · 경계 `--ggc-shell-border`).
Tier 1 의 대응은 `.ggc-lnb` + `.ggc-lnb--icon`([shell.md](shell.md)).

## 쓰기 — 셸 블록으로

```tsx
import { LayoutDashboardIcon, Table2Icon, FileTextIcon, SettingsIcon } from "lucide-react"
import { Shell, ShellFrame, AppSidebar, ShellInset, ShellHeader, ShellMain, SkipLink } from "@/components/ggc-shell"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SearchBox } from "@/components/ggc-search"
import { PageHead } from "@/components/ggc-page-head"

<Shell>
  <SkipLink />
  <ShellFrame>
    <AppSidebar
      brand={{ mark: <img src="/assembly-mark.png" alt="" />, org: "경기도의회", service: "의안관리" }}
      systems={[{ name: "의안관리", active: true }, { name: "입법지원", href: "/leg" }, { name: "의사일정", disabled: true }]}
      groups={[
        { label: "의안", items: [
          { title: "대시보드", href: "/", icon: LayoutDashboardIcon, active: true },
          { title: "의안 목록", href: "/bills", icon: Table2Icon, badge: 21 },
          { title: "조례 초안", href: "/drafts", icon: FileTextIcon },
        ]},
        { label: "관리", items: [{ title: "설정", href: "/settings", icon: SettingsIcon }] },
      ]}
      user={{ name: "이○○", role: "정책지원관", dept: "기획재정위원회", onLogout: () => {} }}
    />
    <ShellInset>
      <ShellHeader
        breadcrumb={<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/">홈</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>의안 목록</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>}
        search={<SearchBox aria-label="의안 · 조례 검색" placeholder="의안 · 조례 검색" />}
        notifications={3}
      />
      <ShellMain wide>
        <PageHead title="의안 목록" desc="제12대 · 제380회 정례회 · 접수 147건" actions={…} />
        …
      </ShellMain>
    </ShellInset>
  </ShellFrame>
</Shell>
```

## 부분

| 무엇 | 규칙 |
|---|---|
| `AppSidebar.brand` | 마크 32 + 기관 + 서비스명. `systems` 가 있으면 드롭다운 스위처가 된다(유틸리티 바와 둘 다 두지 않는다) |
| `groups[].items[]` | `title` · `href` · `icon`(lucide 컴포넌트) · `active` · `badge`(건수). 접으면 아이콘 + 툴팁 |
| `user` | 실명 · 역할 · 부서 · 로그아웃 — UUID 금지 |
| `ShellHeader` | 64px — 토글 · 브레드크럼(≤900 숨김) · 검색 · 알림 · 자식 슬롯. **제목은 없다**(ADR 0010) |
| `ShellMain` | 1320 / `wide` 1360 · `aria-labelledby="page-title"` |

## 규칙

- 메뉴 항목에는 **반드시 아이콘**. 접었을 때 아이콘만 남는다. 이모지 금지.
- 1단 메뉴 6개 · 그룹 3개 이내. 넘으면 그룹을 나누지 말고 화면을 줄인다.
- 현재 항목은 `active` 하나. 경로가 깊으면 `SidebarMenuSub`(공식) 로 2단 — 3단은 만들지 않는다.
- 대민 화면에는 쓰지 않는다 — `@ggc/ggc-public-header` · `ggc-side-nav`.

## 근거

shadcn `sidebar` · dashboard-01 블록 · [ADR 0009](../decisions/0009-work-profile-shadcn-density.md) · [ADR 0011](../decisions/0011-tier2-primary-for-react.md).
