"use client"

import * as React from "react"
import Link from "next/link"

import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const inputClassName =
  "h-12 rounded-[12px] border-white/15 bg-white/[0.03] px-4 text-base text-white placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-brand/25 dark:bg-white/[0.03] md:text-base"

function SignInForm() {
  const [status, setStatus] = React.useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    )

    // Collected for the future Better Auth integration.
    console.log("[HireLoop] Sign in form submitted", values)
    setStatus("Form captured — authentication can be wired up here.")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel
            htmlFor="sign-in-email"
            className="font-heading text-sm font-medium text-white"
          >
            Email address
          </FieldLabel>
          <Input
            id="sign-in-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClassName}
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel
              htmlFor="sign-in-password"
              className="font-heading text-sm font-medium text-white"
            >
              Password
            </FieldLabel>
            <span className="font-heading text-xs text-white/40">
              Min. 8 characters
            </span>
          </div>
          <PasswordInput
            id="sign-in-password"
            name="password"
            required
            minLength={8}
            autoComplete="current-password"
            placeholder="Enter your password"
            className={inputClassName}
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="h-12 w-full rounded-[12px] font-cta text-lg font-medium hover:bg-brand/90"
      >
        Sign in
      </Button>

      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-center font-heading text-sm text-brand"
      >
        {status}
      </p>

      <p className="text-center font-heading text-sm text-white/55">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-white underline-offset-4 transition-colors hover:text-brand hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}

export { SignInForm }
