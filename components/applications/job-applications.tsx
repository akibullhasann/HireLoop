"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, FileSearch, Search } from "lucide-react"

import { ApplicantDetailsSheet } from "@/components/applications/applicant-details-sheet"
import { ApplicationStatusSelect } from "@/components/applications/application-status-select"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  APPLICATION_STATUSES,
  applicationStatusMeta,
  type ApplicationStatus,
  type ManagedApplication,
} from "@/lib/applications"
import { formatDateTime, formatRelativeTime, getInitials } from "@/lib/format"
import type { ManagedJob } from "@/lib/jobs"
import { cn } from "@/lib/utils"
import { updateApplicationStatus } from "@/lib/actions/applications"

const cardClassName =
  "rounded-[12px] border border-white/[0.07] bg-[#141418] shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)]"

const inputClassName =
  "h-[38px] rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f]"

const selectTriggerClassName =
  "h-[38px]! w-full rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f] dark:hover:bg-[#0c0c0f]"

type StatusFilter = "all" | ApplicationStatus

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...APPLICATION_STATUSES.map((status) => ({
    value: status,
    label: applicationStatusMeta[status].label,
  })),
]

function getStats(applications: ManagedApplication[]) {
  const countByStatus = (status: ApplicationStatus) =>
    applications.filter((application) => application.status === status).length

  return [
    {
      label: "Total applicants",
      value: String(applications.length),
      tone: "text-[#ededef]",
    },
    {
      label: "In review",
      value: String(countByStatus("review")),
      tone: "text-[#f59e0b]",
    },
    {
      label: "Shortlisted",
      value: String(countByStatus("shortlisted")),
      tone: "text-[#60a5fa]",
    },
    {
      label: "Offers",
      value: String(countByStatus("offered")),
      tone: "text-[#22c55e]",
    },
  ]
}

type JobApplicationsProps = {
  job: ManagedJob
  applications: ManagedApplication[]
  error?: string | null
}

