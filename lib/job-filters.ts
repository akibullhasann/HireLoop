import type { ManagedJob, NewJob } from "@/lib/jobs"

/** The `NewJob` fields that make useful filters on the public job board. */
export type JobFilterKey = Extract<
  keyof NewJob,
  "category" | "employmentType" | "workMode" | "experienceLevel" | "location"
>

export type JobFilter = {
  key: JobFilterKey
  label: string
  placeholder: string
  options: string[]
}

const filterMeta: Record<JobFilterKey, { label: string; placeholder: string }> =
  {
    category: { label: "Category", placeholder: "All categories" },
    employmentType: { label: "Job type", placeholder: "All job types" },
    workMode: { label: "Work mode", placeholder: "All work modes" },
    experienceLevel: { label: "Experience", placeholder: "All levels" },
    location: { label: "Location", placeholder: "All locations" },
  }

const filterKeys = Object.keys(filterMeta) as JobFilterKey[]

/** Derives each filter's options from the jobs currently on the board. */
export function buildJobFilters(jobs: ManagedJob[]): JobFilter[] {
  return filterKeys.map((key) => ({
    key,
    ...filterMeta[key],
    options: Array.from(
      new Set(jobs.map((job) => job[key]).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b)),
  }))
}
