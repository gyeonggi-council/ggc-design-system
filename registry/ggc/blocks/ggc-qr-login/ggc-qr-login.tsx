import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/* QR 로그인 — ggc-components.css §11 .ggc-qr / .ggc-login. 9개 시스템이 같은 입구를 노출한다.
 * 상태 6종은 플랫폼 정본: idle · loading · showing · expired · unregistered · error.
 * 무대(232px)는 높이 고정 — 상태가 바뀌어도 화면이 튀지 않는다. QR 은 200px · 오류정정 M 고정. */
type QrState = "idle" | "loading" | "showing" | "expired" | "unregistered" | "error"

/* 덮개는 하나 — 배지와 문구만 상태가 바꾼다(정본 §11). 덮개는 상태를, callout 은 이유를 말한다. */
const VEIL: Record<"expired" | "unregistered" | "error", { variant: "pending" | "rejected"; label: string; text: string }> = {
  expired: { variant: "pending", label: "만료", text: "유효시간이 지났습니다" },
  unregistered: { variant: "rejected", label: "미등록", text: "계정이 없습니다" },
  error: { variant: "rejected", label: "오류", text: "잠시 후 다시 시도해 주세요" },
}

/* 3단계 안내 — 화면 안 매뉴얼(별도 도움말 페이지로 빼지 않는다). */
const DEFAULT_STEPS: React.ReactNode[] = [
  <>휴대폰에서 <strong>경기도의정포털</strong> 앱을 실행합니다</>,
  <>앱 메뉴에서 <strong>QR 로그인</strong>을 선택합니다</>,
  <>위 코드를 화면에 맞춰 스캔합니다</>,
]

function QrLogin({
  className,
  state = "showing",
  eyebrow = "경기도의회사무처",
  title = "경기도의정포털 앱으로 로그인",
  lead,
  qr,
  veilText,
  meta,
  expiresIn,
  steps = DEFAULT_STEPS,
  callout,
  calloutTone,
  userCode,
  alt,
  actions,
  onRefresh,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  state?: QrState
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  lead?: React.ReactNode
  /** QR 이미지 슬롯 — svg/img/canvas 200×200 */
  qr?: React.ReactNode
  /** 덮개 문구 교체 (기본 문구는 상태가 정한다) */
  veilText?: React.ReactNode
  /** 남은 시간 줄 전체 교체 — 없으면 expiresIn 으로 기본 줄을 그린다 */
  meta?: React.ReactNode
  expiresIn?: React.ReactNode
  /** 번호는 자동 — null 이면 숨김 */
  steps?: React.ReactNode[] | null
  callout?: React.ReactNode
  calloutTone?: "danger" | "warning"
  userCode?: React.ReactNode
  /** 보조 링크 줄 라벨("앱을 쓸 수 없는 경우") — 좌우 괘선이 붙는다 */
  alt?: React.ReactNode
  actions?: React.ReactNode
  /** 주면 "새 코드 받기" secondary 버튼이 actions 앞에 붙는다 */
  onRefresh?: React.MouseEventHandler<HTMLButtonElement>
}) {
  const veil = state === "expired" || state === "unregistered" || state === "error" ? VEIL[state] : null
  const showFrame = state !== "idle" && state !== "loading"
  /* 미등록·오류에서는 "스캔하세요" 가 틀린 안내라 접는다(정본 §11 :has 규칙) */
  const showSteps = steps !== null && state !== "unregistered" && state !== "error"

  return (
    <div data-slot="qr-login" className={cn("mx-auto flex max-w-[380px] flex-col items-stretch gap-4 font-sans text-foreground max-[420px]:gap-3", className)} {...props}>
      <div data-slot="qr-login-head" className="text-center">
        {eyebrow && <p className="m-0 mb-1 text-xs font-bold tracking-[0.02em] text-primary">{eyebrow}</p>}
        <h2 className="m-0 text-[19px] leading-[1.35] font-bold tracking-[-0.2px] text-(--ggc-text-strong)">{title}</h2>
        {lead && <p className="m-0 mt-2 text-[13.5px] leading-[1.6] break-keep text-(--ggc-text-muted)">{lead}</p>}
      </div>

      <div
        data-slot="qr-login-stage"
        data-state={state}
        role="status"
        aria-live="polite"
        className="relative flex size-[232px] shrink-0 items-center justify-center self-center rounded-(--ggc-radius-lg) border border-(--ggc-border-strong) bg-card max-[420px]:w-full max-[420px]:max-w-[232px] forced-colors:border"
      >
        {state === "idle" && <span aria-hidden="true" className="absolute inset-4 rounded-(--ggc-radius) border-[1.5px] border-dashed border-(--ggc-border-strong)" />}
        {state === "loading" && <Spinner className="size-6 text-primary" />}
        {showFrame && (
          <div
            data-slot="qr-login-frame"
            className={cn(
              "flex size-[200px] items-center justify-center bg-card transition-[filter,opacity] duration-150 motion-reduce:transition-none [&_canvas]:block [&_canvas]:size-[200px] [&_img]:block [&_img]:size-[200px] [&_svg]:block [&_svg]:size-[200px]",
              veil && "opacity-25 grayscale forced-colors:opacity-100 forced-colors:grayscale-0"
            )}
          >
            {qr}
          </div>
        )}
        {veil && (
          <div data-slot="qr-login-veil" className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-card/88 p-4 text-center forced-colors:border forced-colors:bg-[Canvas]">
            <Badge variant={veil.variant}>{veil.label}</Badge>
            <p className="m-0 text-[13px] leading-[1.5] font-semibold break-keep text-(--ggc-text-muted)">{veilText ?? veil.text}</p>
          </div>
        )}
      </div>

      {(meta || expiresIn) && (
        <p data-slot="qr-login-meta" className="m-0 text-center text-[12.5px] text-(--ggc-text-subtle)">
          {meta ?? (
            <>
              남은 시간 <span data-slot="qr-login-timer" className="font-mono font-bold text-(--ggc-text-muted) tabular-nums">{expiresIn}</span> · 이 코드는 1회용입니다
            </>
          )}
        </p>
      )}

      {showSteps && (
        <ol data-slot="qr-login-steps" role="list" className="m-0 flex list-none flex-col gap-3 rounded-(--ggc-radius) border border-border bg-(--ggc-surface-inset) p-4 max-[420px]:p-3 forced-colors:border">
          {steps.map((step, i) => (
            <li key={i} className="relative min-h-5 pl-8 text-[13px] leading-[1.5] break-keep text-(--ggc-text-muted) [&_strong]:font-bold [&_strong]:text-foreground">
              <span aria-hidden="true" className="absolute top-px left-0 inline-flex size-5 items-center justify-center rounded-full bg-(--ggc-primary-light-strong) text-[11px] leading-none font-bold text-(--ggc-primary-deep) forced-colors:border">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}

      {callout && (
        <p
          data-slot="qr-login-callout"
          className={cn(
            "m-0 rounded-(--ggc-radius) border px-4 py-3 text-[13px] leading-[1.6] break-keep forced-colors:border",
            calloutTone === "danger" && "border-(--ggc-danger) bg-(--ggc-danger-tint) text-(--ggc-danger)",
            calloutTone === "warning" && "border-(--ggc-warning) bg-(--ggc-warning-tint) text-(--ggc-warning)",
            !calloutTone && "border-border bg-(--ggc-surface-inset) text-(--ggc-text-muted)"
          )}
        >
          {callout}
        </p>
      )}

      {userCode && (
        <p data-slot="qr-login-usercode" className="m-0 rounded-(--ggc-radius) border border-(--ggc-primary-light-strong) bg-(--ggc-primary-light) p-3 text-center font-mono text-base font-bold tracking-[0.06em] break-all text-(--ggc-primary-deep) select-all forced-colors:border">
          {userCode}
        </p>
      )}

      {alt && (
        <p data-slot="qr-login-alt" className="m-0 flex items-center gap-3 text-[12.5px] text-(--ggc-text-subtle) before:h-px before:flex-1 before:bg-border before:content-[''] after:h-px after:flex-1 after:bg-border after:content-['']">
          {alt}
        </p>
      )}

      {(onRefresh || actions) && (
        <div data-slot="qr-login-actions" className="flex flex-col gap-2">
          {onRefresh && (
            <Button type="button" variant="secondary" onClick={onRefresh}>
              새 코드 받기
            </Button>
          )}
          {actions}
        </div>
      )}
    </div>
  )
}

/* 로그인 화면 셸 — .ggc-login. GNB/LNB 없이 유틸리티 바 + 이것 + 푸터. 카드 폭 440 캡을 여기서 한 번만 정한다. */
function Login({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="login" className={cn("flex items-start justify-center px-4 pt-8 pb-16 *:w-full *:max-w-[440px]", className)} {...props} />
}

export { QrLogin, Login, type QrState }
