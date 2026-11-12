import type { Metadata } from "next"
import { AlertCircle, SearchX } from "lucide-react"

import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { getJobs } from "@/lib/api/jobs"
import { buildJobFilters } from "@/lib/job-filters"
import type { ManagedJob } from "@/lib/jobs"

export const metadata: Metadata = {
  title: "Browse Jobs — HireLoop",
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
    <main className="min-h-svh bg-[#010103] pb-24 text-white">
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[420px] w-[820px] max-w-full rounded-full bg-brand/20 blur-[120px]"
        />

        <div className="mx-auto w-full max-w-[1200px] px-5 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
          <p className="font-label text-[11px] tracking-[0.18em] text-brand uppercase">
            Open roles
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] text-balance text-white sm:text-4xl lg:text-5xl">
            Browse jobs
          </h1>
          <p className="mt-3 max-w-xl font-heading text-sm leading-relaxed text-[#a1a4aa] sm:text-base">
            Find a role that fits how you want to work — remote, hybrid, or
            on-site.
          </p>

          <JobFilters filters={filters} className="mt-8" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/7 pb-4">
          <p className="text-[13px] text-[#a1a4aa]">
            Showing <span className="text-white">{jobs.length}</span>{" "}
            {jobs.length === 1 ? "open role" : "open roles"}
          </p>
          <p className="font-label text-[10px] tracking-[0.12em] text-[#6e6e78] uppercase">
            Newest first
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-6 flex gap-3 rounded-[16px] border border-red-500/25 bg-red-500/10 p-5 text-[13px] text-red-200"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <div>
              <p className="font-medium">We could not load the job board.</p>
              <p className="mt-1 text-red-200/70">{error}</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-[16px] border border-dashed border-white/10 bg-[#0c0c0f]/60 px-6 py-16 text-center">
            <SearchX aria-hidden="true" className="size-8 text-[#6e6e78]" />
            <p className="mt-2 font-heading text-base font-semibold text-white">
              No open roles right now
            </p>
            <p className="max-w-sm text-[13px] text-[#828997]">
              Try a different keyword, or clear the filters to see every role.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default BrowseJobsPage
