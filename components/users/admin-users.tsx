"use client"

import * as React from "react"
import { Info, Search, UserRoundSearch } from "lucide-react"

import { UserDetailsSheet } from "@/components/users/user-details-sheet"
import { UserRoleSelect } from "@/components/users/user-role-select"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { formatDateTime, formatJobDate, getInitials } from "@/lib/format"
import { USER_ROLES, type UserRole } from "@/lib/roles"
import { userRoleMeta, type ManagedUser } from "@/lib/users"
import { cn } from "@/lib/utils"

const cardClassName =
  "rounded-[12px] border border-white/[0.07] bg-[#141418] shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)]"

const inputClassName =
  "h-[38px] rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none placeholder:text-[#828997] focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f]"

const selectTriggerClassName =
  "h-[38px]! w-full rounded-[8px] border-white/10 bg-[#0c0c0f] px-3 text-[13px] text-[#ededef] shadow-none focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-[#0c0c0f] dark:hover:bg-[#0c0c0f]"

type RoleFilter = "all" | UserRole

const roleOptions: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All roles" },
  ...USER_ROLES.map((role) => ({
    value: role,
    label: userRoleMeta[role].plural,
  })),
]

type StatusTone = "success" | "muted" | "brand" | "danger"

const statusToneClassName: Record<StatusTone, string> = {
  success: "border-[#22c55e]/30 bg-[#22c55e]/[0.12] text-[#22c55e]",
  muted: "border-white/10 bg-white/[0.04] text-[#a0a0ab]",
  brand: "border-brand/35 bg-brand/[0.14] text-[#b4b0ff]",
  danger: "border-red-500/30 bg-red-500/[0.12] text-red-300",
}

function StatusPill({
  tone,
  children,
}: {
  tone: StatusTone
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full border px-2 text-[11px] leading-4 font-medium whitespace-nowrap",
        statusToneClassName[tone]
      )}
    >
      {children}
    </span>
  )
}

function getStats(users: ManagedUser[]) {
  const countByRole = (role: UserRole) =>
    users.filter((user) => user.role === role).length

  return [
    {
      label: "Total users",
      value: String(users.length),
      tone: "text-[#ededef]",
    },
    ...USER_ROLES.map((role) => ({
      label: userRoleMeta[role].plural,
      value: String(countByRole(role)),
      tone: userRoleMeta[role].text,
    })),
  ]
}

type AdminUsersProps = {
  users: ManagedUser[]
  error?: string | null
}

