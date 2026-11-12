"use client"

import * as React from "react"
import Link from "next/link"
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSearch,
  Search,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  applicationStatusMeta,
  type ApplicationTab,
  type ManagedApplication,
} from "@/lib/applications"
import { formatRelativeTime } from "@/lib/format"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 5

const cardClassName =
  "rounded-[12px] border border-white/[0.07] bg-[#141418] shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)]"

const tabs: { value: ApplicationTab; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
]

type MyApplicationsProps = {
  applications: ManagedApplication[]
  error?: string | null
}

function getStats(applications: ManagedApplication[]) {
  const total = applications.length
  const shortlisted = applications.filter(
    (application) => application.status === "shortlisted"
  ).length
  const interviews = applications.filter(
    (application) => application.status === "interview"
  ).length
  const offers = applications.filter(
    (application) => application.status === "offered"
  ).length

  return [
    { label: "Total Applied", value: String(total), tone: "text-[#ededef]" },
    {
      label: "Shortlisted",
      value: String(shortlisted),
      tone: "text-[#ededef]",
    },
    { label: "Interviews", value: String(interviews), tone: "text-[#f59e0b]" },
    {
      label: "Success Rate",
      value: total === 0 ? "0%" : `${Math.round((offers / total) * 100)}%`,
      tone: "text-[#22c55e]",
    },
  ]
}

/** Page numbers with an ellipsis when there are too many to show. */
function getPageItems(totalPages: number, currentPage: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) return [1, 2, 3, "ellipsis", totalPages] as const
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages] as const
}

