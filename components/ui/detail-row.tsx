import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type DetailRowProps = {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}

/**
 * Icon + label + value row used by the dashboard details sheets.
 *
 * Kept as a UI primitive so every review panel reads the same way.
 */
function DetailRow({ icon: Icon, label, value, className }: DetailRowProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-[6px] border border-white/[0.07] bg-[#222228]">
        <Icon aria-hidden="true" className="size-4 text-[#a0a0ab]" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] leading-4 font-medium tracking-[0.14em] text-[#6e6e78] uppercase">
          {label}
        </p>
        <p className="mt-0.5 truncate text-[13px] leading-5 text-[#ededef]">
          {value || "—"}
        </p>
      </div>
    </div>
  )
}

export { DetailRow }
