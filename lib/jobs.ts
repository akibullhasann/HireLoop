export type JobStatus = "published" | "draft"

export type NewJob = {
  title: string
  company: string
  category: string
  location: string
  employmentType: string
  workMode: string
  experienceLevel: string
  salaryRange: string
  deadline: string
  description: string
  responsibilities: string
  requirements: string
}

export type JobSubmission = NewJob & {
  status: JobStatus
}

export type ManagedJobStatus = "active" | "closed" | "draft"

export type ManagedJob = NewJob & {
  id: string
  status: ManagedJobStatus
  postedAt?: string
}
