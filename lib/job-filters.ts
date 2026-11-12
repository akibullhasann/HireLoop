import type { ManagedJob } from "@/lib/jobs"

/** `ManagedJob` text fields that make useful filters on the public job board. */
export type JobFilterKey = Extract<
  keyof ManagedJob,
  "category" | "employmentType" | "workMode" | "experienceLevel" | "location"
>

/**
 * How a filter group accepts input:
 * - `single`: one option at a time (radio)
 * - `multiple`: any number of options (checkbox)
 * - `search`: type to narrow the options, then toggle any number of them (checkbox)
 */
export type JobFilterControl = "single" | "multiple" | "search"

export type JobFilterOption = {
  value: string
  count: number
}

export type JobFilterGroup = {
  key: JobFilterKey
  label: string
  control: JobFilterControl
  options: JobFilterOption[]
}

const filterMeta: Record<
  JobFilterKey,
  { label: string; control: JobFilterControl }
> = {
  category: { label: "Category", control: "single" },
  employmentType: { label: "Job Type", control: "single" },
  workMode: { label: "Work Mode", control: "multiple" },
  experienceLevel: { label: "Experience", control: "multiple" },
  location: { label: "Location", control: "search" },
}

const filterKeys = Object.keys(filterMeta) as JobFilterKey[]

/** Derives each filter group (with counts) from the jobs on the board. */
export function buildJobFilters(jobs: ManagedJob[]): JobFilterGroup[] {
  return filterKeys
    .map((key) => {
      const counts = new Map<string, number>()

      for (const job of jobs) {
        const value = job[key]
        if (!value) continue

        counts.set(value, (counts.get(value) ?? 0) + 1)
      }

      return {
        key,
        ...filterMeta[key],
        options: Array.from(counts, ([value, count]) => ({
          value,
          count,
        })).sort((a, b) => a.value.localeCompare(b.value)),
      }
    })
    .filter((group) => group.options.length > 0)
}

export const jobSortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Highest Salary" },
  { value: "relevant", label: "Most Relevant" },
  { value: "oldest", label: "Oldest" },
] as const

export type JobSortKey = (typeof jobSortOptions)[number]["value"]
