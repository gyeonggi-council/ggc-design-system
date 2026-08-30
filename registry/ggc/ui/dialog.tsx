"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 모달 — ggc-components.css §19 와 같은 모습. Radix Dialog 가 포커스 가두기 · ESC · inert 를 준다.
 * 파괴적 동작(반려·회수·삭제)은 <DialogContent alert> — 배경 클릭으로 닫히지 않고 role=alertdialog.
 * 크기 size="sm" 420 · 기본 560 · "lg" 800. ≤480 은 화면 가득. */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}
function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}
function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}
function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-[rgba(20,30,50,0.45)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

const SIZE = { sm: "sm:max-w-[420px]", default: "sm:max-w-[560px]", lg: "sm:max-w-[800px]" } as const

function DialogContent({
  className,
  children,
  size = "default",
  alert = false,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { size?: keyof typeof SIZE; alert?: boolean; showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        /* role 은 alert 일 때만 넘긴다 — undefined 를 spread 하면 Radix 의 role="dialog" 가 지워진다 */
        {...(alert ? { role: "alertdialog" as const, onPointerDownOutside: (e: Event) => e.preventDefault(), onInteractOutside: (e: Event) => e.preventDefault() } : {})}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[min(85vh,720px)] w-full max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-(--ggc-radius-lg) border border-border bg-card text-foreground shadow-[0_16px_48px_rgba(20,30,50,0.18)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none max-sm:max-h-dvh max-sm:max-w-none max-sm:rounded-none max-sm:border-0",
          SIZE[size],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && !alert && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-[14px] right-[14px] flex size-8 items-center justify-center rounded-(--ggc-radius-sm) text-(--ggc-text-muted) hover:bg-(--ggc-control-bg) hover:text-foreground focus-visible:shadow-(--ggc-focus-ring) focus-visible:outline-none"
          >
            <XIcon className="size-4" />
            <span className="sr-only">닫기</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1 border-b border-(--ggc-hairline) px-[22px] pt-[18px] pb-[14px] pr-12", className)} {...props} />
}
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("m-0 text-base font-extrabold tracking-[-0.02em] text-(--ggc-text-strong)", className)} {...props} />
}
function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("m-0 text-[12.5px] text-(--ggc-text-subtle)", className)} {...props} />
}
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("min-h-0 flex-1 overflow-y-auto px-[22px] py-5 text-[13.5px] leading-[1.7] text-(--ggc-text-body)", className)} {...props} />
}
function DialogFooter({ className, note, children, ...props }: React.ComponentProps<"div"> & { note?: React.ReactNode }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex items-center justify-end gap-2 rounded-b-(--ggc-radius-lg) border-t border-(--ggc-hairline) bg-(--ggc-surface-inset) px-[22px] pt-[14px] pb-[18px] max-sm:flex-col-reverse max-sm:items-stretch max-sm:rounded-none", className)}
      {...props}
    >
      {note && <span className="mr-auto text-[12.5px] text-(--ggc-text-subtle)">{note}</span>}
      {children}
    </div>
  )
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogBody, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger }
