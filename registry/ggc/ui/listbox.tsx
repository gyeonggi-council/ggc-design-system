"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* 커스텀 리스트박스 — ggc-components.css §32. 동작은 ggc-behaviors.js ⑨ 와 동일.
 * 네이티브 <select> 로 안 되는 것(부제 · 검색 필터 · 항상 펼침 · 다중 선택)에만 쓴다.
 * 목록이 포커스 하나(tabIndex=0)를 갖고 aria-activedescendant 로 현재 항목을 가리킨다.
 * ↑↓ Home End 이동(단일 선택은 선택이 따라온다) · Enter/Space 선택(다중은 토글) · 앞글자 찾기(600ms).
 * 선택 = 배경 + 왼쪽 띠 + ✓ 셋으로 표시(색 단독 금지) · 비활성 항목의 이유는 sub 에 적는다.
 * 라벨은 aria-labelledby(권장) 또는 aria-label 로 붙인다. */

interface ListboxOption {
  value: string
  label: React.ReactNode
  sub?: React.ReactNode
  disabled?: boolean
}

interface ListboxBaseProps {
  options: ListboxOption[]
  filterable?: boolean
  filterPlaceholder?: string
  emptyText?: string
  className?: string
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

type ListboxProps =
  | (ListboxBaseProps & { multiple?: false; value?: string; onValueChange?: (value: string) => void })
  | (ListboxBaseProps & { multiple: true; value?: string[]; onValueChange?: (values: string[]) => void })

/* 필터·앞글자 찾기의 대상 텍스트 — behaviors ⑨ 의 textContent(라벨 + 부제)와 같게 */
function textOf(option: ListboxOption): string {
  const label = typeof option.label === "string" ? option.label : ""
  const sub = typeof option.sub === "string" ? option.sub : ""
  return `${label} ${sub}`.trim() || option.value
}

function Listbox(props: ListboxProps) {
  const {
    options,
    multiple = false,
    filterable = false,
    filterPlaceholder = "검색",
    emptyText = "일치하는 항목이 없다",
    className,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
  } = props

  const reactId = React.useId()
  const listId = id ?? `ggc-listbox-${reactId}`
  const listRef = React.useRef<HTMLUListElement>(null)

  const controlled = props.value !== undefined
  const [internal, setInternal] = React.useState<string[]>(() =>
    props.value === undefined ? [] : Array.isArray(props.value) ? props.value : [props.value]
  )
  const selected = controlled
    ? Array.isArray(props.value) ? props.value : props.value != null ? [props.value] : []
    : internal

  const [activeValue, setActiveValue] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")
  const typedRef = React.useRef({ text: "", at: 0 })

  const q = query.trim().toLowerCase()
  const visible = options.filter((o) => !q || textOf(o).toLowerCase().includes(q))
  const enabled = visible.filter((o) => !o.disabled)
  const optId = (o: ListboxOption) => `${listId}-o${options.indexOf(o)}`
  const activeOpt = visible.find((o) => o.value === activeValue)

  const activate = (o: ListboxOption | null, scroll = true) => {
    setActiveValue(o ? o.value : null)
    if (o && scroll) document.getElementById(optId(o))?.scrollIntoView({ block: "nearest" })
  }

  const select = (o: ListboxOption | null | undefined) => {
    if (!o || o.disabled) return
    const next = multiple
      ? selected.includes(o.value)
        ? selected.filter((v) => v !== o.value)
        : [...selected, o.value]
      : [o.value]
    if (!controlled) setInternal(next)
    activate(o)
    if (multiple) (props.onValueChange as ((v: string[]) => void) | undefined)?.(next)
    else (props.onValueChange as ((v: string) => void) | undefined)?.(o.value)
  }

  const handleFocus = () => {
    if (activeValue && visible.some((o) => o.value === activeValue)) return
    const first = visible.find((o) => selected.includes(o.value)) ?? enabled[0]
    if (first) activate(first, false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const opts = enabled
    if (!opts.length) return
    const cur = opts.find((o) => o.value === activeValue) ?? null
    const i = cur ? opts.indexOf(cur) : -1
    let j: number | null = null
    if (e.key === "ArrowDown") j = Math.min(i + 1, opts.length - 1)
    else if (e.key === "ArrowUp") j = Math.max(i - 1, 0)
    else if (e.key === "Home") j = 0
    else if (e.key === "End") j = opts.length - 1
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      select(cur)
      return
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      /* 앞글자 찾기 — 600ms 안에 이어 치면 여러 글자 */
      const now = Date.now()
      typedRef.current = {
        text: (now - typedRef.current.at < 600 ? typedRef.current.text : "") + e.key.toLowerCase(),
        at: now,
      }
      const hit = opts.find((o) => textOf(o).toLowerCase().startsWith(typedRef.current.text))
      if (hit) {
        e.preventDefault()
        activate(hit)
        if (!multiple) select(hit)
      }
      return
    }
    if (j === null) return
    e.preventDefault()
    activate(opts[j])
    if (!multiple) select(opts[j]) /* 단일 선택은 선택이 포커스를 따라간다 — 네이티브 select 와 같다 */
  }

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    const nq = e.target.value.trim().toLowerCase()
    if (activeValue) {
      const cur = options.find((o) => o.value === activeValue)
      if (cur && nq && !textOf(cur).toLowerCase().includes(nq)) setActiveValue(null)
    }
  }

