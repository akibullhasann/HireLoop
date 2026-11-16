import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AdminUsers } from "@/components/users/admin-users"
import { getUsers } from "@/lib/api/users"
import { getSession } from "@/lib/core/server"
import { toUserRole } from "@/lib/users"
import type { ManagedUser } from "@/lib/users"

export const metadata: Metadata = {
  title: "User Management — HireLoop",
  description: "Review accounts and manage platform access across HireLoop.",
}

export const dynamic = "force-dynamic"

const AdminUsersPage = async () => {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in?redirectTo=/dashboard/admin/users")
  }

  const role = toUserRole(session.user.role)

  if (role !== "admin") {
    redirect(`/dashboard/${role}`)
  }

  let users: ManagedUser[] = []
  let error: string | null = null

  try {
    users = await getUsers()
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load users."
  }

  return (
    <div className="min-h-svh bg-[#08080a] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <AdminUsers users={users} error={error} />
      </div>
    </div>
  )
}

export default AdminUsersPage
