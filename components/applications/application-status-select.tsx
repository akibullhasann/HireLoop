"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  APPLICATION_STATUSES,
  applicationStatusMeta,
  type ApplicationStatus,
} from "@/lib/applications"
import { cn } from "@/lib/utils"

const triggerClassName =
  "h-8! w-[136px] rounded-[8px] border-white/10 bg-[#0c0c0f] px-2.5 text-[12px] text-[#ededef] shadow-none focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f] dark:hover:bg-[#0c0c0f]"

type ApplicationStatusSelectProps = {
  value: ApplicationStatus
  onChange: (status: ApplicationStatus) => void
  id?: string
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * Status picker shared by the recruiter table and the applicant details sheet.
 *
 * The caller owns the value so persistence can be added later without touching
 * this control.
 */
function ApplicationStatusSelect({
  value,
  onChange,
  id,
  disabled = false,
  className,
  ariaLabel = "Application status",
}: ApplicationStatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as ApplicationStatus)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn(triggerClassName, className)}
      >
        <SelectValue>
          {(current: string) =>
            applicationStatusMeta[current as ApplicationStatus]?.label ??
            "Applied"
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {APPLICATION_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {applicationStatusMeta[status].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ApplicationStatusSelect }
