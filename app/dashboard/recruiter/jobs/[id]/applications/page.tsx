import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { JobApplications } from "@/components/applications/job-applications"
import type { ManagedApplication } from "@/lib/applications"
import { getApplicationsForJob } from "@/lib/api/applications"
import { getJobById } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"

export const dynamic = "force-dynamic"

type JobApplicationsPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: JobApplicationsPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const job = await getJobById(id)

    if (!job) return { title: "Job Applications — HireLoop" }

    return {
      title: `Applications for ${job.title} — HireLoop`,
      description: `Review applicants for ${job.title} at ${job.company}.`,
    }
  } catch {
    return { title: "Job Applications — HireLoop" }
  }
}

const JobApplicationsPage = async ({ params }: JobApplicationsPageProps) => {
  const { id } = await params
  const session = await getSession()

  if (!session) {
    redirect(`/sign-in?redirectTo=/dashboard/recruiter/jobs/${id}/applications`)
  }

  const job = await getJobById(id).catch(() => null)

  if (!job) notFound()

  const isAdmin = session.user.role === "admin"

  if (!isAdmin && session.user.role !== "recruiter") {
    redirect(`/dashboard/${session.user.role}`)
  }

  // A recruiter can only review applications for jobs they own.
  if (!isAdmin && job.recruiterId !== session.user.id) notFound()

  let applications: ManagedApplication[] = []
  let error: string | null = null

  try {
    applications = await getApplicationsForJob(id)
  } catch (cause) {
    error =
      cause instanceof Error ? cause.message : "Failed to load applications."
  }

  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <JobApplications job={job} applications={applications} error={error} />
      </div>
    </div>
  )
}

export default JobApplicationsPage
