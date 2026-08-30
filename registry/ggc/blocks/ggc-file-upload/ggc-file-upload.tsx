"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* 파일 업로드 — ggc-components.css §28. 동작은 ggc-behaviors.js ⑦ 과 동일.
 * 선택 버튼 + 끌어놓기 영역 + 선택한 파일 목록(이름 · 크기 · 삭제).
 * input 은 sr-only 로 숨긴다 — Tab 으로 도달하고 Enter/Space 로 열린다(.drop 의 focus-within 이 링).
 * 허용 형식·크기·개수는 rule 로 미리 적는다(aria-describedby) — 올린 뒤에 거절하지 않는다.
 * 삭제 버튼 이름에 파일명을 넣는다. 서버에 이미 올린 파일은 existing 으로 같은 목록에 그린다. */

function formatSize(n: number): string {
  if (n < 1024) return `${n}B`
  if (n < 1048576) return `${Math.round(n / 1024)}KB`
  return `${(n / 1048576).toFixed(1)}MB`
}

interface ExistingFile {
  name: string
  size: number | string
  error?: string
  onRemove?: () => void
}

interface FileUploadProps extends React.ComponentProps<"div"> {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  rule?: React.ReactNode
  label?: React.ReactNode
  value?: File[]
  onFilesChange?: (files: File[]) => void
  existing?: ExistingFile[]
}

const ITEM_CLASS =
  "flex flex-wrap items-center gap-3 rounded-(--ggc-radius-sm) border border-border bg-card px-3 py-2 text-(length:--ggc-control-font-sm)"
const REMOVE_CLASS =
  "-my-1 -mr-1.5 size-7 shrink-0 rounded-(--ggc-radius-sm) text-[13px] text-(--ggc-text-muted) hover:bg-(--ggc-danger-tint) hover:text-(--ggc-danger)"

function FileUpload({
  className,
  accept,
  multiple = false,
  maxFiles,
  rule,
  label = "파일 선택",
  value,
  onFilesChange,
  existing,
  id,
  ...props
}: FileUploadProps) {
  const reactId = React.useId()
  const inputId = id ?? `ggc-file-${reactId}`
  const ruleId = `${inputId}-rule`
  const inputRef = React.useRef<HTMLInputElement>(null)
  const controlled = value !== undefined
  const [internal, setInternal] = React.useState<File[]>([])
  const files = controlled ? (value as File[]) : internal
  const [over, setOver] = React.useState(false)

  /* 삭제를 input.files 에 되돌린다 — 폼 전송이 목록과 같아야 한다(behaviors ⑦ 의 DataTransfer) */
  React.useEffect(() => {
    const input = inputRef.current
    if (!input || typeof DataTransfer !== "function") return
    try {
      const dt = new DataTransfer()
      files.forEach((f) => dt.items.add(f))
      input.files = dt.files
    } catch {
      /* 구형 — 목록만 유지 */
    }
  }, [files])

  const update = (next: File[]) => {
    if (!controlled) setInternal(next)
    onFilesChange?.(next)
  }

  const add = (incoming: FileList | File[] | null) => {
    if (!incoming) return
    const next = multiple ? [...files] : []
    for (const f of Array.from(incoming)) {
      if (!multiple && next.length) break
      if (maxFiles && next.length >= maxFiles) break /* 상한 — 넘는 것은 무시한다(문구로 미리 알린다) */
      next.push(f)
    }
    update(next)
  }

  const remove = (index: number) => {
    update(files.filter((_, i) => i !== index))
    inputRef.current?.focus()
  }

  return (
    <div data-slot="file-upload" className={cn(className)} {...props}>
      <div
        data-slot="file-drop"
        data-over={over || undefined}
        onClick={(e) => {
          /* 라벨 클릭은 브라우저가 input 을 연다 — 그 밖의 영역만 대신 연다 */
          if ((e.target as HTMLElement).closest("label, input")) return
          inputRef.current?.click()
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setOver(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          if (e.dataTransfer?.files?.length) add(e.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-1.5 rounded-(--ggc-radius) border-[1.5px] border-dashed border-(--ggc-border-strong) bg-(--ggc-surface-inset) px-4 py-5 text-center transition-[border-color,background-color]",
          "hover:border-primary hover:bg-(--ggc-primary-light) data-[over]:border-primary data-[over]:bg-(--ggc-primary-light)",
          "focus-within:border-primary focus-within:shadow-(--ggc-focus-ring)"
        )}
      >
        <label
          data-slot="file-cta"
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 text-(length:--ggc-control-font) text-(--ggc-text-muted)"
        >
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            aria-describedby={rule ? ruleId : undefined}
            onChange={(e) => add(e.target.files)}
            className="sr-only"
          />
          <span
            data-slot="file-button"
            className="inline-flex h-(--ggc-control-h-sm) shrink-0 items-center justify-center rounded-[8px] border border-(--ggc-border-strong) bg-card px-[14px] text-(length:--ggc-control-font-sm) font-bold whitespace-nowrap text-(--ggc-primary-deep)"
          >
            {label}
          </span>
          <span data-slot="file-or">또는 여기에 끌어놓기</span>
        </label>
        {rule && (
          <span data-slot="file-rule" id={ruleId} className="text-[12.5px] text-(--ggc-text-subtle)">{rule}</span>
        )}
      </div>
      {(existing?.length || files.length) ? (
        <ul data-slot="file-list" aria-label="선택한 파일" className="m-0 mt-2 list-none space-y-1.5 p-0">
          {existing?.map((f, i) => (
            <li
              key={`existing-${i}`}
              data-slot="file-item"
              className={cn(ITEM_CLASS, f.error && "border-(--ggc-danger)")}
            >
              <span data-slot="file-name" className="min-w-0 flex-1 text-foreground [overflow-wrap:anywhere]">{f.name}</span>
              <span data-slot="file-size" className="text-(--ggc-text-subtle) tabular-nums whitespace-nowrap">
                {typeof f.size === "number" ? formatSize(f.size) : f.size}
              </span>
              {f.onRemove && (
                <button type="button" data-slot="file-remove" aria-label={`${f.name} 삭제`} onClick={f.onRemove} className={REMOVE_CLASS}>
                  ✕
                </button>
              )}
              {f.error && (
                <span data-slot="file-error" className="w-full text-xs text-(--ggc-danger)">{f.error}</span>
              )}
            </li>
          ))}
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} data-slot="file-item" className={ITEM_CLASS}>
              <span data-slot="file-name" className="min-w-0 flex-1 text-foreground [overflow-wrap:anywhere]">{f.name}</span>
              <span data-slot="file-size" className="text-(--ggc-text-subtle) tabular-nums whitespace-nowrap">{formatSize(f.size)}</span>
              <button type="button" data-slot="file-remove" aria-label={`${f.name} 삭제`} onClick={() => remove(i)} className={REMOVE_CLASS}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export { FileUpload, formatSize }
export type { FileUploadProps, ExistingFile }
