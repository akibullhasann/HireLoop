import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { JobDetail } from "@/components/jobs/job-detail"
import { getJob } from "@/lib/api/jobs"
import type { ManagedJob } from "@/lib/jobs"

export const dynamic = "force-dynamic"

type JobDetailsPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const job = await getJob(id)

    if (!job) return { title: "Job not found | HireLoop" }

    return {
      title: `${job.title} at ${job.company} | HireLoop`,
      description:
        job.description ||
        `View the ${job.title} role at ${job.company} on HireLoop.`,
    }
  } catch {
    return { title: "Job Details | HireLoop" }
  }
}

function JobDetailsError({ message }: { message: string }) {
  return (
    <main className="min-h-svh bg-[#08080a] px-5 pt-6 pb-24 text-white sm:px-6 sm:pt-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div
          role="alert"
          className="flex gap-3 rounded-[12px] border border-red-500/25 bg-red-500/10 p-5 text-[13px] text-red-200"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">We could not load this job.</p>
            <p className="mt-1 text-red-200/70">{message}</p>
            <Link
              href="/browse-jobs"
              className="mt-3 inline-block font-medium text-white underline underline-offset-4"
            >
              Back to browse jobs
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params

  let job: ManagedJob | null = null
  let error: string | null = null

  try {
    job = await getJob(id)
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load the job."
  }

  if (error) return <JobDetailsError message={error} />

  // Only published roles are part of the public job board.
  if (!job || job.status !== "active") notFound()

  return (
    <main className="min-h-svh bg-[#08080a] pb-24 text-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <JobDetail job={job} />
      </div>
    </main>
  )
}
