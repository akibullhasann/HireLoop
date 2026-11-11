"use client"
import { Trash2, Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { deleteJob } from "@/lib/api/jobs"
import type { ManagedJob, ManagedJobStatus } from "@/lib/jobs"
import { cn } from "@/lib/utils"

const inputClassName =
  "h-[38px] rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f]"

const selectTriggerClassName =
  "h-[38px]! w-full rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f] dark:hover:bg-[#0c0c0f]"

const statusMeta: Record<
  ManagedJobStatus,
  { label: string; badge: string; dot: string }
> = {
  active: {
    label: "Active",
    badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
  closed: {
    label: "Closed",
    badge: "border-white/10 bg-white/5 text-[#a1a4aa]",
    dot: "bg-[#a1a4aa]",
  },
  draft: {
    label: "Draft",
    badge: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },
}

const statusOptions: { value: "all" | ManagedJobStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
]

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function formatDate(value: string) {
  if (!value) return "No deadline"

  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return value

  return `${months[month - 1]} ${day}, ${year}`
}

type ManageJobsProps = {
  jobs: ManagedJob[]
  error?: string | null
}

function ManageJobs({ jobs: initialJobs, error = null }: ManageJobsProps) {
  const router = useRouter()

  const [deletedIds, setDeletedIds] = React.useState<string[]>([])
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<"all" | ManagedJobStatus>("all")
  const [category, setCategory] = React.useState("all")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [actionError, setActionError] = React.useState<string | null>(null)
  const [isRefreshing, startRefresh] = React.useTransition()

  // Server data stays the source of truth; deletions are applied on top of it.
  const jobs = React.useMemo(
    () => initialJobs.filter((job) => !deletedIds.includes(job.id)),
    [initialJobs, deletedIds]
  )

  const categories = React.useMemo(() => {
    const values = new Set(jobs.map((job) => job.category).filter(Boolean))

    return ["all", ...Array.from(values).sort()]
  }, [jobs])

  const filteredJobs = React.useMemo(() => {
    const search = query.trim().toLowerCase()

    return jobs.filter((job) => {
      if (status !== "all" && job.status !== status) return false
      if (category !== "all" && job.category !== category) return false

      if (!search) return true

      return [job.title, job.company, job.location, job.category].some(
        (value) => value.toLowerCase().includes(search)
      )
    })
  }, [jobs, query, status, category])

  async function handleDelete(job: ManagedJob) {




    setDeletingId(job.id)
    setActionError(null)

    try {
      await deleteJob(job.id)
      setDeletedIds((current) => [...current, job.id])
    } catch {
      setActionError(`Could not delete "${job.title}". Please try again.`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Manage Job Posts
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#a1a4aa]">
            Create, review, and keep track of every role you have posted.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[8px] bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white/90 focus-visible:ring-3 focus-visible:ring-white/25 focus-visible:outline-none"
        >
          <Plus className="size-4" />
          Create Job
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-[12px] border border-red-500/25 bg-red-500/10 p-4 text-[13px] text-red-200 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">Could not load your job posts.</p>
            <p className="mt-0.5 text-red-200/70">{error}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isRefreshing}
            onClick={() => startRefresh(() => router.refresh())}
            className="h-9 shrink-0 rounded-[8px] border-red-500/30 bg-transparent text-[13px] text-red-100 hover:bg-red-500/10 hover:text-white"
          >
            {isRefreshing && <Loader2 className="size-4 animate-spin" />}
            Try again
          </Button>
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="rounded-[12px] border border-red-500/25 bg-red-500/10 p-4 text-[13px] text-red-200"
        >
          {actionError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_190px_190px]">
        <div>
          <label
            htmlFor="job-search"
            className="mb-1.5 block text-[13px] text-[#a1a4aa]"
          >
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#828997]" />
            <Input
              id="job-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, company, or location..."
              className={cn(inputClassName, "pl-9")}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="mb-1.5 block text-[13px] text-[#a1a4aa]"
          >
            Status
          </label>
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus((value as typeof status) ?? "all")
            }
          >
            <SelectTrigger
              id="status-filter"
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

        <div>
          <label
            htmlFor="category-filter"
            className="mb-1.5 block text-[13px] text-[#a1a4aa]"
          >
            Category
          </label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "all")}
          >
            <SelectTrigger
              id="category-filter"
              className={selectTriggerClassName}
            >
              <SelectValue>
                {(value: string) =>
                  !value || value === "all" ? "All categories" : value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all" ? "All categories" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-white/7 bg-[#141418]">
        <Table>
          <TableHeader className="border-white/7 bg-[#1a1a1f]">
            <TableRow className="border-white/7 hover:bg-transparent">
              <TableHead className="h-11 px-4 text-[11px] font-medium text-[#6e6e78]">
                Job
              </TableHead>
              <TableHead className="hidden h-11 px-4 text-[11px] font-medium text-[#6e6e78] md:table-cell">
                Company
              </TableHead>
              <TableHead className="hidden h-11 px-4 text-[11px] font-medium text-[#6e6e78] lg:table-cell">
                Category
              </TableHead>
              <TableHead className="hidden h-11 px-4 text-[11px] font-medium text-[#6e6e78] sm:table-cell">
                Type
              </TableHead>
              <TableHead className="hidden h-11 px-4 text-[11px] font-medium text-[#6e6e78] lg:table-cell">
                Salary
              </TableHead>
              <TableHead className="hidden h-11 px-4 text-[11px] font-medium text-[#6e6e78] xl:table-cell">
                Deadline
              </TableHead>
              <TableHead className="h-11 px-4 text-[11px] font-medium text-[#6e6e78]">
                Status
              </TableHead>
              <TableHead className="h-11 px-4 text-right text-[11px] font-medium text-[#6e6e78]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="border-white/7 hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-4">
                    <div className="max-w-[280px]">
                      <p className="truncate text-[13px] font-medium text-[#ededef]">
                        {job.title}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-[#828997]">
                        {job.location} · {job.workMode}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="hidden px-4 py-4 md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-[12px] text-[#ededef]">
                        {job.company.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-[13px] text-[#ededef]">
                        {job.company}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="hidden px-4 py-4 lg:table-cell">
                    <span className="rounded-md border border-white/10 bg-[#1a1a1f] px-2 py-1 text-[12px] text-[#ededef]">
                      {job.category}
                    </span>
                  </TableCell>

                  <TableCell className="hidden px-4 py-4 sm:table-cell">
                    <p className="text-[13px] text-[#ededef]">
                      {job.employmentType}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#828997]">
                      {job.experienceLevel}
                    </p>
                  </TableCell>

                  <TableCell className="hidden px-4 py-4 lg:table-cell">
                    <p className="text-[13px] text-[#a1a4aa]">
                      {job.salaryRange || "Not specified"}
                    </p>
                  </TableCell>

                  <TableCell className="hidden px-4 py-4 xl:table-cell">
                    <p className="text-[13px] text-[#a1a4aa]">
                      {formatDate(job.deadline)}
                    </p>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium",
                        statusMeta[job.status].badge
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          statusMeta[job.status].dot
                        )}
                      />
                      {statusMeta[job.status].label}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                        aria-label={`Edit ${job.title}`}
                        title="Edit job"
                        className="inline-flex size-8 items-center justify-center rounded-md text-[#a1a4aa] transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Pencil className="size-4" />
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${job.title}`}
                              title="Delete job"
                              disabled={deletingId === job.id}
                              className="size-8 text-[#a1a4aa] hover:bg-red-500/10 hover:text-red-400"
                            />
                          }
                        >
                          <Trash2 className="size-4" />
                        </AlertDialogTrigger>

                        <AlertDialogContent size="sm">
                          <AlertDialogHeader>
                            <AlertDialogMedia>
                              <Trash2Icon />
                            </AlertDialogMedia>

                            <AlertDialogTitle>
                              Delete job?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              Are you sure you want to delete
                              {job.title}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel variant="outline">
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(job)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/7 hover:bg-transparent">
                <TableCell colSpan={8} className="px-4 py-16 text-center">
                  {jobs.length === 0 ? (
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[13px] text-[#a1a4aa]">
                        No job posts yet. Create your first one to get started.
                      </p>
                      <Link
                        href="/dashboard/recruiter/jobs/new"
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white/90"
                      >
                        <Plus className="size-4" />
                        Create Job
                      </Link>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#a1a4aa]">
                      No job posts match your filters.
                    </p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="border-t border-white/7 px-4 py-3 text-[12px] text-[#828997]">
          Showing {filteredJobs.length} of {jobs.length} job posts
        </div>
      </div>
    </div>
  )
}

export { ManageJobs }
