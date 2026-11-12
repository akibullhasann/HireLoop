"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { JobFilter } from "@/lib/job-filters"
import { cn } from "@/lib/utils"

const inputClassName =
  "h-12 rounded-[10px] border-white/10 bg-[#101014] pr-4 pl-11 text-[14px] text-[#ededef] shadow-none placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:border-white/10 dark:bg-[#101014]"

const triggerClassName =
  "h-10! w-full! rounded-[10px] border-white/10 bg-[#101014] px-3 text-[13px] text-[#ededef] shadow-none data-placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:border-white/10 dark:bg-[#101014] dark:hover:bg-[#141419]"

type JobFiltersProps = {
  filters: JobFilter[]
  className?: string
}

/**
 * Presentational search + filter controls.
 *
 * They are intentionally uncontrolled: syncing the values with the URL and
 * the server query is handled separately.
 */
function JobFilters({ filters, className }: JobFiltersProps) {
  return (
    <section
      aria-label="Search and filter jobs"
      className={cn(
        "rounded-[16px] border border-white/10 bg-[#0b0b0e] p-4 sm:p-5",
        className
      )}
    >
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#828997]"
        />
        <label htmlFor="job-search" className="sr-only">
          Search jobs
        </label>
        <Input
          id="job-search"
          name="search"
          type="search"
          autoComplete="off"
          placeholder="Search by job title, company, or skill"
          className={inputClassName}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {filters.map((filter) => (
          <div key={filter.key} className="flex min-w-0 flex-col gap-1.5">
            <label
              htmlFor={`filter-${filter.key}`}
              className="font-label text-[10px] tracking-[0.12em] text-[#6e6e78] uppercase"
            >
              {filter.label}
            </label>

            <Select name={filter.key}>
              <SelectTrigger
                id={`filter-${filter.key}`}
                className={triggerClassName}
              >
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>

              <SelectContent className="border border-white/10 bg-[#141418] text-[#ededef]">
                {filter.options.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="focus:bg-white/10 focus:text-white"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </section>
  )
}

export { JobFilters }
