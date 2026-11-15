import type { Metadata } from "next"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import logo from "@/app/images/logo.png"
import { CopyButton } from "@/components/payments/copy-button"
import { buttonVariants } from "@/components/ui/button"
import { checkoutVerify } from "@/lib/actions/payment"
import { getSession } from "@/lib/core/server"
import { formatPrice, PRO_PLAN } from "@/lib/payments"
import { stripe } from "@/lib/stripe"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Payment successful — HireLoop",
  description: "Your HireLoop Pro membership is active.",
}

export const dynamic = "force-dynamic"

const cardClassName =
  "rounded-[12px] border border-white/[0.07] bg-[#141418] shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)]"

const paidAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>
}

type DetailRowProps = {
  icon: LucideIcon
  label: string
  value: string
  mono?: boolean
  copy?: boolean
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
  copy = false,
}: DetailRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-[6px] border border-white/[0.07] bg-[#222228]">
        <Icon aria-hidden="true" className="size-4 text-[#a0a0ab]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] leading-4 font-medium tracking-[0.16em] text-[#6e6e78] uppercase">
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 truncate text-[13px] leading-5 text-[#ededef]",
            mono && "font-mono text-[12px] tracking-tight"
          )}
        >
          {value}
        </p>
      </div>
      {copy && <CopyButton value={value} label={label} />}
    </div>
  )
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-[#08080a] text-white">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="HireLoop home">
            <Image src={logo} alt="HireLoop" className="h-7 w-auto" />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#a0a0ab]">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Secure checkout
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1120px] justify-center px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {children}
      </main>
    </div>
  )
}

type ProblemStateProps = {
  title: string
  description: string
  sessionId?: string
  actionHref: string
  actionLabel: string
}