function JobApplications({
  job,
  applications: initialApplications,
  error = null,
}: JobApplicationsProps) {
  
  const [statusOverrides, setStatusOverrides] = React.useState<
    Record<string, ApplicationStatus>
  >({})
  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const applications = React.useMemo(
    () =>
      initialApplications.map((application) => {
        const override = statusOverrides[application.id]

        return override && override !== application.status
          ? { ...application, status: override }
          : application
      }),
    [initialApplications, statusOverrides]
  )

  const stats = React.useMemo(() => getStats(applications), [applications])

  const filteredApplications = React.useMemo(() => {
    const search = query.trim().toLowerCase()

    return applications.filter((application) => {
      if (statusFilter !== "all" && application.status !== statusFilter) {
        return false
      }

      if (!search) return true

      return [application.applicantName, application.applicantEmail].some(
        (value) => value.toLowerCase().includes(search)
      )
    })
  }, [applications, query, statusFilter])

  const selectedApplication =
    applications.find((application) => application.id === selectedId) ?? null

  async function handleStatusChange(
  applicationId: string,
  status: ApplicationStatus
) {
  
  const previous = statusOverrides[applicationId]

 
  setStatusOverrides((current) => ({
    ...current,
    [applicationId]: status,
  }))

  try {
   
    await updateApplicationStatus(applicationId, { status })
  } catch (error) {

    setStatusOverrides((current) => {
      const next = { ...current }
      if (previous) {
        next[applicationId] = previous
      } else {
        delete next[applicationId]
      }
      return next
    })
    console.error("Failed to update status", error)
  }
}

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-[12px] leading-5 text-[#a0a0ab] transition-colors hover:text-[#ededef]"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Back to jobs
          </Link>

          <h1 className="mt-3 text-[22px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
            Applications
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#a0a0ab]">
            {job.title} · {job.company}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[job.location, job.employmentType, job.workMode]
              .filter(Boolean)
              .map((detail) => (
                <span
                  key={detail}
                  className="rounded-md border border-white/10 bg-[#1a1a1f] px-2 py-1 text-[12px] leading-4 text-[#a0a0ab]"
                >
                  {detail}
                </span>
              ))}
          </div>
        </div>

        <Link
          href={`/browse-jobs/${job.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-9 shrink-0 rounded-[8px] border-white/15 bg-white/[0.03] text-[13px] font-medium text-[#ededef] hover:bg-white/[0.06]"
          )}
        >
          View job post
          <ArrowUpRight aria-hidden="true" className="ml-2 size-4" />
        </Link>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-[12px] border border-red-500/25 bg-red-500/10 p-4 text-[13px] leading-5 text-red-200"
        >
          <p className="font-medium">Could not load applications.</p>
          <p className="mt-0.5 text-red-200/70">{error}</p>
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

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_190px]">
        <div>
          <label
            htmlFor="application-search"
            className="mb-1.5 block text-[13px] text-[#a1a4aa]"
          >
            Search applicants
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#828997]"
            />
            <Input
              id="application-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email..."
              className={cn(inputClassName, "pl-9")}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="application-status-filter"
            className="mb-1.5 block text-[13px] text-[#a1a4aa]"
          >
            Status
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter((value as StatusFilter) ?? "all")
            }
          >
            <SelectTrigger
              id="application-status-filter"
              className={selectTriggerClassName}
            >
              <SelectValue>
                {(value: string) =>
                  statusOptions.find((option) => option.value === value)
                    ?.label ?? "All statuses"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className={cn(cardClassName, "overflow-hidden")}>
        {filteredApplications.length > 0 ? (
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="border-white/[0.07] bg-[#1a1a1f] hover:bg-[#1a1a1f]">
                <TableHead className="h-11 w-[45%] px-4 text-[11px] font-medium tracking-normal text-[#6e6e78]">
                  Applicant
                </TableHead>
                <TableHead className="hidden h-11 px-4 text-[11px] font-medium tracking-normal text-[#6e6e78] sm:table-cell">
                  Applied
                </TableHead>
                <TableHead className="h-11 w-[20%] px-4 text-[11px] font-medium tracking-normal text-[#6e6e78]">
                  Status
                </TableHead>
                <TableHead className="h-11 px-4 text-right text-[11px] font-medium tracking-normal text-[#6e6e78]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow
                  key={application.id}
                  className="border-white/[0.07] hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-[13px]">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full border border-white/[0.07] bg-[#222228] text-[12px] font-semibold text-[#ededef]"
                      >
                        {getInitials(application.applicantName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] leading-5 font-medium text-[#ededef]">
                          {application.applicantName || "Unnamed applicant"}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] leading-4 text-[#a0a0ab]">
                          {application.applicantEmail || "No email provided"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden px-4 py-[13px] sm:table-cell">
                    <p
                      className="text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]"
                      title={formatDateTime(application.appliedAt)}
                    >
                      {formatRelativeTime(application.appliedAt)}
                    </p>
                  </TableCell>

                  <TableCell className="px-4 py-[13px]">
                    <ApplicationStatusSelect
                      value={application.status}
                      onChange={(status) =>
                        handleStatusChange(application.id, status)
                      }
                      ariaLabel={`Status for ${application.applicantName}`}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-[13px] text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedId(application.id)}
                      className="inline-flex h-8 items-center rounded-[8px] border border-white/[0.07] bg-white/[0.03] px-2.5 text-[12px] leading-4 font-medium text-[#ededef] transition-colors hover:bg-white/[0.07] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      View details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <FileSearch aria-hidden="true" className="size-8 text-[#6e6e78]" />
            <h2 className="mt-2 text-[15px] font-semibold text-[#ededef]">
              {applications.length === 0
                ? "No applications yet"
                : "No matching applicants"}
            </h2>
            <p className="max-w-sm text-[13px] leading-5 text-[#a0a0ab]">
              {applications.length === 0
                ? "Applications for this role will show up here as soon as candidates apply."
                : "Try a different name, email, or status filter."}
            </p>
            {applications.length === 0 && (
              <Link
                href={`/browse-jobs/${job.id}`}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-[8px] bg-white px-5 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white/90"
              >
                View job post
              </Link>
            )}
          </div>
        )}

        <footer className="border-t border-white/[0.07] bg-[#1a1a1f] px-4 py-3 text-[12px] leading-5 text-[#828997]">
          Showing {filteredApplications.length} of {applications.length}{" "}
          {applications.length === 1 ? "application" : "applications"}
        </footer>
      </section>

      <ApplicantDetailsSheet
        application={selectedApplication}
        open={selectedApplication !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

export { JobApplications }