  return (
    <div data-slot="listbox" className={cn("w-full", className)}>
      {filterable && (
        <input
          data-slot="listbox-filter"
          type="search"
          value={query}
          onChange={handleFilter}
          onKeyDown={(e) => {
            /* 필터에서 ↓ 를 누르면 목록으로 간다 */
            if (e.key === "ArrowDown") {
              e.preventDefault()
              listRef.current?.focus()
            }
          }}
          placeholder={filterPlaceholder}
          aria-label={filterPlaceholder}
          aria-controls={listId}
          autoComplete="off"
          className="mb-1.5 h-(--ggc-control-h-sm) w-full rounded-(--ggc-radius-sm) border border-(--ggc-border-strong) bg-(--ggc-control-bg) px-2.5 text-(length:--ggc-control-font-sm) text-foreground outline-none placeholder:text-(--ggc-text-subtle) focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring)"
        />
      )}
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-multiselectable={multiple || undefined}
        aria-activedescendant={activeOpt ? optId(activeOpt) : undefined}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        data-slot="listbox-list"
        className="m-0 max-h-[264px] list-none overflow-y-auto rounded-(--ggc-radius) border border-(--ggc-border-strong) bg-card p-1 outline-none focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring)"
      >
        {visible.map((o) => {
          const isSelected = selected.includes(o.value)
          const isActive = o.value === activeValue
          return (
            <li
              key={o.value}
              id={optId(o)}
              role="option"
              aria-selected={isSelected}
              aria-disabled={o.disabled || undefined}
              data-slot="listbox-option"
              onClick={() => {
                select(o)
                listRef.current?.focus()
              }}
              className={cn(
                "flex min-h-(--ggc-control-h-sm) items-center gap-2 rounded-(--ggc-radius-sm) border-l-[3px] border-l-transparent py-1.5 pr-2.5 pl-3 text-(length:--ggc-control-font-sm) text-foreground",
                !o.disabled && "cursor-pointer hover:bg-(--ggc-row-hover)",
                isSelected &&
                  "border-l-primary bg-(--ggc-primary-light) font-bold text-(--ggc-primary-deep) forced-colors:outline-2 forced-colors:-outline-offset-2 forced-colors:outline-[Highlight]",
                isActive && "outline-2 -outline-offset-2 outline-primary forced-colors:outline-[CanvasText]",
                o.disabled && "text-(--ggc-text-subtle)"
              )}
            >
              <span data-slot="listbox-option-text" className="min-w-0 flex-1">{o.label}</span>
              {o.sub != null && (
                <span data-slot="listbox-option-sub" className="text-xs text-(--ggc-text-subtle)">{o.sub}</span>
              )}
              {isSelected && <CheckIcon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={3} />}
            </li>
          )
        })}
      </ul>
      {filterable && visible.length === 0 && (
        <p data-slot="listbox-empty" className="m-0 mt-1.5 p-3 text-center text-[12.5px] text-(--ggc-text-subtle)">{emptyText}</p>
      )}
    </div>
  )
}

export { Listbox }
export type { ListboxOption, ListboxProps }
