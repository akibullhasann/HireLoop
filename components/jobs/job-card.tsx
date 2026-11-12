import { Briefcase, Layers, MapPin, Wallet } from "lucide-react"

import { formatJobDate } from "@/lib/format"
import type { ManagedJob } from "@/lib/jobs"

type JobCardProps = {
  job: ManagedJob
}

function JobCard({ job }: JobCardProps) {
  const initial = job.company.charAt(0).toUpperCase() || "?"
  const meta = [
    { icon: MapPin, value: job.location || "Location not set" },
    { icon: Briefcase, value: job.employmentType || "Job type not set" },
    { icon: Layers, value: job.experienceLevel || "Experience not set" },
  ]

  return (
    <article className="flex h-full flex-col rounded-[16px] border border-white/8 bg-[#0c0c0f] p-5 transition-colors hover:border-brand/40 hover:bg-[#0e0e12]">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-[12px] border border-white/7 bg-[#1a1a1f] font-heading text-base font-semibold text-white"
        >
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] text-[#828997]">{job.company}</p>
          <h2 className="mt-0.5 line-clamp-2 font-heading text-[15px] leading-6 font-semibold text-white">
            {job.title}
          </h2>
        </div>

        {job.workMode && (
          <span className="shrink-0 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand">
            {job.workMode}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-[#a1a4aa]">
        {meta.map(({ icon: Icon, value }) => (
          <span key={value} className="flex items-center gap-1.5">
            <Icon aria-hidden="true" className="size-3.5 text-[#6e6e78]" />
            {value}
          </span>
        ))}
      </div>

      {job.description && (
        <p className="mt-4 line-clamp-2 text-[13px] leading-6 text-[#828997]">
          {job.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/7 pt-4">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#ededef]">
          <Wallet aria-hidden="true" className="size-4 text-[#6e6e78]" />
          {job.salaryRange || "Salary not disclosed"}
        </span>
        <span className="text-[12px] text-[#828997]">
          Apply by {formatJobDate(job.deadline)}
        </span>
      </div>
    </article>
  )
}

export { JobCard }
