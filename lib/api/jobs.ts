import { cache } from "react"

import type { ManagedJob, ManagedJobStatus } from "@/lib/jobs"

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:5000"

type ApiJob = {
  _id?: string
  id?: string
  title?: string
  company?: string
  category?: string
  location?: string
  employmentType?: string
  workMode?: string
  experienceLevel?: string
  salaryRange?: string
  deadline?: string
  description?: string
  responsibilities?: string
  requirements?: string
  status?: string
  postedAt?: string
}

const knownStatuses: ManagedJobStatus[] = ["active", "closed", "draft"]

function normalizeStatus(status?: string): ManagedJobStatus {
  // New jobs are stored as "published" from the create form.
  if (status === "published") return "active"

  if (status && knownStatuses.includes(status as ManagedJobStatus)) {
    return status as ManagedJobStatus
  }

  return "active"
}

function toManagedJob(job: ApiJob): ManagedJob {
  const text = (value?: string) => value ?? ""

  return {
    id: String(job._id ?? job.id ?? ""),
    title: text(job.title),
    company: text(job.company),
    category: text(job.category),
    location: text(job.location),
    employmentType: text(job.employmentType),
    workMode: text(job.workMode),
    experienceLevel: text(job.experienceLevel),
    salaryRange: text(job.salaryRange),
    deadline: text(job.deadline),
    description: text(job.description),
    responsibilities: text(job.responsibilities),
    requirements: text(job.requirements),
    status: normalizeStatus(job.status),
    postedAt: text(job.postedAt),
  }
}

export async function getJobs(query: string = ""): Promise<ManagedJob[]> {
  const res = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error(`The jobs API responded with ${res.status}.`)
  }

  const data: unknown = await res.json()

  if (!Array.isArray(data)) {
    throw new Error("The jobs API returned an unexpected response.")
  }

  return data.map((job) => toManagedJob(job as ApiJob))
}

/** Looks up a single job by id. Deduped per request for metadata + page. */
export const getJob = cache(async (id: string): Promise<ManagedJob | null> => {
  const jobs = await getJobs()

  return jobs.find((job) => job.id === id) ?? null
})

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE" })

  if (!res.ok) {
    throw new Error(`The jobs API responded with ${res.status}.`)
  }
}
