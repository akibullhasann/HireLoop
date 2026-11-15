import type { Metadata } from "next"

import { ManageJobs } from "@/components/jobs/manage-jobs"
import { getJobs } from "@/lib/api/jobs"
import type { ManagedJob } from "@/lib/jobs"
import { getSession } from "@/lib/core/server"

export const metadata: Metadata = {
  title: "Manage Job Posts — HireLoop",
  description: "Create, review, and keep track of every role you have posted.",
}

export const dynamic = "force-dynamic"

const ManageJobsPage = async () => {
  let jobs: ManagedJob[] = []
  let error: string | null = null

  const session = await getSession();

  try {
    jobs = await getJobs(`recruiterId=${session?.user.id}`)
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load jobs."
  }

  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <ManageJobs jobs={jobs} error={error} />
      </div>
    </div>
  )
}

export default ManageJobsPage
