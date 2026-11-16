import { userRoleMeta } from "@/lib/users"
import type { UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

type UserRoleBadgeProps = {
  role: UserRole
  className?: string
}

/** Colour-coded pill that shows a user's platform role. */
function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const meta = userRoleMeta[role]

  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2 text-[12px] leading-4 font-medium whitespace-nowrap",
        meta.badge,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}

export { UserRoleBadge }
