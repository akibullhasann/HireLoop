'use client'


import {
  BadgeCheck,
  Bookmark,
  Briefcase,
  Layers,
  MapPin,
  Wallet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { formatJobDate } from "@/lib/format"
import type { ManagedJob } from "@/lib/jobs"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { applyToAJob } from "@/lib/actions/applications"

type JobDetailProps = {
  job: ManagedJob
}

const cardClassName =
  "rounded-[12px] border border-white/[0.07] bg-[#141418] shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)]"

const sectionHeadingClassName =
  "font-heading text-[22px] leading-7 font-semibold text-[#ededef]"

const bodyTextClassName = "text-[13px] leading-5 text-[#a0a0ab]"

function initialOf(value: string) {
  return value.trim().charAt(0).toUpperCase() || "?"
}

/** Turns a textarea value into one entry per non-empty line. */
function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}

type InfoCardProps = {
  icon: LucideIcon
  label: string
  value: string
}

/** One cell of the "Bento Info Grid". */
function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className={cn(cardClassName, "p-5 sm:px-[25px] sm:py-[26px]")}>
      <Icon aria-hidden="true" className="size-5 text-[#c4c7c8]" />
      <p className="mt-3 text-[13px] leading-5 font-medium tracking-[-0.005em] text-[#a0a0ab] uppercase">
        {label}
      </p>
      <p className="mt-1 text-[16px] leading-6 font-semibold text-[#ededef]">
        {value}
      </p>
    </div>
  )
}

/** Bulleted text used by the Responsibilities and Requirements sections. */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-[7px] size-1.5 shrink-0 rounded-full bg-white"
          />
          <span className={bodyTextClassName}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Figma "Public / Job Details".
 *
 * The frame's company metadata (logo, size, industry, website) and benefits are
 * not part of `ManagedJob`, so the aside falls back to the facts the API does
 * provide and the content sections are only rendered when they have data.
 */
function JobDetail({ job }: JobDetailProps) {

  const router = useRouter();
  const {data:session} = useSession();
  const user = session?.user

  const handleApplyNow = async() =>{
    if(!user){
      router.push(`/sign-in?redirectTo=/browse-jobs/${job.id}`)
      return
    }
    else if(user.role==='seeker'){
      // TODO: Only send jobId and userId or email address for the application //
 
      const application = {
        jobId: job.id ,
        userId: user.id,
        email: user.email,
        jobTitle: job.title,
        companyName: job.company
      }
      const result = await applyToAJob(application);
      if(result.insertedId){
        console.log("Application has been submitted succesfully");
        router.push('/browse-jobs')
      }
    }
    else{
      console.log('user is not a seeker of the job')
    }
  }




  const initial = initialOf(job.company || job.title)
  const responsibilities = splitLines(job.responsibilities)
  const requirements = splitLines(job.requirements)

  const infoCards = [
    { label: "Salary range", icon: Wallet, value: job.salaryRange },
    { label: "Location", icon: MapPin, value: job.location },
    { label: "Job type", icon: Briefcase, value: job.employmentType },
    { label: "Experience", icon: Layers, value: job.experienceLevel },
  ].filter((card) => card.value)

  const companyFacts = [
    { label: "Location", value: job.location },
    { label: "Category", value: job.category },
    { label: "Work mode", value: job.workMode },
    {
      label: "Apply by",
      value: job.deadline ? formatJobDate(job.deadline, "") : "",
    },
    {
      label: "Posted",
      value: job.postedAt ? formatJobDate(job.postedAt, "") : "",
    },
  ].filter((fact) => fact.value)

  return (
    <div className="flex flex-col">
      <header
        className={cn(cardClassName, "relative overflow-hidden p-5 sm:p-8")}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-8 size-64 rounded-full bg-white/[0.04] blur-3xl"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-5 sm:gap-6">
            <span
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-[12px] border border-white/[0.07] bg-[#1a1a1f] font-heading text-2xl font-semibold text-[#ededef] sm:size-20"
            >
              {initial}
            </span>

            <div className="min-w-0">
              <h1 className="font-heading text-[26px] leading-9 font-semibold tracking-[-0.025em] text-[#ededef] sm:text-[32px] sm:leading-10">
                {job.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-[18px] leading-7 font-semibold text-[#a0a0ab] sm:text-[22px]">
                  {job.company}
                </span>

                <span
                  aria-hidden="true"
                  className="size-1 rounded-full bg-[#8e9192]"
                />

                <span className="inline-flex items-center gap-1.5 text-[16px] leading-7 font-semibold text-[#22c55e]">
                  <BadgeCheck aria-hidden="true" className="size-4" />
                  Open role
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label={`Save ${job.title}`}
              className="grid size-12 place-items-center rounded-[8px] border border-white/[0.07] bg-[#222228] text-[#e5e2e3] transition-colors hover:bg-[#2b2b32]"
            >
              <Bookmark aria-hidden="true" className="size-[18px]" />
            </button>

            <button
              onClick={handleApplyNow}
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#fafafa] px-6 text-[16px] leading-6 font-medium text-[#0b0b0c] shadow-[0_2px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white"
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_397px]">
        <div className="flex min-w-0 flex-col gap-6">
          {infoCards.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {infoCards.map((card) => (
                <InfoCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                />
              ))}
            </div>
          )}

          <section className={cn(cardClassName, "p-6 sm:p-8")}>
            <h2 className={sectionHeadingClassName}>Job Description</h2>
            <p className={cn(bodyTextClassName, "mt-4")}>
              {job.description ||
                "This employer has not added a full description for this role yet."}
            </p>

            {responsibilities.length > 0 && (
              <section className="mt-7 border-t border-white/[0.07] pt-7">
                <h2 className={sectionHeadingClassName}>Responsibilities</h2>
                <BulletList items={responsibilities} />
              </section>
            )}

            {requirements.length > 0 && (
              <section className="mt-7 border-t border-white/[0.07] pt-7">
                <h2 className={sectionHeadingClassName}>Requirements</h2>
                <BulletList items={requirements} />
              </section>
            )}
          </section>
        </div>

        <aside
          aria-labelledby="company-overview-heading"
          className={cn(cardClassName, "p-6 lg:sticky lg:top-28")}
        >
          <h2 id="company-overview-heading" className={sectionHeadingClassName}>
            Company Overview
          </h2>

          <div className="mt-5 h-[204px] overflow-hidden rounded-[12px] border border-white/[0.07] bg-[linear-gradient(135deg,#232330,#0c0c0f)]">
            <div className="grid h-full place-items-center">
              <span
                aria-hidden="true"
                className="font-heading text-6xl font-semibold text-white/10"
              >
                {initial}
              </span>
            </div>
          </div>

          {companyFacts.length > 0 && (
            <dl className="mt-5 flex flex-col">
              {companyFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-4 border-t border-white/[0.07] py-3"
                >
                  <dt className="text-[13px] leading-5 text-[#a0a0ab] uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-right text-[16px] leading-6 text-[#ededef]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </aside>
      </div>
    </div>
  )
}

export { JobDetail }
