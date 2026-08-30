"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 드롭다운 메뉴 — ggc-components.css §29. "더보기" 같은 **동작 묶음**에만 — 페이지 이동 묶음이면 링크 목록이다.
 * 파괴적 항목은 variant="danger" + 말줄임(…) — 메뉴에서 바로 삭제하지 않고 확인 모달로 간다.
 * Radix 가 메뉴 역할 · 화살표 이동 · ESC · 바깥 클릭 닫기를 준다. */
function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({ className, sideOffset = 4, align = "start", ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-[60] min-w-[180px] rounded-(--ggc-radius) border border-input bg-popover p-1.5 text-foreground shadow-[0_8px_24px_rgba(20,30,50,0.12)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none forced-colors:border-[CanvasText] forced-colors:shadow-none",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { variant?: "default" | "danger" }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        "flex min-h-(--ggc-control-h-sm) w-full cursor-pointer items-center gap-2 rounded-(--ggc-radius-sm) px-2.5 py-1.5 text-(length:--ggc-control-font-sm) font-semibold whitespace-nowrap text-foreground outline-none select-none data-[highlighted]:bg-(--ggc-primary-light) data-[highlighted]:text-(--ggc-primary-deep) data-[disabled]:pointer-events-none data-[disabled]:text-(--ggc-text-subtle) data-[variant=danger]:text-destructive data-[variant=danger]:data-[highlighted]:bg-(--ggc-danger-tint) data-[variant=danger]:data-[highlighted]:text-destructive forced-colors:data-[highlighted]:outline forced-colors:data-[highlighted]:outline-2 forced-colors:data-[highlighted]:-outline-offset-2 forced-colors:data-[highlighted]:outline-[Highlight]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("px-2.5 pt-1.5 pb-1 text-[11.5px] font-bold text-(--ggc-text-subtle)", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("mx-1 my-1.5 h-px bg-border", className)} {...props} />
}

/* 단축키 표기 슬롯 — §29 의 .kbd 상당. 항목 오른쪽 끝에 옅게. */
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn("ml-auto pl-4 font-mono text-[11px] font-normal text-(--ggc-text-subtle)", className)} {...props} />
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut }
