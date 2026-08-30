import * as React from "react"

import { cn } from "@/lib/utils"

/* 문서 본문 조판 — ggc-components.css §23. 조례 조문 · 검토보고서 · 안내문 같은 긴 글에만 쓴다 —
 * 표·카드·목록 UI 에는 쓰지 않는다. 법령 인용은 「낫표」, 조문 번호는 § 기호(domain-language.md).
 * ≥1680px 의 측정 폭 920px 캡은 레이아웃(§10 확폭, 계약 §2-1)이 정한다 — 여기서 max-width 를 잡지 않는다.
 * 조문 한 개: <div className="article"><span className="no">제3조(정의)</span>… <span className="para">① …</span></div> */
function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prose"
      className={cn(
        "text-sm leading-[1.8] break-keep text-(--ggc-text-body) [overflow-wrap:anywhere]",
        "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
        "[&_p]:mt-0 [&_p]:mb-4",
        "[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-[17px] [&_h2]:leading-[1.35] [&_h2]:font-extrabold [&_h2]:tracking-[-0.02em] [&_h2]:text-(--ggc-text-strong)",
        "[&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-[15px] [&_h3]:leading-[1.35] [&_h3]:font-bold [&_h3]:tracking-[-0.02em] [&_h3]:text-(--ggc-text-strong)",
        "[&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:text-sm [&_h4]:leading-[1.35] [&_h4]:font-bold [&_h4]:tracking-[-0.02em] [&_h4]:text-(--ggc-text-strong)",
        "[&_ul]:mt-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-[22px] [&_ol]:mt-0 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-[22px] [&_li+li]:mt-1",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:text-(--ggc-text-strong)",
        "[&_blockquote]:mt-0 [&_blockquote]:mb-4 [&_blockquote]:rounded-r-(--ggc-radius-sm) [&_blockquote]:border-l-[3px] [&_blockquote]:border-l-(--ggc-primary-light-strong) [&_blockquote]:bg-(--ggc-surface-inset) [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-(--ggc-text-muted) [&_blockquote_p:last-child]:mb-0",
        "[&_code]:rounded-[4px] [&_code]:bg-(--ggc-control-bg) [&_code]:px-[5px] [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-foreground",
        "[&_hr]:my-6 [&_hr]:border-t [&_hr]:border-border",
        "[&_.article]:mt-0 [&_.article]:mb-4 [&_.article_.no]:mr-1.5 [&_.article_.no]:font-extrabold [&_.article_.no]:text-(--ggc-text-strong) [&_.article_.para]:block [&_.article_.para]:pl-[18px]",
        className
      )}
      {...props}
    />
  )
}

export { Prose }
