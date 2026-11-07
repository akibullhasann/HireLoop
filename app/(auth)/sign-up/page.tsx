import type { Metadata } from "next"

import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create Account — HireLoop",
  description:
    "Create your HireLoop account to apply to curated roles and connect with world-class companies.",
}

export default function SignUpPage() {
  return (
    <AuthPageShell
      mode="sign-up"
      eyebrow="Get started"
      title="Create your HireLoop account"
      description="Join thousands of candidates and companies hiring smarter."
    >
      <SignUpForm />
    </AuthPageShell>
  )
}
