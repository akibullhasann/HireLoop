import { Check } from "lucide-react"

import type { JobFilterGroup } from "@/lib/job-filters"
import { cn } from "@/lib/utils"

type JobFiltersProps = {
  filters: JobFilterGroup[]
  className?: string
}

/**
 * Figma "Aside - Sidebar Filters" with checkbox groups and result counts.
 *
 * Checkboxes are uncontrolled and have no change handler yet: applying the
 * selection to the URL/query is handled separately.
 */
function JobFilters({ filters, className }: JobFiltersProps) {
  return (
    <aside
      aria-labelledby="job-filters-heading"
      className={cn(
        "rounded-[12px] border border-white/[0.07] bg-[#141418] p-5 shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)] sm:p-[25px]",
        className
      )}
    >
      <h2
        id="job-filters-heading"
        className="font-heading text-[22px] leading-7 font-semibold text-[#ededef]"
      >
        Filters
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {filters.map((group) => (
          <fieldset key={group.key}>
            <legend className="text-[16px] leading-[27px] font-semibold text-[#ededef]">
              {group.label}
            </legend>

            <div className="mt-2 flex flex-col gap-2">
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    name={group.key}
                    value={option.value}
                    className="peer sr-only"
                  />

                  <span
                    aria-hidden="true"
                    className="grid size-5 shrink-0 place-items-center rounded-[4px] border border-white/[0.07] bg-[#1a1a1f] text-transparent transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-[#141418] peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[13px] leading-5 text-[#a0a0ab] transition-colors group-hover:text-[#ededef]">
                    {option.value}
                  </span>

                  <span className="shrink-0 text-[12px] text-[#6e6e78]">
                    {option.count}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </aside>
  )
}

export { JobFilters }
