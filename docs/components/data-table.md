# 데이터 표 — `@ggc/ggc-data-table` (Tier 2, v3.0)

Explore 화면의 본체. shadcn Data Table 패턴(TanStack Table v8) + 이 저장소 표 규칙(`@ggc/table`).
정렬 · 검색 · 열 표시 · 쪽 이동 · 행 선택을 갖고, 밀도는 `--ggc-cell-pad`(8×12) 라 1440×900 첫 화면에 15~20행이 들어온다.
Tier 1(정적 HTML · JSP)은 `.ggc-table` + `.ggc-pagination` 을 손으로 조립한다 — 실물은 `design/examples/explore.html`.

## 쓰기

```tsx
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable, DataTableColumnHeader } from "@/components/ggc-data-table"
import { ClockIcon } from "lucide-react"

type Bill = { no: string; title: string; committee: string; received: string; days: number; status: "접수" | "회부" | "심사" }

const columns: ColumnDef<Bill>[] = [
  { accessorKey: "no", header: ({ column }) => <DataTableColumnHeader column={column} title="의안번호" />, meta: { label: "의안번호" },
    cell: ({ row }) => <code className="font-mono">{row.original.no}</code> },
  { accessorKey: "title", header: "의안명", cell: ({ row }) => <a href={`/bills/${row.original.no}`}>{row.original.title}</a> },
  { accessorKey: "committee", header: "소관위원회" },
  { accessorKey: "received", header: ({ column }) => <DataTableColumnHeader column={column} title="접수일" /> },
  { accessorKey: "days", header: ({ column }) => <DataTableColumnHeader column={column} title="경과(일)" />, meta: { num: true } },
  { accessorKey: "status", header: "상태", cell: ({ row }) => <Badge variant="pending"><ClockIcon />{row.original.status}</Badge> },
]

<DataTable columns={columns} data={bills} searchKey="title" searchPlaceholder="의안명 검색" pageSize={20}
  emptyTitle="접수된 의안이 없습니다" emptyDesc="의안 등록으로 시작합니다." />
```

## 속성

| 속성 | 무엇 |
|---|---|
| `columns` · `data` | TanStack `ColumnDef[]` · 행 배열. `meta.num` 은 우정렬 + tabular-nums, `meta.label` 은 열 토글 메뉴의 이름 |
| `searchKey` | 검색 상자가 필터할 열(accessorKey). 없으면 검색 상자 없음 |
| `pageSize` | 기본 20. 쪽당 건수 셀렉트(20 · 50 · 100) |
| `toolbar` · `toolbarEnd` | 검색 옆(필터 셀렉트 · 칩) · 우측(내려받기 · 등록) 슬롯 |
| `emptyTitle` · `emptyDesc` / `emptyFilteredTitle` · `emptyFilteredDesc` | 빈 상태 — **데이터가 없는지 · 필터 때문인지 구분**한다(archetypes Explore) |
| `columnToggle` | 열 표시 메뉴(기본 켬) |
| `onRowClick` · `getRowId` | 행 클릭 · 행 id |

`DataTableColumnHeader` — 정렬 가능한 머리글(오름 · 내림 · 해제). `DataTablePagination` — 단독으로도 쓴다(서버 페이지네이션).

## 규칙

- **식별자(의안번호 · 접수번호)는 왼쪽 첫 열**, mono 로. 상태 열은 배지 + 텍스트(색 단독 금지). 날짜 `YYYY-MM-DD`, 숫자 `meta.num`.
- 기본 정렬은 최근 접수순, 기본 필터는 **내 소관 · 처리 대기**(`domain-language.md`) — 필터 UI 는 `@ggc/ggc-filter-bar`.
- 열이 셋 이하이고 건수가 적으면 `@ggc/ggc-list-row`. 그 이상은 표다.
- 서버 페이지네이션(수천 건)은 `manualPagination` — 이 블록은 클라이언트 기준이다. 필요하면 `DataTablePagination` 만 가져다 조립한다.
- 390px 에서 표는 컨테이너 안에서 가로 스크롤한다(`@ggc/table` 래퍼). 본문이 스크롤되게 두지 않는다.

## 의존

`@tanstack/react-table@^8`(v9 는 API 가 다르다 — 레지스트리가 버전을 박는다) · `@ggc/table` `button` `input` `native-select` `dropdown-menu`.

## 근거

shadcn Data Table 문서 · `skills/ggc-design/references/archetypes.md` Explore · `domain-language.md` §2·§3 · [ADR 0011](../decisions/0011-tier2-primary-for-react.md).
