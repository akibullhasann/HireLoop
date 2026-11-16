"use client"

import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Mail,
  RefreshCw,
  ShieldCheck,
  ShieldX,
} from "lucide-react"

import { UserRoleBadge } from "@/components/users/user-role-badge"
import { UserRoleSelect } from "@/components/users/user-role-select"
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
import { formatDateTime, getInitials } from "@/lib/format"
import type { UserRole } from "@/lib/roles"
import type { ManagedUser } from "@/lib/users"
import { cn } from "@/lib/utils"

type UserDetailsSheetProps = {
  user: ManagedUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoleChange: (userId: string, role: UserRole) => void
}

/**
 * Side panel with the full account record so an admin can review a user
 * without leaving the table. Role edits stay in the parent's state.
 */
function UserDetailsSheet({
  user,
  open,
  onOpenChange,
  onRoleChange,
}: UserDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-white/10 bg-[#141418] text-[#ededef] sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/[0.07] px-5 py-5">
          <SheetTitle className="text-[16px] leading-6 font-semibold text-[#ededef]">
            User details
          </SheetTitle>
          <SheetDescription className="text-[12px] leading-5 text-[#a0a0ab]">
            Review this account and adjust their platform access.
          </SheetDescription>
        </SheetHeader>

        {user ? (
          <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-white/[0.07] bg-[#222228] text-[14px] font-semibold text-[#ededef]"
              >
                {getInitials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] leading-6 font-semibold text-[#ededef]">
                  {user.name || "Unnamed user"}
                </p>
                <p className="truncate text-[12px] leading-5 text-[#a0a0ab]">
                  {user.email || "No email provided"}
                </p>
              </div>
              <UserRoleBadge role={user.role} className="ml-auto shrink-0" />
            </div>

            <div className="rounded-[10px] border border-white/[0.07] bg-[#1a1a1f] p-4">
              <label
                htmlFor="user-role"
                className="text-[10px] leading-4 font-medium tracking-[0.14em] text-[#6e6e78] uppercase"
              >
                Platform role
              </label>
              <UserRoleSelect
                id="user-role"
                value={user.role}
                onChange={(role) => onRoleChange(user.id, role)}
                ariaLabel={`Role for ${user.name || user.email}`}
                className="mt-2.5 w-full"
              />
              <p className="mt-2.5 text-[11px] leading-4 text-[#6e6e78]">
                Changes are previewed here until role saving is connected.
              </p>
            </div>

            <div className="space-y-4">
              <DetailRow icon={Mail} label="Email" value={user.email} />
              <DetailRow
                icon={CalendarClock}
                label="Joined"
                value={formatDateTime(user.createdAt)}
              />
              <DetailRow
                icon={RefreshCw}
                label="Last updated"
                value={formatDateTime(user.updatedAt)}
              />
              <DetailRow
                icon={user.emailVerified ? ShieldCheck : ShieldX}
                label="Email verification"
                value={user.emailVerified ? "Verified" : "Not verified"}
              />
              <DetailRow
                icon={BadgeCheck}
                label="Account"
                value={user.banned ? "Suspended" : "Active"}
              />
              <DetailRow
                icon={CreditCard}
                label="Plan"
                value={user.premium ? "HireLoop Pro" : "Free"}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 px-5 py-10 text-center text-[13px] text-[#a0a0ab]">
            Select a user to review their account.
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

          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className={cn(
                buttonVariants(),
                "h-9 rounded-[8px] bg-brand text-[13px] font-semibold text-white hover:bg-brand/90"
              )}
            >
              <Mail aria-hidden="true" className="mr-2 size-4" />
              Email user
            </a>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { UserDetailsSheet }
