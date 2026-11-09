"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const inputClassName =
  "h-12 rounded-[12px] border-white/15 bg-white/[0.03] px-4 text-base text-white placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-white/[0.03] md:text-base"

type FormStatus = {
  type: "error" | "success"
  message: string
}

const roleOptions = [
  { value: "seeker", label: "Job seeker", description: "Looking for roles" },
  { value: "recruiter", label: "Recruiter", description: "Hiring talent" },
  { value: "admin", label: "Admin", description: "Manage the platform" },
] as const

type Role = (typeof roleOptions)[number]["value"]
function SignUpForm() {
  const router = useRouter()
  const [status, setStatus] = React.useState<FormStatus | null>(null)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()


    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())

    if (values.password !== values.confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match. Please try again.",
      })
      return
    }
    const role: Role =
      roleOptions.find((o) => o.value === values.role)?.value ?? "seeker"

    setPending(true)
    setStatus(null)

    try {
      const { error } = await authClient.signUp.email({
        name: String(values.name),
        email: String(values.email),
        password: String(values.password),
        role,
        callbackURL: "/",
      })

      if (error) {
        setStatus({
          type: "error",
          message:
            error.message ?? "Could not create your account. Please try again.",
        })
        return
      }

      setStatus({ type: "success", message: "Account created. Redirecting…" })
      router.push("/")
      router.refresh()
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel
            htmlFor="sign-up-name"
            className="font-heading text-sm font-medium text-white"
          >
            Full name
          </FieldLabel>
          <Input
            id="sign-up-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className={inputClassName}
          />
        </Field>
        <Field>
          <FieldLabel className="font-heading text-sm font-medium text-white">
            I am a
          </FieldLabel>
          <div role="radiogroup" className="grid gap-3 sm:grid-cols-3">
            {roleOptions.map((option, index) => (
              <label
                key={option.value}
                className="cursor-pointer rounded-[12px] border border-white/15 bg-white/[0.03] p-3 transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/25"
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  defaultChecked={index === 0}
                  required
                  className="sr-only"
                />
                <span className="block font-heading text-sm font-medium text-white">
                  {option.label}
                </span>
                <span className="block text-xs text-white/55">
                  {option.description}
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Field>
          <FieldLabel
            htmlFor="sign-up-email"
            className="font-heading text-sm font-medium text-white"
          >
            Email address
          </FieldLabel>
          <Input
            id="sign-up-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClassName}
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="sign-up-password"
            className="font-heading text-sm font-medium text-white"
          >
            Password
          </FieldLabel>
          <PasswordInput
            id="sign-up-password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Create a password"
            className={inputClassName}
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="sign-up-confirm-password"
            className="font-heading text-sm font-medium text-white"
          >
            Confirm password
          </FieldLabel>
          <PasswordInput
            id="sign-up-confirm-password"
            name="confirmPassword"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className={inputClassName}
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-[12px] font-cta text-lg font-medium hover:bg-brand/90 disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-5 text-center font-heading text-sm",
          status?.type === "error" ? "text-red-400" : "text-brand"
        )}
      >
        {status?.message}
      </p>

      <p className="text-center font-heading text-sm text-white/55">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-white underline-offset-4 transition-colors hover:text-brand hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

export { SignUpForm }
