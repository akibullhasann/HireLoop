"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { submitApplication } from "@/lib/actions/applications"
import type { NewApplication } from "@/lib/applications"
import { useSession } from "@/lib/auth-client"
import type { ManagedJob } from "@/lib/jobs"
import { getApplicationsCount } from "@/lib/api/applications"

type ApplyButtonProps = {
  job: ManagedJob
}

/**
 * One-click apply, per the Figma "Apply Now" action.
 *
 * Signed-out visitors are sent to sign in and returned to this job; recruiters
 * and admins are told to use a seeker account. The whole application snapshot
 * is posted so "My Applications" can render without loading each job again.
 */
function ApplyButton({ job }: ApplyButtonProps) {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = useSession()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleApply() {
    // The session request is still in flight; clicking again will work.
    if (isSessionPending) return

    const user = session?.user

    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job.id}`)
      return
    }

    if (user.role !== "seeker") {
      toast.add({
        title: "Seeker accounts only",
        description:
          "Sign in with a job seeker account to apply for this role.",
      })
      return
    }

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const countResult = await getApplicationsCount(
        `applicantId=${user.id}`
      )

      if (countResult.count >= 10) {
        toast.add({
          title: "Free application limit reached",
          description:
            "You have used your 10 free applications. Please upgrade to continue.",
        })
        // Redirect to payment page
        router.push("/payment")
        return
      }

      const application: NewApplication = {
        applicantId: user.id,
        applicantName: user.name ?? "",
        applicantEmail: user.email ?? "",
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        category: job.category,
        location: job.location,
        employmentType: job.employmentType,
        workMode: job.workMode,
        salaryRange: job.salaryRange,
        status: "applied",
        appliedAt: new Date().toISOString(),
        archived: false,
      }

      const result = await submitApplication(application)

      if (!result.ok) {
        toast.add({ title: "Application not sent", description: result.error })
        return
      }

      toast.add({
        title: "Application sent",
        description: `Your application for ${job.title} at ${job.company} is in.`,
      })
      router.push("/dashboard/seeker/applications")
    } catch {
      toast.add({
        title: "Something went wrong",
        description: "Please try again in a moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={isSubmitting}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#fafafa] px-6 text-[16px] leading-6 font-medium text-[#0b0b0c] shadow-[0_2px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-70"
    >
      {isSubmitting && (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      )}
      {isSubmitting ? "Applying…" : "Apply Now"}
    </button>
  )
}

export { ApplyButton }