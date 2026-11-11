"use client"

import * as React from "react"
import { CheckCircle2, Sparkles } from "lucide-react"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createJob } from "@/lib/actions/jobs"
import type { JobSubmission, NewJob } from "@/lib/jobs"
import { toast } from "@/components/ui/toast"

const categories = [
  "Design",
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "Customer Support",
  "Other",
]

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"]

const workModes = ["On-site", "Remote", "Hybrid"]

const experienceLevels = [
  "Entry level",
  "Mid level",
  "Senior level",
  "Lead / Executive",
]

const cardClassName =
  "rounded-[12px] border border-white/7 bg-[#141418] p-6 shadow-none"

const labelClassName = "text-[13px] font-normal text-[#ededef]"

const inputClassName =
  "h-[46px] rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f] dark:disabled:bg-[#0c0c0f]/60"

const selectTriggerClassName =
  "h-[46px]! w-full rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f] dark:hover:bg-[#0c0c0f]"

const textareaClassName =
  "min-h-32 resize-y rounded-[12px] border-white/10 bg-[#1a1a1f] px-3 py-3 text-[13px] leading-5 text-[#ededef] shadow-none placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#1a1a1f]"

function readForm(
  form: HTMLFormElement,
  submitter: HTMLElement | null
): JobSubmission {
  const data = new FormData(form, submitter)
  const value = (key: string) => String(data.get(key) ?? "").trim()

  const job: NewJob = {
    title: value("title"),
    company: value("company"),
    category: value("category"),
    location: value("location"),
    employmentType: value("employmentType"),
    workMode: value("workMode"),
    experienceLevel: value("experienceLevel"),
    salaryRange: value("salaryRange"),
    deadline: value("deadline"),
    description: value("description"),
    responsibilities: value("responsibilities"),
    requirements: value("requirements"),
  }

  return {
    ...job,
    status: value("status") === "draft" ? "draft" : "published",
  }
}

