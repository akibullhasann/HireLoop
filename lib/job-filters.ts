import type { ManagedJob } from "@/lib/jobs"

/** `ManagedJob` text fields that make useful filters on the public job board. */
export type JobFilterKey = Extract<
  keyof ManagedJob,
  "category" | "employmentType" | "workMode" | "experienceLevel" | "location"
>

export type JobFilterOption = {
  value: string
  count: number
}

export type JobFilterGroup = {
  key: JobFilterKey
  label: string
  options: JobFilterOption[]
}

const filterLabels: Record<JobFilterKey, string> = {
  category: "Category",
  employmentType: "Job Type",
  workMode: "Work Mode",
  experienceLevel: "Experience",
  location: "Location",
}

const filterKeys = Object.keys(filterLabels) as JobFilterKey[]

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
        label: filterLabels[key],
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
