"use client"

import * as React from "react"
import { Check, Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import type { JobFilterGroup, JobFilterOption } from "@/lib/job-filters"
import { cn } from "@/lib/utils"

type JobFiltersProps = {
  filters: JobFilterGroup[]
  className?: string
}

type FilterOptionProps = {
  type: "checkbox" | "radio"
  name: string
  option: JobFilterOption
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

/** A checkbox/radio row with the Figma filter styling. */
function FilterOption({
  type,
  name,
  option,
  checked,
  onChange,
}: FilterOptionProps) {
  const isRadio = type === "radio"

  return (
    <label className="group flex cursor-pointer items-center gap-3">
      <input
        type={type}
        name={name}
        value={option.value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          "grid size-5 shrink-0 place-items-center border border-white/[0.07] bg-[#1a1a1f] text-transparent transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-[#141418] peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40",
          isRadio ? "rounded-full" : "rounded-[4px]"
        )}
      >
        {isRadio ? (
          <span className="size-2 rounded-full bg-current" />
        ) : (
          <Check className="size-3.5" strokeWidth={3} />
        )}
      </span>

      <span className="min-w-0 flex-1 truncate text-[13px] leading-5 text-[#a0a0ab] transition-colors group-hover:text-[#ededef]">
        {option.value}
      </span>

      <span className="shrink-0 text-[12px] text-[#6e6e78]">
        {option.count}
      </span>
    </label>
  )
}

/** Searchable multi-select filter used for locations. */
function SearchableFilter({ group }: { group: JobFilterGroup }) {
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState<string[]>([])

  const term = query.trim().toLowerCase()
  const options = group.options.filter(
    (option) =>
      selected.includes(option.value) ||
      option.value.toLowerCase().includes(term)
  )

  function toggle(value: string) {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  return (
    <fieldset>
      <legend className="text-[16px] leading-[27px] font-semibold text-[#ededef]">
        {group.label}
      </legend>

      <div className="relative mt-2">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#6e6e78]"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search location..."
          aria-label="Search locations"
          autoComplete="off"
          className="h-9 rounded-[8px] border-white/10 bg-[#1a1a1f] pr-8 pl-9 text-[13px] text-[#ededef] shadow-none placeholder:text-[#6e6e78] focus-visible:border-brand/60 focus-visible:ring-brand/20 dark:border-white/10 dark:bg-[#1a1a1f]"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear location search"
            className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded text-[#6e6e78] transition-colors hover:text-[#ededef]"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="mt-2 flex max-h-52 flex-col gap-2 overflow-y-auto pr-1">
        {options.length > 0 ? (
          options.map((option) => (
            <FilterOption
              key={option.value}
              type="checkbox"
              name={group.key}
              option={option}
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
          ))
        ) : (
          <p className="py-1 text-[12px] text-[#6e6e78]">No locations found.</p>
        )}
      </div>
    </fieldset>
  )
}

/**
 * Figma "Aside - Sidebar Filters".
 *
 * Category and Job Type accept a single value, Work Mode, Experience and
 * Location accept multiple values (Location is also searchable). The selection
 * is not written to the URL or the server query yet.
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
        {filters.map((group) =>
          group.control === "search" ? (
            <SearchableFilter key={group.key} group={group} />
          ) : (
            <fieldset key={group.key}>
              <legend className="text-[16px] leading-[27px] font-semibold text-[#ededef]">
                {group.label}
              </legend>

              <div className="mt-2 flex flex-col gap-2">
                {group.options.map((option) => (
                  <FilterOption
                    key={option.value}
                    type={group.control === "single" ? "radio" : "checkbox"}
                    name={group.key}
                    option={option}
                  />
                ))}
              </div>
            </fieldset>
          )
        )}
      </div>
    </aside>
  )
}

export { JobFilters }
