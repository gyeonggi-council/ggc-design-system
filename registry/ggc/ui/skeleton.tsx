import { cn } from "@/lib/utils"

/* 스켈레톤 — ggc-components.css §22. 실제 행 높이를 지킨다. 컨테이너에 aria-busy. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("h-3 animate-pulse rounded-(--ggc-radius-sm) bg-(--ggc-hairline) motion-reduce:animate-none forced-colors:border", className)} {...props} />
}

export { Skeleton }
