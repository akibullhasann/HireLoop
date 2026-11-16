import { USER_ROLES, type UserRole } from "@/lib/roles"

export type ManagedUser = {
  id: string
  name: string
  email: string
  role: UserRole
  emailVerified: boolean
  premium: boolean
  banned: boolean
  createdAt: string
  updatedAt: string
}

/** Loose shape returned by Better Auth's admin list-users endpoint. */
export type UserRecord = {
  id?: string | null
  _id?: unknown
  name?: string | null
  email?: string | null
  role?: string | null
  emailVerified?: boolean | null
  premium?: boolean | null
  banned?: boolean | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
}

export const userRoleMeta: Record<
  UserRole,
  {
    label: string
    plural: string
    description: string
    badge: string
    dot: string
    text: string
  }
> = {
  seeker: {
    label: "Seeker",
    plural: "Seekers",
    description: "Looking for roles",
    badge: "border-[#60a5fa]/30 bg-[#60a5fa]/[0.14] text-[#60a5fa]",
    dot: "bg-[#60a5fa]",
    text: "text-[#60a5fa]",
  },
  recruiter: {
    label: "Recruiter",
    plural: "Recruiters",
    description: "Hiring talent",
    badge: "border-[#a78bfa]/30 bg-[#a78bfa]/[0.14] text-[#a78bfa]",
    dot: "bg-[#a78bfa]",
    text: "text-[#a78bfa]",
  },
  admin: {
    label: "Admin",
    plural: "Admins",
    description: "Full platform access",
    badge: "border-[#f59e0b]/30 bg-[#f59e0b]/[0.14] text-[#f59e0b]",
    dot: "bg-[#f59e0b]",
    text: "text-[#f59e0b]",
  },
}

export function toUserRole(value?: string | null): UserRole {
  return value && USER_ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : "seeker"
}

function toIsoString(value?: Date | string | null) {
  if (!value) return ""

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

/** Normalises Better Auth/Mongo records into the shape the admin UI expects. */
export function toManagedUser(record: UserRecord): ManagedUser {
  return {
    id: String(record.id ?? record._id ?? ""),
    name: record.name?.trim() ?? "",
    email: record.email?.trim() ?? "",
    role: toUserRole(record.role),
    emailVerified: record.emailVerified === true,
    premium: record.premium === true,
    banned: record.banned === true,
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
  }
}
