'use client'
import {
  Bookmark,
  Briefcase,
  CalendarDays,
  Layers,
  MapPin,
  Tag,
  Wallet,
} from "lucide-react"

import { formatJobDate } from "@/lib/format"
import type { ManagedJob, ManagedJobStatus } from "@/lib/jobs"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type JobCardProps = {
  job: ManagedJob
}

const statusLabels: Record<ManagedJobStatus, string> = {
  active: "Open",
  closed: "Closed",
  draft: "Draft",
}

const statusStyles: Record<ManagedJobStatus, string> = {
  active: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
  closed: "border-white/10 bg-white/5 text-[#a0a0ab]",
  draft: "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]",
}

/**
 * Figma "Article - Job Card", adapted to the fields available on `ManagedJob`.
 */
function JobCard({ job }: JobCardProps) {

  const router = useRouter();
  const initial = job.company.charAt(0).toUpperCase() || "?"

  const chips = [
    { label: "Salary", icon: Wallet, value: job.salaryRange },
    { label: "Job type", icon: Briefcase, value: job.employmentType },
    { label: "Work mode", icon: MapPin, value: job.workMode },
    { label: "Experience", icon: Layers, value: job.experienceLevel },
    { label: "Category", icon: Tag, value: job.category },
    {
      label: "Deadline",
      icon: CalendarDays,
      value: job.deadline ? `Apply by ${formatJobDate(job.deadline)}` : "",
    },
  ].filter((chip) => chip.value)

  const handleJobDetail = (jobId:string)=>{
    router.push(`/browse-jobs/${jobId}`)
  }

  return (
    <article
     onClick={() => handleJobDetail(job.id)}
     className="rounded-[12px] border border-white/[0.07] bg-[#141418] p-4 shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)] transition-colors hover:border-white/15 sm:p-[25px]">
      <div className="flex items-start gap-4 sm:gap-5">
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-[8px] border border-white/[0.07] bg-[#222228] font-heading text-xl font-semibold text-[#ededef] sm:size-16"
        >
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-lg leading-7 font-semibold text-[#ededef] sm:text-[22px]">
                {job.title}
              </h3>
              <p className="mt-1 truncate text-[14px] font-semibold text-[#6e6e78] sm:text-[16px]">
                {job.company}
                {job.location && ` • ${job.location}`}
                {job.workMode && ` (${job.workMode})`}
              </p>
            </div>

            <button
              type="button"
              aria-label={`Save ${job.title}`}
              className="grid size-10 shrink-0 place-items-center rounded-[8px] text-[#8e9192] transition-colors hover:bg-white/5 hover:text-[#ededef]"
            >
              <Bookmark aria-hidden="true" className="size-[18px]" />
            </button>
          </div>

          {job.description && (
            <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-[#828997]">
              {job.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map(({ label, icon: Icon, value }) => (
              <span
                key={label}
                className="inline-flex h-[30px] items-center gap-1.5 rounded-[8px] border border-white/10 bg-[#1a1a1f] px-3 text-[13px] font-medium text-[#ededef]"
              >
                <Icon aria-hidden="true" className="size-3.5 text-[#e5e2e3]" />
                {value}
              </span>
            ))}

            <span
              className={cn(
                "inline-flex h-[30px] items-center rounded-[4px] border px-2.5 text-[13px] font-medium",
                statusStyles[job.status]
              )}
            >
              {statusLabels[job.status]}
            </span>
          </div>

          {job.postedAt && (
            <p className="mt-3 text-[12px] text-[#6e6e78]">
              Posted {formatJobDate(job.postedAt)}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export { JobCard }
