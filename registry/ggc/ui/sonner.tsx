/* 토스트 — Sonner. 다크 없음(theme=light 고정). 3개 상한 · 짧은 확인(저장됨 · 복사됨)용. (shadcn 공식 소스 + 토큰 · ADR 0011) */
import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"             /* 다크 없음(계약 §3) — OS 다크에 따라가지 않는다 */
      position="bottom-right"
      visibleToasts={3}         /* ggc-behaviors.js GGC.toast 와 같은 상한 */
      duration={5000}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--ggc-success-tint)",
          "--success-text": "var(--ggc-success)",
          "--success-border": "var(--ggc-success)",
          "--warning-bg": "var(--ggc-warning-tint)",
          "--warning-text": "var(--ggc-warning)",
          "--warning-border": "var(--ggc-warning)",
          "--error-bg": "var(--ggc-danger-tint)",
          "--error-text": "var(--ggc-danger)",
          "--error-border": "var(--ggc-danger)",
          "--info-bg": "var(--ggc-info-tint)",
          "--info-text": "var(--ggc-info)",
          "--info-border": "var(--ggc-info)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
