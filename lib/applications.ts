import type { ManagedJob } from "@/lib/jobs"

export const APPLICATION_STATUSES = [
  "applied",
  "review",
  "shortlisted",
  "interview",
  "offered",
  "rejected",
  "withdrawn",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export type ApplicationTab = "active" | "archived"

/**
 * A snapshot of the job taken when the seeker applies.
 *
 * Copying these values (instead of only storing `jobId`) keeps the applications
 * table readable even when the employer later edits, closes, or deletes the job.
 */
export type ApplicationJobSnapshot = {
  jobId: ManagedJob["id"]
  jobTitle: ManagedJob["title"]
  company: ManagedJob["company"]
  category: ManagedJob["category"]
  location: ManagedJob["location"]
  employmentType: ManagedJob["employmentType"]
  workMode: ManagedJob["workMode"]
  salaryRange: ManagedJob["salaryRange"]
}

export type NewApplication = ApplicationJobSnapshot & {
  applicantId: string
  applicantName: string
  applicantEmail: string
  status: ApplicationStatus
  appliedAt: string
  archived: boolean
}

export type ManagedApplication = NewApplication & {
  id: string
}

export const applicationStatusMeta: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: {
    label: "Applied",
    className: "border-white/10 bg-white/[0.06] text-[#a0a0ab]",
  },
  review: {
    label: "Review",
    className: "border-[#f59e0b]/30 bg-[#f59e0b]/[0.14] text-[#f59e0b]",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border-[#60a5fa]/30 bg-[#60a5fa]/[0.14] text-[#60a5fa]",
  },
  interview: {
    label: "Interview",
    className: "border-[#a78bfa]/30 bg-[#a78bfa]/[0.14] text-[#a78bfa]",
  },
  offered: {
    label: "Offered",
    className: "border-[#22c55e]/30 bg-[#22c55e]/[0.14] text-[#22c55e]",
  },
  rejected: {
    label: "Rejected",
    className: "border-[#ef4444]/30 bg-[#ef4444]/[0.14] text-[#ef4444]",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "border-white/10 bg-white/[0.04] text-[#6e6e78]",
  },
}
