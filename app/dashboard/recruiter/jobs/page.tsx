import type { Metadata } from "next"

import { ManageJobs } from "@/components/jobs/manage-jobs"

export const metadata: Metadata = {
  title: "Manage Job Posts — HireLoop",
  description: "Create, review, and keep track of every role you have posted.",
}

const ManageJobsPage = () => {
  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <ManageJobs />
      </div>
    </div>
  )
}

export default ManageJobsPage
