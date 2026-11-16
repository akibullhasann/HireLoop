"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { USER_ROLES, type UserRole } from "@/lib/roles"
import { userRoleMeta } from "@/lib/users"
import { cn } from "@/lib/utils"

const triggerClassName =
  "h-8! w-[132px] rounded-full border-white/10 bg-[#0c0c0f] pr-2 pl-2.5 text-[12px] font-medium text-[#ededef] shadow-none focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f] dark:hover:bg-[#16161c]"

type UserRoleSelectProps = {
  value: UserRole
  onChange: (role: UserRole) => void
  id?: string
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * Compact role picker shown in every row of the admin users table.
 *
 * The caller owns the value so role persistence can be connected later without
 * changing this control.
 */
function UserRoleSelect({
  value,
  onChange,
  id,
  disabled = false,
  className,
  ariaLabel = "User role",
}: UserRoleSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as UserRole)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn(triggerClassName, className)}
      >
        <SelectValue>
          {(current: string) => {
            const meta = userRoleMeta[current as UserRole]

            return (
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    meta?.dot ?? userRoleMeta.seeker.dot
                  )}
                />
                {meta?.label ?? userRoleMeta.seeker.label}
              </span>
            )
          }}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="border border-white/10 bg-[#141418] text-[#ededef] ring-white/10">
        {USER_ROLES.map((role) => {
          const meta = userRoleMeta[role]

          return (
            <SelectItem
              key={role}
              value={role}
              className="py-1.5 focus:bg-white/[0.06] focus:text-[#ededef]"
            >
              <span className="flex items-center gap-2">
                <span className={cn("size-1.5 rounded-full", meta.dot)} />
                {meta.label}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export { UserRoleSelect }
