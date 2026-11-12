import type { Metadata } from "next"

import { MyApplications } from "@/components/applications/my-applications"
import type { ManagedApplication } from "@/lib/applications"

export const metadata: Metadata = {
  title: "My Applications — HireLoop",
  description:
    "Track your job applications and interview progress in real-time.",
}

export const dynamic = "force-dynamic"

/**
 * Placeholder rows for the UI. Replace with `getApplications(user.id)` once the
 * dashboard is wired to the signed-in seeker.
 */
function createDummyApplications(): ManagedApplication[] {
  const now = Date.now()
  const hoursAgo = (hours: number) =>
    new Date(now - hours * 60 * 60 * 1000).toISOString()

  const applicant = {
    applicantId: "demo-seeker",
    applicantName: "Jordan Lee",
    applicantEmail: "jordan.lee@example.com",
  }

  return [
    {
      ...applicant,
      id: "app-01",
      jobId: "65f1a2b3c4d5e6f708192a01",
      jobTitle: "Senior Frontend Engineer",
      company: "Stark Industries",
      category: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      workMode: "Remote",
      salaryRange: "$140,000 – $180,000",
      status: "applied",
      appliedAt: hoursAgo(2),
      archived: false,
    },
    {
      ...applicant,
      id: "app-02",
      jobId: "65f1a2b3c4d5e6f708192a02",
      jobTitle: "Product Designer",
      company: "Cyberdyne Systems",
      category: "Design",
      location: "Austin, TX",
      employmentType: "Contract",
      workMode: "Hybrid",
      salaryRange: "$95,000 – $120,000",
      status: "review",
      appliedAt: hoursAgo(24),
      archived: false,
    },
    {
      ...applicant,
      id: "app-03",
      jobId: "65f1a2b3c4d5e6f708192a03",
      jobTitle: "Lead Data Scientist",
      company: "Wayne Enterprises",
      category: "Engineering",
      location: "New York, NY",
      employmentType: "Full-time",
      workMode: "On-site",
      salaryRange: "$180,000 – $220,000",
      status: "shortlisted",
      appliedAt: hoursAgo(4 * 24),
      archived: false,
    },
    {
      ...applicant,
      id: "app-04",
      jobId: "65f1a2b3c4d5e6f708192a04",
      jobTitle: "Marketing Director",
      company: "Vanguard",
      category: "Marketing",
      location: "London, UK",
      employmentType: "Full-time",
      workMode: "Hybrid",
      salaryRange: "£90,000 – £110,000",
      status: "interview",
      appliedAt: hoursAgo(3 * 24),
      archived: false,
    },
    {
      ...applicant,
      id: "app-05",
      jobId: "65f1a2b3c4d5e6f708192a05",
      jobTitle: "AI Research Engineer",
      company: "Hooli Corp",
      category: "Engineering",
      location: "Palo Alto, CA",
      employmentType: "Full-time",
      workMode: "Hybrid",
      salaryRange: "$200,000 – $260,000",
      status: "offered",
      appliedAt: hoursAgo(14 * 24),
      archived: false,
    },
    {
      ...applicant,
      id: "app-06",
      jobId: "65f1a2b3c4d5e6f708192a06",
      jobTitle: "Customer Success Manager",
      company: "Umbrella Corp",
      category: "Customer Support",
      location: "Remote",
      employmentType: "Full-time",
      workMode: "Remote",
      salaryRange: "$70,000 – $85,000",
      status: "shortlisted",
      appliedAt: hoursAgo(5 * 24),
      archived: false,
    },
    {
      ...applicant,
      id: "app-07",
      jobId: "65f1a2b3c4d5e6f708192a07",
      jobTitle: "Junior QA Engineer",
      company: "Soylent Corp",
      category: "Engineering",
      location: "Manchester, UK",
      employmentType: "Internship",
      workMode: "On-site",
      salaryRange: "£28,000",
      status: "applied",
      appliedAt: hoursAgo(30 * 24),
      archived: false,
    },
    {
      ...applicant,
      id: "app-08",
      jobId: "65f1a2b3c4d5e6f708192a08",
      jobTitle: "Cloud Architect",
      company: "Oscorp Tech",
      category: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      workMode: "Remote",
      salaryRange: "$160,000 – $200,000",
      status: "rejected",
      appliedAt: hoursAgo(7 * 24),
      archived: true,
    },
    {
      ...applicant,
      id: "app-09",
      jobId: "65f1a2b3c4d5e6f708192a09",
      jobTitle: "Backend Engineer",
      company: "Initech",
      category: "Engineering",
      location: "Berlin, DE",
      employmentType: "Full-time",
      workMode: "Remote",
      salaryRange: "€80,000 – €100,000",
      status: "withdrawn",
      appliedAt: hoursAgo(21 * 24),
      archived: true,
    },
  ]
}

const SeekerApplicationsPage = () => {
  const applications = createDummyApplications()

  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <MyApplications applications={applications} />
      </div>
    </div>
  )
}

export default SeekerApplicationsPage
