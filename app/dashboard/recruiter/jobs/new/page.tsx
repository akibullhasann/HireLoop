import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { NewJobForm } from "@/components/jobs/new-job-form"

export const metadata: Metadata = {
  title: "Post a New Job — HireLoop",
  description: "Create a new job post for your company on HireLoop.",
}

const NewJobPage = () => {
  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-6">
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#a1a4aa] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Manage Jobs
          </Link>
          <h1 className="mt-3 text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Post a New Job
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#a1a4aa]">
            Fill in the role details, then publish it or save it as a draft.
          </p>
        </div>

        <NewJobForm />
      </div>
    </div>
  )
}

export default NewJobPage
