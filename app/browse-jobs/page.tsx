import type { Metadata } from "next"
import { AlertCircle, SearchX } from "lucide-react"

import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { JobSearch } from "@/components/jobs/job-search"
import { JobSort } from "@/components/jobs/job-sort"
import { getJobs } from "@/lib/api/jobs"
import { buildJobFilters } from "@/lib/job-filters"
import type { ManagedJob } from "@/lib/jobs"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Browse Jobs | HireLoop",
  description:
    "Explore open roles from teams that are hiring right now. Search by title, company, location, and more.",
}

export const dynamic = "force-dynamic"

type SearchParams = Record<string, string | string[] | undefined>

type BrowseJobsPageProps = {
  searchParams: Promise<SearchParams>
}

function toQueryString(params: SearchParams) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item))
    } else if (value !== undefined) {
      searchParams.set(key, value)
    }
  }

  return searchParams.toString()
}

const BrowseJobsPage = async ({ searchParams }: BrowseJobsPageProps) => {
  const query = toQueryString(await searchParams)

  let jobs: ManagedJob[] = []
  let error: string | null = null

  try {
    const results = await getJobs(query)

    // Only published roles belong on the public job board.
    jobs = results.filter((job) => job.status === "active")
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load jobs."
  }

  const filters = buildJobFilters(jobs)

  return (
    <main className="min-h-svh bg-[#08080a] pb-24 text-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <h1 className="sr-only">Browse jobs</h1>

        <JobSearch />

        <div
          className={cn(
            "mt-8 grid items-start gap-6",
            filters.length > 0 && "lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-8"
          )}
        >
          {filters.length > 0 && (
            <JobFilters filters={filters} className="lg:sticky lg:top-28" />
          )}

          <section aria-label="Job results">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-[22px] leading-7 font-semibold text-[#ededef]">
                Found {jobs.length}{" "}
                {jobs.length === 1 ? "open role" : "open roles"}
              </h2>

              {jobs.length > 0 && <JobSort />}
            </div>

            {error ? (
              <div
                role="alert"
                className="mt-6 flex gap-3 rounded-[12px] border border-red-500/25 bg-red-500/10 p-5 text-[13px] text-red-200"
              >
                <AlertCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                <div>
                  <p className="font-medium">
                    We could not load the job board.
                  </p>
                  <p className="mt-1 text-red-200/70">{error}</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-white/10 bg-[#0c0c0f]/60 px-6 py-16 text-center">
                <SearchX aria-hidden="true" className="size-8 text-[#6e6e78]" />
                <p className="mt-2 font-heading text-base font-semibold text-white">
                  No open roles right now
                </p>
                <p className="max-w-sm text-[13px] text-[#828997]">
                  Try a different keyword, or clear the filters to see every
                  role.
                </p>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default BrowseJobsPage
