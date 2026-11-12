import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type ManagedApplication,
} from "@/lib/applications"

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:5000"

type ApiApplication = {
  _id?: string
  id?: string
  applicantId?: string
  applicantName?: string
  applicantEmail?: string
  jobId?: string
  jobTitle?: string
  company?: string
  category?: string
  location?: string
  employmentType?: string
  workMode?: string
  salaryRange?: string
  status?: string
  appliedAt?: string
  archived?: boolean
}

function toApplicationStatus(value?: string): ApplicationStatus {
  return value && APPLICATION_STATUSES.includes(value as ApplicationStatus)
    ? (value as ApplicationStatus)
    : "applied"
}

function toManagedApplication(application: ApiApplication): ManagedApplication {
  const text = (value?: string) => value ?? ""

  return {
    id: application.id ?? application._id ?? "",
    applicantId: text(application.applicantId),
    applicantName: text(application.applicantName),
    applicantEmail: text(application.applicantEmail),
    jobId: text(application.jobId),
    jobTitle: text(application.jobTitle),
    company: text(application.company),
    category: text(application.category),
    location: text(application.location),
    employmentType: text(application.employmentType),
    workMode: text(application.workMode),
    salaryRange: text(application.salaryRange),
    status: toApplicationStatus(application.status),
    appliedAt: text(application.appliedAt),
    archived: application.archived === true,
  }
}

/** Loads one seeker's applications, newest first. */
export async function getApplications(
  applicantId: string
): Promise<ManagedApplication[]> {
  if (!applicantId) return []

  const res = await fetch(
    `${BASE_URL}/applications?applicantId=${encodeURIComponent(applicantId)}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error(`The applications API responded with ${res.status}.`)
  }

  const data: unknown = await res.json()

  if (!Array.isArray(data)) {
    throw new Error("The applications API returned an unexpected response.")
  }

  return data.map((application) =>
    toManagedApplication(application as ApiApplication)
  )
}