function NewJobForm() {
  const [submitted, setSubmitted] = React.useState<JobSubmission | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const submitter = (event.nativeEvent as SubmitEvent).submitter
    const job = readForm(event.currentTarget, submitter)

    // This is the single place where the form data is collected, so it can be
    // wired to an API later without touching the individual fields.
    console.log("New job:", job)
    setSubmitted(job)
    const result = await createJob(job)
    console.log("created job", result)

    if(result.insertedId){
      toast.add({
        title:'job has been created',
        description: 'the job has been suceesfully created'
      })
      router.push('/dashboard/recruiter/jobs')
    }
    
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div className="flex min-w-0 flex-col gap-6">
        {submitted && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-[12px] border border-emerald-500/30 bg-emerald-500/10 p-4 text-[13px] text-emerald-100"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
            <div>
              <p className="font-medium">
                &ldquo;{submitted.title}&rdquo;{" "}
                {submitted.status === "draft"
                  ? "was saved as a draft."
                  : "is ready to be published."}
              </p>
              <p className="text-emerald-100/70">
                {Object.keys(submitted).length} fields collected. The payload is
                available in the browser console.
              </p>
            </div>
          </div>
        )}

        <section className={cardClassName}>
          <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Job Basics
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-[#a1a4aa]">
            Start with the details candidates see first.
          </p>

          <FieldGroup className="mt-6">
            <Field>
              <FieldLabel htmlFor="title" className={labelClassName}>
                Job title <span className="text-brand">*</span>
              </FieldLabel>
              <Input
                id="title"
                name="title"
                required
                autoComplete="off"
                placeholder="e.g. Senior Product Designer"
                className={inputClassName}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="company" className={labelClassName}>
                  Company <span className="text-brand">*</span>
                </FieldLabel>
                <Input
                  id="company"
                  name="company"
                  required
                  autoComplete="organization"
                  placeholder="Company name"
                  className={inputClassName}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category" className={labelClassName}>
                  Category
                </FieldLabel>
                <Select name="category" defaultValue="Design">
                  <SelectTrigger
                    id="category"
                    className={selectTriggerClassName}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="location" className={labelClassName}>
                Location <span className="text-brand">*</span>
              </FieldLabel>
              <Input
                id="location"
                name="location"
                required
                autoComplete="address-level2"
                placeholder="e.g. Berlin, Germany or Remote"
                className={inputClassName}
              />
              <FieldDescription className="text-[12px] text-[#828997]">
                Use the city and country, or the region candidates can work
                from.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </section>

        <section className={cardClassName}>
          <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Employment Details
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-[#a1a4aa]">
            Help candidates understand the commitment and compensation.
          </p>

          <FieldGroup className="mt-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="employmentType" className={labelClassName}>
                  Employment type
                </FieldLabel>
                <Select name="employmentType" defaultValue="Full-time">
                  <SelectTrigger
                    id="employmentType"
                    className={selectTriggerClassName}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="workMode" className={labelClassName}>
                  Work mode
                </FieldLabel>
                <Select name="workMode" defaultValue="On-site">
                  <SelectTrigger
                    id="workMode"
                    className={selectTriggerClassName}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="experienceLevel"
                  className={labelClassName}
                >
                  Experience
                </FieldLabel>
                <Select name="experienceLevel" defaultValue="Mid level">
                  <SelectTrigger
                    id="experienceLevel"
                    className={selectTriggerClassName}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="salaryRange" className={labelClassName}>
                  Salary range
                </FieldLabel>
                <Input
                  id="salaryRange"
                  name="salaryRange"
                  placeholder="e.g. $80,000 – $120,000"
                  className={inputClassName}
                />
                <FieldDescription className="text-[12px] text-[#828997]">
                  Optional, but roles with a range get more applications.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="deadline" className={labelClassName}>
                  Application deadline
                </FieldLabel>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className={inputClassName}
                />
              </Field>
            </div>
          </FieldGroup>
        </section>

        <section className={cardClassName}>
          <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Description &amp; Requirements
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-[#a1a4aa]">
            Give candidates enough detail to decide if the role fits.
          </p>

          <FieldGroup className="mt-6">
            <Field>
              <FieldLabel htmlFor="description" className={labelClassName}>
                Job description <span className="text-brand">*</span>
              </FieldLabel>
              <Textarea
                id="description"
                name="description"
                required
                rows={6}
                placeholder="Describe the role, the team, and what success looks like."
                className={textareaClassName}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="responsibilities" className={labelClassName}>
                Responsibilities
              </FieldLabel>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                rows={4}
                placeholder="One responsibility per line."
                className={textareaClassName}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="requirements" className={labelClassName}>
                Requirements
              </FieldLabel>
              <Textarea
                id="requirements"
                name="requirements"
                rows={4}
                placeholder="One requirement per line."
                className={textareaClassName}
              />
            </Field>
          </FieldGroup>
        </section>
      </div>

      <aside className="flex flex-col gap-6 xl:sticky xl:top-6">
        <section className={cardClassName}>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand" />
            <h2 className="text-base font-semibold text-[#ededef]">
              Ready to publish?
            </h2>
          </div>
          <p className="mt-2 text-[13px] leading-5 text-[#a1a4aa]">
            Published jobs go live immediately. Save a draft to keep working on
            it privately.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <Button
              type="submit"
              name="status"
              value="published"
              className="h-11 rounded-[8px] bg-brand text-sm font-semibold text-white hover:bg-brand/90"
            >
              Publish job
            </Button>
            <Button
              type="submit"
              name="status"
              value="draft"
              variant="outline"
              className="h-11 rounded-[8px] border-white/10 bg-[#1a1a1f] text-sm font-medium text-[#ededef] hover:bg-[#222228] hover:text-white"
            >
              Save as draft
            </Button>
          </div>

          <div className="mt-5 border-t border-white/7 pt-4">
            <p className="text-[12px] font-medium tracking-[0.08em] text-[#828997] uppercase">
              Tips for a strong post
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[13px] leading-5 text-[#a1a4aa]">
              {[
                "Lead with a clear, searchable title.",
                "Add a salary range to build trust.",
                "Keep requirements to the essentials.",
              ].map((tip) => (
                <li key={tip} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#22c55e]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </aside>
    </form>
  )
}

export { NewJobForm }
