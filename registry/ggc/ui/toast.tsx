"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* 토스트 — ggc-components.css §25. 동작은 ggc-behaviors.js ⑤ 와 동일.
 * 짧은 확인(저장됨 · 복사됨 · 발송됨)에만 쓴다 — 읽고 판단해야 하는 내용은 Alert / Dialog 다.
 * <Toaster /> 를 문서에 하나 두고 toast({ title, … }) 를 부른다.
 * 기본 5초 · action 있으면 8초 · duration 0 은 수동 닫기 · 3개 상한(오래된 것부터) ·
 * 마우스/포커스가 있는 동안 시계 정지, 떠나면 2초 뒤(WCAG 2.2.1). Esc 로 닫지 않는다(모달과 구분). */

type ToastVariant = "success" | "warning" | "danger" | "info"

interface ToastOptions {
  title: React.ReactNode
  desc?: React.ReactNode
  variant?: ToastVariant
  icon?: React.ReactNode
  duration?: number
  action?: { label: React.ReactNode; onClick?: () => void }
}

interface ToastItem extends ToastOptions {
  id: number
  leaving?: boolean
}

const TOAST_MAX = 3
const TOAST_ICON: Record<ToastVariant, string> = { success: "✓", warning: "⚠", danger: "✕", info: "ⓘ" }
const EMPTY: ToastItem[] = []

/* 모듈 수준 store — Toaster 가 useSyncExternalStore 로 구독한다 */
let toasts: ToastItem[] = EMPTY
let nextId = 0
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
function getSnapshot() {
  return toasts
}
function getServerSnapshot() {
  return EMPTY
}

/* 닫기 — 160ms 퇴장 트랜지션 뒤 제거(behaviors ⑤ 와 같은 시간) */
function dismissToast(id: number) {
  const target = toasts.find((t) => t.id === id)
  if (!target || target.leaving) return
  toasts = toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t))
  emit()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    emit()
  }, 160)
}

function toast(opts: ToastOptions | string): number {
  const item: ToastItem = { ...(typeof opts === "string" ? { title: opts } : opts), id: ++nextId }
  /* 상한 3 — 가장 오래된 것부터 닫는다(닫히는 중인 것은 세지 않는다) */
  const live = toasts.filter((t) => !t.leaving)
  for (let i = 0; i <= live.length - TOAST_MAX; i++) dismissToast(live[i].id)
  toasts = [...toasts, item]
  emit()
  return item.id
}

const VARIANT_BAR: Record<ToastVariant, string> = {
  success: "border-l-(--ggc-success)",
  warning: "border-l-(--ggc-warning)",
  danger: "border-l-(--ggc-danger)",
  info: "border-l-(--ggc-info)",
}
const VARIANT_ICON: Record<ToastVariant, string> = {
  success: "bg-(--ggc-success-tint) text-(--ggc-success)",
  warning: "bg-(--ggc-warning-tint) text-(--ggc-warning)",
  danger: "bg-(--ggc-danger-tint) text-(--ggc-danger)",
  info: "bg-(--ggc-info-tint) text-(--ggc-info)",
}

function ToastView({ item }: { item: ToastItem }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [entered, setEntered] = React.useState(false)
  const duration = item.duration ?? (item.action ? 8000 : 5000)

  const stop = () => clearTimeout(timer.current)
  const arm = (ms: number) => {
    stop()
    timer.current = setTimeout(() => dismissToast(item.id), ms)
  }

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    if (duration > 0) arm(duration)
    return () => {
      cancelAnimationFrame(raf)
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      data-slot="toast"
      data-variant={item.variant}
      data-leaving={item.leaving ? "" : undefined}
      onMouseEnter={duration > 0 ? stop : undefined}
      onFocus={duration > 0 ? stop : undefined}
      onMouseLeave={
        duration > 0
          ? () => {
              /* 읽는 동안은 사라지지 않는다 — 떠나면 2초 뒤 */
              if (!ref.current?.contains(document.activeElement)) arm(2000)
            }
          : undefined
      }
      onBlur={
        duration > 0
          ? (e) => {
              if (!ref.current?.contains(e.relatedTarget as Node | null) && !ref.current?.matches(":hover")) arm(2000)
            }
          : undefined
      }
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-(--ggc-radius) border border-l-4 border-(--ggc-border-strong) border-l-(--ggc-text-muted) bg-card py-3 pr-3 pl-3.5 text-(length:--ggc-control-font) leading-[1.45] text-foreground shadow-lg forced-colors:shadow-none",
        "transition-[opacity,transform] duration-150 motion-reduce:transition-none",
        !entered || item.leaving ? "translate-y-1.5 opacity-0" : "translate-y-0 opacity-100",
        item.variant && VARIANT_BAR[item.variant]
      )}
    >
      <span
        data-slot="toast-icon"
        aria-hidden="true"
        className={cn(
          "mt-px inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-(--ggc-surface-inset) text-xs font-extrabold text-(--ggc-text-muted)",
          item.variant && VARIANT_ICON[item.variant]
        )}
      >
        {item.icon ?? (item.variant ? TOAST_ICON[item.variant] : "•")}
      </span>
      <div data-slot="toast-body" className="min-w-0 flex-1">
        <b data-slot="toast-title" className="block font-bold text-(--ggc-text-strong)">{item.title}</b>
        {item.desc != null && (
          <span data-slot="toast-desc" className="mt-0.5 block text-[12.5px] text-(--ggc-text-muted) [overflow-wrap:anywhere]">{item.desc}</span>
        )}
      </div>
      {item.action && (
        <button
          type="button"
          data-slot="toast-action"
          onClick={() => {
            item.action?.onClick?.()
            dismissToast(item.id)
          }}
          className="h-(--ggc-control-h-sm) shrink-0 self-center rounded-(--ggc-radius-sm) border border-(--ggc-border-strong) bg-card px-2.5 text-(length:--ggc-control-font-sm) font-bold whitespace-nowrap text-primary hover:bg-(--ggc-primary-light)"
        >
          {item.action.label}
        </button>
      )}
      <button
        type="button"
        data-slot="toast-close"
        aria-label="닫기"
        onClick={() => dismissToast(item.id)}
        className="-my-1 -mr-1 size-7 shrink-0 rounded-(--ggc-radius-sm) text-sm text-(--ggc-text-muted) hover:bg-(--ggc-control-bg) hover:text-foreground"
      >
        ✕
      </button>
    </div>
  )
}

/* 고정 영역 — 문서에 하나(오른쪽 아래). 토스트 자체로 포커스를 옮기지 않는다 */
function Toaster({ className, ...props }: React.ComponentProps<"div">) {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return (
    <div
      data-slot="toaster"
      role="status"
      aria-live="polite"
      aria-label="알림"
      className={cn(
        "pointer-events-none fixed right-6 bottom-6 z-[80] flex w-[min(400px,calc(100vw-var(--ggc-space-4)*2))] flex-col gap-2",
        "max-[480px]:right-3 max-[480px]:bottom-3 max-[480px]:left-3 max-[480px]:w-auto",
        className
      )}
      {...props}
    >
      {items.map((t) => (
        <ToastView key={t.id} item={t} />
      ))}
    </div>
  )
}

export { Toaster, toast, dismissToast }
export type { ToastOptions, ToastVariant }
