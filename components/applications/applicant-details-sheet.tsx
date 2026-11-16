"use client"

import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Laptop,
  Mail,
  MapPin,
  Tags,
} from "lucide-react"

import { ApplicationStatusBadge } from "@/components/applications/application-status-badge"
import { ApplicationStatusSelect } from "@/components/applications/application-status-select"
import { Button, buttonVariants } from "@/components/ui/button"
import { DetailRow } from "@/components/ui/detail-row"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ApplicationStatus, ManagedApplication } from "@/lib/applications"
import { formatDateTime, getInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

type ApplicantDetailsSheetProps = {
  application: ManagedApplication | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (applicationId: string, status: ApplicationStatus) => void
}

/**
 * Side panel with the full application snapshot so a recruiter can review an
 * applicant without leaving the list. Status edits stay in the parent's state.
 */
function ApplicantDetailsSheet({
  application,
  open,
  onOpenChange,
  onStatusChange,
}: ApplicantDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-white/10 bg-[#141418] text-[#ededef] sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/[0.07] px-5 py-5">
          <SheetTitle className="text-[16px] leading-6 font-semibold text-[#ededef]">
            Applicant details
          </SheetTitle>
          <SheetDescription className="text-[12px] leading-5 text-[#a0a0ab]">
            Review this candidate and move them through your hiring pipeline.
          </SheetDescription>
        </SheetHeader>

        {application ? (
          <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-white/[0.07] bg-[#222228] text-[14px] font-semibold text-[#ededef]"
              >
                {getInitials(application.applicantName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] leading-6 font-semibold text-[#ededef]">
                  {application.applicantName || "Unnamed applicant"}
                </p>
                <p className="truncate text-[12px] leading-5 text-[#a0a0ab]">
                  {application.applicantEmail || "No email provided"}
                </p>
              </div>
            </div>

            <div className="rounded-[10px] border border-white/[0.07] bg-[#1a1a1f] p-4">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="applicant-status"
                  className="text-[10px] leading-4 font-medium tracking-[0.14em] text-[#6e6e78] uppercase"
                >
                  Application status
                </label>
                <ApplicationStatusBadge status={application.status} />
              </div>
              <ApplicationStatusSelect
                id="applicant-status"
                value={application.status}
                onChange={(status) => onStatusChange(application.id, status)}
                ariaLabel={`Status for ${application.applicantName}`}
                className="mt-2.5 w-full"
              />
              <p className="mt-2.5 text-[11px] leading-4 text-[#6e6e78]">
                Changes are previewed here until status saving is connected.
              </p>
            </div>

            <div className="space-y-4">
              <DetailRow
                icon={BriefcaseBusiness}
                label="Applied for"
                value={application.jobTitle}
              />
              <DetailRow
                icon={Building2}
                label="Company"
                value={application.company}
              />
              <DetailRow
                icon={CalendarClock}
                label="Applied on"
                value={formatDateTime(application.appliedAt)}
              />
              <DetailRow
                icon={MapPin}
                label="Location"
                value={application.location}
              />
              <DetailRow
                icon={Laptop}
                label="Work mode"
                value={application.workMode}
              />
              <DetailRow
                icon={Tags}
                label="Category"
                value={application.category}
              />
              <DetailRow
                icon={Banknote}
                label="Salary range"
                value={application.salaryRange || "Not specified"}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 px-5 py-10 text-center text-[13px] text-[#a0a0ab]">
            Select an applicant to review their details.
          </div>
        )}

        <SheetFooter className="border-t border-white/[0.07] bg-[#1a1a1f] px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-[8px] border-white/15 bg-white/[0.03] text-[13px] font-medium text-[#ededef] hover:bg-white/[0.06]"
          >
            Close
          </Button>

          {application?.applicantEmail && (
            <a
              href={`mailto:${application.applicantEmail}`}
              className={cn(
                buttonVariants(),
                "h-9 rounded-[8px] bg-brand text-[13px] font-semibold text-white hover:bg-brand/90"
              )}
            >
              <Mail aria-hidden="true" className="mr-2 size-4" />
              Email applicant
            </a>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { ApplicantDetailsSheet }
