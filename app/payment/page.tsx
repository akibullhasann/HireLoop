import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { Checkout } from "@/components/payments/checkout"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Checkout — HireLoop",
  description: "Upgrade to HireLoop Pro and keep applying without limits.",
}

export const dynamic = "force-dynamic"

type PaymentPageProps = {
  searchParams: Promise<{ canceled?: string | string[] }>
}

const PaymentPage = async ({ searchParams }: PaymentPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in?redirectTo=/payment")
  }

  const { canceled } = await searchParams
  const wasCanceled = Array.isArray(canceled)
    ? canceled.includes("true")
    : canceled === "true"

  return (
    <Checkout
      backHref={`/dashboard/${session.user.role}`}
      email={session.user.email}
      name={session.user.name ?? ""}
      canceled={wasCanceled}
    />
  )
}

export default PaymentPage
