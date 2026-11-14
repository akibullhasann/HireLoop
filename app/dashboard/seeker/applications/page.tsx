
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { MyApplications } from "@/components/applications/my-applications"
import { getApplications } from "@/lib/api/applications"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "My Applications — HireLoop",
  description:
    "Track your job applications and interview progress in real-time.",
}

export const dynamic = "force-dynamic"

const SeekerApplicationsPage = async () => {

  // Get Better Auth session from server
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Check authentication
  if (!session) {
    redirect("/sign-in")
  }

 

  // 
  const applications = await getApplications(`applicantId=${session?.user.id}`)

  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <MyApplications applications={applications} />
      </div>
    </div>
  )
}

export default SeekerApplicationsPage
