"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { jobSortOptions, type JobSortKey } from "@/lib/job-filters"

const defaultSort: JobSortKey = "recent"

/**
 * Figma "Sort by" dropdown. Uncontrolled for now: the selected sort is not
 * written to the URL or the server query yet.
 */
function JobSort() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] leading-5 text-[#6e6e78]">Sort by:</span>

      <Select defaultValue={defaultSort} name="sort">
        <SelectTrigger className="h-9 w-[141px] rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none dark:border-white/10 dark:bg-[#0c0c0f] dark:hover:bg-[#141419]">
          <SelectValue>
            {(value) =>
              jobSortOptions.find((option) => option.value === value)?.label ??
              "Most Recent"
            }
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="border border-white/10 bg-[#1e1e21] text-[#ededef]">
          {jobSortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="focus:bg-white/10 focus:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { JobSort }
