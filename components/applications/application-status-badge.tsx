import {
  applicationStatusMeta,
  type ApplicationStatus,
} from "@/lib/applications"
import { cn } from "@/lib/utils"

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus
  className?: string
}

/** Small, colour-coded status pill shared by seeker and recruiter views. */
function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps) {
  const meta = applicationStatusMeta[status]

  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full border px-2 text-[12px] leading-4 font-medium whitespace-nowrap",
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  )
}

export { ApplicationStatusBadge }