function AdminUsers({ users: initialUsers, error = null }: AdminUsersProps) {
  // Roles come from the server; local overrides keep previews visible until the
  // update endpoint is connected.
  const [roleOverrides, setRoleOverrides] = React.useState<
    Record<string, UserRole>
  >({})
  const [query, setQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>("all")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const users = React.useMemo(
    () =>
      initialUsers.map((user) => {
        const override = roleOverrides[user.id]

        return override && override !== user.role
          ? { ...user, role: override }
          : user
      }),
    [initialUsers, roleOverrides]
  )

  const stats = React.useMemo(() => getStats(users), [users])

  const filteredUsers = React.useMemo(() => {
    const search = query.trim().toLowerCase()

    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false
      }

      if (!search) return true

      return [user.name, user.email].some((value) =>
        value.toLowerCase().includes(search)
      )
    })
  }, [users, query, roleFilter])

  const selectedUser = users.find((user) => user.id === selectedId) ?? null

  function handleRoleChange(userId: string, role: UserRole) {
    // The role update endpoint is not wired yet, so keep the change in local
    // state and tell the admin it is a preview.
    setRoleOverrides((current) => ({ ...current, [userId]: role }))

    const user = initialUsers.find((candidate) => candidate.id === userId)
    if (!user) return

    toast.add({
      type: "info",
      title: "Role change previewed",
      description: `${user.name || user.email} was set to ${userRoleMeta[role].label}. Saving roles will be connected later.`,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
            User management
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#a0a0ab]">
            Review everyone on HireLoop and adjust their platform access.
          </p>
        </div>

        <span className="inline-flex h-8 shrink-0 items-center gap-2 self-start rounded-full border border-white/10 bg-[#141418] px-3 text-[12px] leading-4 text-[#a0a0ab]">
          <span className="size-1.5 rounded-full bg-brand" />
          {users.length} {users.length === 1 ? "account" : "accounts"}
        </span>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-[12px] border border-red-500/25 bg-red-500/10 p-4 text-[13px] leading-5 text-red-200"
        >
          <p className="font-medium">Could not load users.</p>
          <p className="mt-0.5 text-red-200/70">{error}</p>
        </div>
      )}

      {users.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-[10px] border border-brand/20 bg-brand/[0.08] px-3.5 py-3 text-[12px] leading-5 text-[#c7c4ff]">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>
            Role changes are previewed in this view for now. Saving them to the
            database will be connected separately.
          </p>
        </div>
      )}

      <section
        aria-label="User stats"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.label} className={cn(cardClassName, "px-5 py-3")}>
            <p className="text-[13px] leading-5 text-[#a0a0ab]">{stat.label}</p>
            <p
              className={cn(
                "mt-2 text-[26px] leading-8 font-semibold tracking-[-0.02em]",
                stat.tone
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_190px]">
        <div>
          <label
            htmlFor="user-search"
            className="mb-1.5 block text-[13px] text-[#a1a4aa]"
          >
            Search users
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#828997]"
            />
            <Input
              id="user-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email..."
              className={cn(inputClassName, "pl-9")}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="user-role-filter"
            className="mb-1.5 block text-[13px] text-[#a1a4aa]"
          >
            Role
          </label>
          <Select
            value={roleFilter}
            onValueChange={(value) =>
              setRoleFilter((value as RoleFilter) ?? "all")
            }
          >
            <SelectTrigger
              id="user-role-filter"
              className={selectTriggerClassName}
            >
              <SelectValue>
                {(value: string) =>
                  roleOptions.find((option) => option.value === value)?.label ??
                  "All roles"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border border-white/10 bg-[#141418] text-[#ededef] ring-white/10">
              {roleOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="py-1.5 focus:bg-white/[0.06] focus:text-[#ededef]"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className={cn(cardClassName, "overflow-hidden")}>
        {filteredUsers.length > 0 ? (
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="border-white/[0.07] bg-[#1a1a1f] hover:bg-[#1a1a1f]">
                <TableHead className="h-11 px-4 text-[11px] font-medium tracking-normal text-[#6e6e78]">
                  User
                </TableHead>
                <TableHead className="h-11 w-[156px] px-4 text-[11px] font-medium tracking-normal text-[#6e6e78]">
                  Role
                </TableHead>
                <TableHead className="hidden h-11 px-4 text-[11px] font-medium tracking-normal text-[#6e6e78] sm:table-cell">
                  Account
                </TableHead>
                <TableHead className="hidden h-11 px-4 text-[11px] font-medium tracking-normal text-[#6e6e78] lg:table-cell">
                  Joined
                </TableHead>
                <TableHead className="h-11 px-4 text-right text-[11px] font-medium tracking-normal text-[#6e6e78]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/[0.07] hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-[13px]">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full border border-white/[0.07] bg-[#222228] text-[12px] font-semibold text-[#ededef]"
                      >
                        {getInitials(user.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] leading-5 font-medium text-[#ededef]">
                          {user.name || "Unnamed user"}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] leading-4 text-[#a0a0ab]">
                          {user.email || "No email provided"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-[13px]">
                    <UserRoleSelect
                      value={user.role}
                      onChange={(role) => handleRoleChange(user.id, role)}
                      ariaLabel={`Role for ${user.name || user.email}`}
                    />
                  </TableCell>

                  <TableCell className="hidden px-4 py-[13px] sm:table-cell">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusPill
                        tone={user.emailVerified ? "success" : "muted"}
                      >
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </StatusPill>
                      {user.premium && (
                        <StatusPill tone="brand">Pro</StatusPill>
                      )}
                      {user.banned && (
                        <StatusPill tone="danger">Suspended</StatusPill>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="hidden px-4 py-[13px] lg:table-cell">
                    <p
                      className="text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]"
                      title={formatDateTime(user.createdAt)}
                    >
                      {formatJobDate(user.createdAt.slice(0, 10), "—")}
                    </p>
                  </TableCell>

                  <TableCell className="px-4 py-[13px] text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedId(user.id)}
                      className="inline-flex h-8 items-center rounded-[8px] border border-white/[0.07] bg-white/[0.03] px-2.5 text-[12px] leading-4 font-medium text-[#ededef] transition-colors hover:bg-white/[0.07] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      View details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <UserRoundSearch
              aria-hidden="true"
              className="size-8 text-[#6e6e78]"
            />
            <h2 className="mt-2 text-[15px] font-semibold text-[#ededef]">
              {users.length === 0 ? "No users yet" : "No matching users"}
            </h2>
            <p className="max-w-sm text-[13px] leading-5 text-[#a0a0ab]">
              {users.length === 0
                ? "New accounts will show up here as soon as people sign up."
                : "Try a different name, email, or role filter."}
            </p>
          </div>
        )}

        <footer className="border-t border-white/[0.07] bg-[#1a1a1f] px-4 py-3 text-[12px] leading-5 text-[#828997]">
          Showing {filteredUsers.length} of {users.length}{" "}
          {users.length === 1 ? "user" : "users"}
        </footer>
      </section>

      <UserDetailsSheet
        user={selectedUser}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        onRoleChange={handleRoleChange}
      />
    </div>
  )
}

export { AdminUsers }
