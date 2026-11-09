export const USER_ROLES = ["seeker", "recruiter", "admin"] as const

export type UserRole = (typeof USER_ROLES)[number]

export type RoleOption = {
  value: UserRole
  label: string
  description: string
}

export const USER_ROLE_OPTIONS: RoleOption[] = [
  { value: "seeker", label: "Job seeker", description: "Looking for roles" },
  { value: "recruiter", label: "Recruiter", description: "Hiring talent" },
  { value: "admin", label: "Admin", description: "Manage the platform" },
]
