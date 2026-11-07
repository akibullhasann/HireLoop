import type { Metadata } from "next"

import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
  description:
    "Sign in to HireLoop to track applications, save roles, and pick up where you left off.",
}

export default function SignInPage() {
  return (
    <AuthPageShell
      mode="sign-in"
      eyebrow="Welcome back"
      title="Sign in to HireLoop"
      description="Pick up where you left off — your next role is waiting."
    >
      <SignInForm />
    </AuthPageShell>
  )
}