function MyApplications({ applications, error = null }: MyApplicationsProps) {
  const [activeTab, setActiveTab] = React.useState<ApplicationTab>("active")
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)

  const stats = getStats(applications)

  const filteredApplications = React.useMemo(() => {
    const search = query.trim().toLowerCase()

    return applications.filter((application) => {
      if (
        activeTab === "active" ? application.archived : !application.archived
      ) {
        return false
      }

      if (!search) return true

      return [
        application.jobTitle,
        application.company,
        application.location,
        application.category,
      ].some((value) => value.toLowerCase().includes(search))
    })
  }, [applications, activeTab, query])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / PAGE_SIZE)
  )
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * PAGE_SIZE
  const pageItems = filteredApplications.slice(
    firstIndex,
    firstIndex + PAGE_SIZE
  )
  const pageNumbers = getPageItems(totalPages, currentPage)

  function changeTab(tab: ApplicationTab) {
    setActiveTab(tab)
    setPage(1)
  }

  function handleExport() {
    // Browsers expose "Save as PDF" in the print dialog, which keeps this
    // dependency-free while still producing a document.
    window.print()
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
            My Applications
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#a0a0ab]">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[280px]">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-[#828997]"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search applications..."
              aria-label="Search applications"
              className="h-10 rounded-[8px] border-white/10 bg-[#0c0c0f] pl-9 text-[13px] text-[#ededef] shadow-none placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f]"
            />
          </div>

          <div
            role="tablist"
            aria-label="Application status"
            className="inline-flex h-[42px] shrink-0 items-center gap-1 rounded-[8px] border border-white/[0.07] bg-[#1a1a1f] p-[5px]"
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.value}
                onClick={() => changeTab(tab.value)}
                className={cn(
                  "h-8 rounded-[8px] px-3.5 text-[13px] leading-5 transition-colors",
                  activeTab === tab.value
                    ? "border border-white/10 bg-[#1a1a1f] text-[#ededef]"
                    : "text-[#a0a0ab] hover:text-[#ededef]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#fafafa] px-4 text-[13px] leading-5 font-medium text-[#0b0b0c] shadow-[0_2px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white"
          >
            <Download aria-hidden="true" className="size-3.5" />
            Export PDF
          </button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-[12px] border border-red-500/25 bg-red-500/10 p-4 text-[13px] text-red-200"
        >
          {error}
        </div>
      )}

      <section
        aria-label="Application stats"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.label} className={cn(cardClassName, "px-5 py-3")}>
            <p className="text-[13px] leading-5 text-[#a0a0ab]">{stat.label}</p>
            <p
              className={cn(
                "mt-2 text-[26px] leading-8 font-semibold tracking-[-0.02em]",
                stat.tone
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className={cn(cardClassName, "overflow-hidden")}>
        {pageItems.length > 0 ? (
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow className="border-0 bg-[#1a1a1f] hover:bg-[#1a1a1f]">
                {[
                  { label: "Job Title", className: "w-[30%]" },
                  { label: "Company", className: "w-[20%]" },
                  { label: "Applied", className: "w-[15%]" },
                  { label: "Status", className: "w-[17%]" },
                ].map((column) => (
                  <TableHead
                    key={column.label}
                    className={cn(
                      "h-11 px-4 text-[12px] leading-4 font-medium tracking-normal whitespace-nowrap text-[#6e6e78]",
                      column.className
                    )}
                  >
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="h-11 px-4 text-right text-[12px] leading-4 font-medium tracking-normal whitespace-nowrap text-[#6e6e78]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageItems.map((application) => {
                const status = applicationStatusMeta[application.status]
                const details = [
                  application.employmentType,
                  application.workMode,
                ]
                  .filter(Boolean)
                  .join(" • ")

                return (
                  <TableRow
                    key={application.id}
                    className="border-white/[0.07] hover:bg-white/[0.03]"
                  >
                    <TableCell className="px-4 py-[13px]">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="grid size-8 shrink-0 place-items-center rounded-[4px] border border-white/[0.07] bg-[#222228]"
                        >
                          <Briefcase className="size-4 text-white" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] leading-5 font-medium text-[#ededef]">
                            {application.jobTitle}
                          </p>
                          {details && (
                            <p className="mt-0.5 truncate text-[12px] leading-4 text-[#a0a0ab]">
                              {details}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-[13px] text-[13px] leading-5 whitespace-nowrap text-[#ededef]">
                      {application.company}
                    </TableCell>

                    <TableCell className="px-4 py-[13px] text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
                      {formatRelativeTime(application.appliedAt)}
                    </TableCell>

                    <TableCell className="px-4 py-[13px]">
                      <span
                        className={cn(
                          "inline-flex h-[22px] items-center rounded-full border px-2 text-[12px] leading-4 font-medium",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-[13px] text-right">
                      <Link
                        href={`/browse-jobs/${application.jobId}`}
                        className="text-[13px] leading-5 text-[#ededef] underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        Details
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <FileSearch aria-hidden="true" className="size-8 text-[#6e6e78]" />
            <h2 className="mt-2 text-[15px] font-semibold text-[#ededef]">
              {query ? "No matching applications" : "No applications yet"}
            </h2>
            <p className="max-w-sm text-[13px] leading-5 text-[#a0a0ab]">
              {query
                ? "Try a different job title, company, or location."
                : activeTab === "archived"
                  ? "Applications you archive will show up here."
                  : "Apply for a role and it will show up here with live status updates."}
            </p>
            {!query && activeTab === "active" && (
              <Link
                href="/browse-jobs"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-[8px] bg-white px-5 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white/90"
              >
                Browse open roles
              </Link>
            )}
          </div>
        )}

        {filteredApplications.length > 0 && (
          <footer className="flex flex-col gap-3 border-t border-white/[0.07] bg-[#1a1a1f] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-[13px] leading-5 text-[#a0a0ab]">
              Showing {firstIndex + 1}-
              {Math.min(firstIndex + PAGE_SIZE, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </p>

            <nav aria-label="Pagination" className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="grid size-8 place-items-center rounded-[8px] border border-white/[0.08] text-[#a0a0ab] transition-colors hover:text-[#ededef] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>

              {pageNumbers.map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="grid size-8 place-items-center text-[13px] text-[#6e6e78]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                    className={cn(
                      "grid size-8 place-items-center rounded-[8px] border text-[13px] transition-colors",
                      item === currentPage
                        ? "border-white bg-white font-medium text-[#0b0b0c]"
                        : "border-white/[0.08] text-[#a0a0ab] hover:text-[#ededef]"
                    )}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="grid size-8 place-items-center rounded-[8px] border border-white/[0.08] text-[#a0a0ab] transition-colors hover:text-[#ededef] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </nav>
          </footer>
        )}
      </section>
    </div>
  )
}

export { MyApplications }
