"use server"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { toManagedUser, type ManagedUser, type UserRecord } from "@/lib/users"

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:5000"

/** Loads every user for the admin users table, newest accounts first. */
export async function getUsers(): Promise<ManagedUser[]> {
  const result = await auth.api.listUsers({
    query: {
      limit: 1000,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await headers(),
  })

  return result.users.map((user) =>
    toManagedUser(user as unknown as UserRecord)
  )
}

export async function getUserPremiumById(userId: string) {
  const response = await fetch(`${BASE_URL}/users/${userId}/premium`)
  return response.json()
}