function ProblemState({
  title,
  description,
  sessionId,
  actionHref,
  actionLabel,
}: ProblemStateProps) {
  return (
    <PageShell>
      <section
        className={cn(
          cardClassName,
          "w-full max-w-[560px] p-7 text-center sm:p-10"
        )}
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-amber-400/20 bg-amber-500/10">
          <CircleAlert aria-hidden="true" className="size-7 text-amber-400" />
        </span>
        <h1 className="mt-5 text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-6 text-[#a0a0ab]">
          {description}
        </p>

        {sessionId && (
          <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#1a1a1f] px-4 py-3 text-left">
            <p className="text-[10px] leading-4 font-medium tracking-[0.16em] text-[#6e6e78] uppercase">
              Checkout session
            </p>
            <p className="mt-1 font-mono text-[12px] leading-5 break-all text-[#a0a0ab]">
              {sessionId}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={actionHref}
            className={cn(
              buttonVariants(),
              "h-11 flex-1 rounded-[8px] bg-brand text-[14px] font-semibold text-white hover:bg-brand/90"
            )}
          >
            {actionLabel}
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 flex-1 rounded-[8px] border-white/15 bg-white/[0.03] text-[14px] font-medium text-[#ededef] hover:bg-white/[0.06]"
            )}
          >
            Back to HireLoop
          </Link>
        </div>
      </section>
    </PageShell>
  )
}

const CheckoutSuccessPage = async ({
  searchParams,
}: CheckoutSuccessPageProps) => {
  const { session_id: rawSessionId } = await searchParams
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId

  if (!sessionId) {
    return (
      <ProblemState
        title="No payment session found"
        description="This page needs a Stripe checkout reference. Start a checkout to upgrade to HireLoop Pro."
        actionHref="/payment"
        actionLabel="Go to checkout"
      />
    )
  }

  let session: Awaited<
    ReturnType<typeof stripe.checkout.sessions.retrieve>
  > | null = null

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent", "payment_intent.payment_method"],
    })
  } catch {
    session = null
  }

  if (!session) {
    return (
      <ProblemState
        title="We couldn't find that payment"
        description="That checkout session is invalid or no longer available. If you were charged, keep your Stripe receipt and contact support."
        sessionId={sessionId}
        actionHref="/payment"
        actionLabel="Try checkout again"
      />
    )
  }

  if (session.status === "expired") {
    return (
      <ProblemState
        title="This checkout expired"
        description="The checkout session timed out before it was paid. Start a new checkout to upgrade to HireLoop Pro."
        sessionId={sessionId}
        actionHref="/payment"
        actionLabel="Start a new checkout"
      />
    )
  }

  if (session.payment_status !== "paid") {
    const stillOpen = session.status === "open"

    return (
      <ProblemState
        title={
          stillOpen ? "This checkout is still open" : "Payment not confirmed"
        }
        description={
          stillOpen
            ? "Finish the payment in Stripe to activate HireLoop Pro. You can pick up where you left off from the checkout page."
            : "Stripe hasn't confirmed this payment yet. If you just paid, wait a moment and refresh this page."
        }
        sessionId={sessionId}
        actionHref="/payment"
        actionLabel={stillOpen ? "Return to checkout" : "Refresh checkout"}
      />
    )
  }

  const [userSession, verification] = await Promise.all([
    getSession(),
    checkoutVerify(sessionId),
  ])

  if (!verification.ok) {
    console.error("Failed to verify Stripe checkout session", {
      sessionId,
      error: verification.error,
    })
  }

  const paymentIntent =
    typeof session.payment_intent === "string" ? null : session.payment_intent
  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (paymentIntent?.id ?? null)

  const paymentMethod =
    paymentIntent && typeof paymentIntent.payment_method === "object"
      ? paymentIntent.payment_method
      : null
  const card = paymentMethod?.card
  const cardBrand = card?.brand
    ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1)
    : null
  const paymentMethodLabel = card?.last4
    ? `${cardBrand ?? "Card"} ending in ${card.last4}`
    : paymentMethod?.type === "link"
      ? "Link"
      : "Card"

  const customerEmail =
    session.customer_details?.email ??
    session.customer_email ??
    userSession?.user.email ??
    "your email address"
  const customerName = session.customer_details?.name ?? userSession?.user.name
  const amountPaid =
    session.amount_total != null
      ? formatPrice(session.amount_total / 100)
      : formatPrice(PRO_PLAN.price)
  const paidAt = paidAtFormatter.format(new Date(session.created * 1000))
  const dashboardHref = `/dashboard/${userSession?.user.role ?? "seeker"}`

  return (
    <PageShell>
      <div className="w-full max-w-[640px]">
        <section className={cn(cardClassName, "overflow-hidden")}>
          <div className="relative px-6 pt-10 pb-8 text-center sm:px-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_65%)]"
            />
            <span className="relative mx-auto grid size-16 place-items-center rounded-full border border-emerald-400/20 bg-emerald-500/10">
              <CheckCircle2
                aria-hidden="true"
                className="size-8 text-emerald-400"
              />
            </span>
            <p className="relative mt-5 text-[11px] leading-4 font-semibold tracking-[0.2em] text-emerald-400 uppercase">
              Payment successful
            </p>
            <h1 className="relative mt-3 text-[30px] leading-9 font-semibold tracking-[-0.025em] text-[#ededef] sm:text-[34px] sm:leading-10">
              You&apos;re all set
            </h1>
            <p className="relative mx-auto mt-3 max-w-[440px] text-[14px] leading-6 text-[#a0a0ab]">
              Your {PRO_PLAN.name} membership is active
              {customerName ? `, ${customerName}` : ""}. Unlimited applications
              and premium job insights are ready to use.
            </p>
          </div>

          <div className="border-t border-white/[0.07] bg-[#1a1a1f] px-5 py-6 sm:px-8">
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] leading-4 font-medium tracking-[0.16em] text-[#6e6e78] uppercase">
                  Plan
                </dt>
                <dd className="mt-1 flex items-center gap-2 text-[14px] leading-5 font-medium text-[#ededef]">
                  <Sparkles aria-hidden="true" className="size-4 text-brand" />
                  {PRO_PLAN.name}
                </dd>
              </div>

              <div>
                <dt className="text-[10px] leading-4 font-medium tracking-[0.16em] text-[#6e6e78] uppercase">
                  Amount paid
                </dt>
                <dd className="mt-1 text-[18px] leading-6 font-semibold tracking-[-0.01em] text-[#ededef]">
                  {amountPaid}
                </dd>
              </div>

              <div>
                <dt className="text-[10px] leading-4 font-medium tracking-[0.16em] text-[#6e6e78] uppercase">
                  Payment date
                </dt>
                <dd className="mt-1 text-[14px] leading-5 text-[#ededef]">
                  {paidAt}
                </dd>
              </div>

              <div>
                <dt className="text-[10px] leading-4 font-medium tracking-[0.16em] text-[#6e6e78] uppercase">
                  Payment method
                </dt>
                <dd className="mt-1 flex items-center gap-2 text-[14px] leading-5 text-[#ededef]">
                  <CreditCard
                    aria-hidden="true"
                    className="size-4 text-[#a0a0ab]"
                  />
                  {paymentMethodLabel}
                </dd>
              </div>
            </dl>

            <div className="mt-6 divide-y divide-white/[0.07] rounded-[8px] border border-white/[0.07] bg-[#141418]">
              <DetailRow
                icon={ReceiptText}
                label="Transaction ID"
                value={transactionId ?? "Pending"}
                mono
                copy={Boolean(transactionId)}
              />
              <DetailRow
                icon={Mail}
                label="Receipt email"
                value={customerEmail}
              />
              <DetailRow
                icon={ShieldCheck}
                label="Checkout session"
                value={sessionId}
                mono
                copy
              />
            </div>
          </div>

          {!verification.ok && (
            <div className="border-t border-white/[0.07] px-5 py-5 sm:px-8">
              <div className="flex items-start gap-3 rounded-[8px] border border-amber-400/20 bg-amber-500/10 p-4">
                <CircleAlert
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-amber-400"
                />
                <div>
                  <p className="text-[13px] leading-5 font-medium text-amber-200">
                    Membership activation is pending
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-amber-200/70">
                    Your payment went through, but we couldn&apos;t activate
                    your membership automatically. Refresh this page or contact
                    support with the transaction ID above.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-6 sm:flex-row sm:px-8">
            <Link
              href={dashboardHref}
              className={cn(
                buttonVariants(),
                "h-11 flex-1 rounded-[8px] bg-brand text-[14px] font-semibold text-white hover:bg-brand/90"
              )}
            >
              Go to dashboard
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
            <Link
              href="/browse-jobs"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 flex-1 rounded-[8px] border-white/15 bg-white/[0.03] text-[14px] font-medium text-[#ededef] hover:bg-white/[0.06]"
              )}
            >
              Browse jobs
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-[12px] leading-5 text-[#6e6e78]">
          Payment processed securely by Stripe. Keep your transaction ID for
          your records.
        </p>
      </div>
    </PageShell>
  )
}

export default CheckoutSuccessPage
