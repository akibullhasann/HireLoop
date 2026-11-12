"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Figma "Section - Search & Quick Filters".
 *
 * The controls are presentational. Syncing the value with the URL and the
 * server query is handled separately, so submitting is intentionally a no-op.
 */
function JobSearch() {
  return (
    <section
      aria-label="Search jobs"
      className="rounded-[12px] border border-white/[0.07] bg-[#141418] p-4 shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-[25px]"
    >
      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8e9192]"
          />
          <label htmlFor="job-search" className="sr-only">
            Search jobs
          </label>
          <Input
            id="job-search"
            name="search"
            type="search"
            autoComplete="off"
            placeholder="Search by job title, keywords..."
            className="h-[59px] rounded-[8px] border-white/[0.07] bg-[#1a1a1f] pr-4 pl-12 text-[13px] text-[#ededef] shadow-none placeholder:text-[#a0a0ab] focus-visible:border-brand/60 focus-visible:ring-brand/20 dark:border-white/[0.07] dark:bg-[#1a1a1f]"
          />
        </div>

        <Button
          type="submit"
          className="h-[59px] rounded-[8px] bg-white px-8 text-[16px] font-semibold text-[#2f3131] hover:bg-white/90"
        >
          Search Jobs
        </Button>
      </form>
    </section>
  )
}

export { JobSearch }
