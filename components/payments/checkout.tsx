"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"

import logo from "@/app/images/logo.png"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { formatPrice, PRO_PLAN } from "@/lib/payments"
import { cn } from "@/lib/utils"

const cardClassName =
  "rounded-[12px] border border-white/[0.07] bg-[#141418] shadow-[0_2px_2px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.03)]"

const cardBrands = ["Visa", "Mastercard", "Amex", "Discover"]

type CheckoutProps = {
  backHref: string
  email: string
  name: string
}

/**
 * Checkout summary and payment stub.
 *
 * The Pay button intentionally stops at a toast for now. When Stripe is wired
 * up, create a Checkout Session on the server and redirect to its URL here.
 */
function Checkout({ backHref, email, name }: CheckoutProps) {
  const total = formatPrice(PRO_PLAN.price)

  function handlePay() {
    // TODO: replace with a redirect to the Stripe Checkout Session URL.
    toast.add({
      title: "Stripe Checkout is coming soon",
      description: "Payments are not connected yet. You have not been charged.",
    })
  }

  return (
    <div className="min-h-svh bg-[#08080a] pb-24 text-white">
      <header className="border-b border-white/[0.07]">
        <div className="relative mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <Link
            href={backHref}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-9 gap-2 rounded-[8px] px-3 text-[13px] text-[#a0a0ab] hover:bg-white/[0.06] hover:text-[#ededef]"
            )}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Link>

          <Link
            href="/"
            aria-label="HireLoop home"
            className="absolute left-1/2 hidden -translate-x-1/2 sm:block"
          >
            <Image src={logo} alt="HireLoop" className="h-7 w-auto" />
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#a0a0ab]">
            <LockKeyhole aria-hidden="true" className="size-3.5" />
            Secure checkout
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] px-5 pt-10 sm:px-6 lg:px-8">
        <div className="max-w-[620px]">
          <p className="text-[11px] leading-4 font-medium tracking-[0.2em] text-[#6e6e78] uppercase">
            {PRO_PLAN.name}
          </p>
          <h1 className="mt-3 text-[32px] leading-10 font-semibold tracking-[-0.025em] text-[#ededef]">
            Complete your payment
          </h1>
          <p className="mt-2 text-[15px] leading-6 text-[#a0a0ab]">
            Upgrade to {PRO_PLAN.name} and keep applying without limits.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <section
            aria-labelledby="order-summary-heading"
            className={cn(cardClassName, "overflow-hidden")}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <span className="inline-flex h-[21px] items-center rounded-[4px] bg-white px-2 text-[11px] leading-4 font-medium tracking-[0.16em] text-[#6e6e78] uppercase">
                    Pro plan
                  </span>
                  <h2
                    id="order-summary-heading"
                    className="mt-4 text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]"
                  >
                    {PRO_PLAN.name}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-5 text-[#a0a0ab]">
                    {PRO_PLAN.tagline}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
                    {total}
                  </p>
                  <p className="text-[13px] leading-5 text-[#a0a0ab]">
                    /{PRO_PLAN.interval}
                  </p>
                </div>
              </div>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {PRO_PLAN.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-[13px] leading-5 text-[#ededef]"
                  >
                    <Check
                      aria-hidden="true"
                      className="size-4 shrink-0 text-[#22c55e]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/[0.07] bg-[#1a1a1f] px-6 py-5">
              <dl className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4 text-[13px] leading-5">
                  <dt className="text-[#a0a0ab]">Pro plan (monthly)</dt>
                  <dd className="text-[#ededef]">{total}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 text-[13px] leading-5">
                  <dt className="text-[#a0a0ab]">Taxes</dt>
                  <dd className="text-[#ededef]">{formatPrice(0)}</dd>
                </div>
                <div className="mt-1 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                  <dt className="text-[14px] font-medium text-[#ededef]">
                    Due today
                  </dt>
                  <dd className="text-[18px] leading-6 font-semibold text-[#ededef]">
                    {total}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-[12px] leading-4 text-[#6e6e78]">
                Billed monthly. Cancel anytime.
              </p>
            </div>
          </section>

          <section aria-labelledby="payment-heading" className={cardClassName}>
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-6 py-5">
              <h2
                id="payment-heading"
                className="text-[18px] leading-7 font-semibold text-[#ededef]"
              >
                Payment information
              </h2>
              <span className="shrink-0 rounded-[4px] border border-white/[0.07] px-2 py-1 text-[10px] leading-3 font-medium tracking-[0.14em] text-[#6e6e78] uppercase">
                Secure by Stripe
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] leading-4 font-medium tracking-[0.14em] text-[#6e6e78] uppercase">
                    Billed to
                  </p>
                  <p className="mt-2 truncate text-[14px] leading-5 font-medium text-[#ededef]">
                    {name || "HireLoop member"}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] leading-5 text-[#a0a0ab]">
                    {email}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-[8px] border border-white/[0.07] bg-[#1a1a1f]"
                >
                  <CreditCard className="size-5 text-[#a0a0ab]" />
                </span>
              </div>

              <div className="mt-5 rounded-[8px] border border-white/10 bg-[#1a1a1f] p-4">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-[6px] border border-white/[0.07] bg-[#222228]"
                  >
                    <CreditCard className="size-4 text-[#ededef]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-5 font-medium text-[#ededef]">
                      Card payment
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-[#a0a0ab]">
                      You&apos;ll add or choose your card on Stripe&apos;s
                      secure checkout.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cardBrands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex h-6 items-center rounded-[4px] border border-white/[0.07] bg-[#141418] px-2 text-[10px] leading-3 font-medium tracking-[0.06em] text-[#a0a0ab] uppercase"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-[13px] leading-5 text-[#a0a0ab]">
                  Due today
                </span>
                <span className="text-[18px] leading-6 font-semibold text-[#ededef]">
                  {total}
                </span>
              </div>

              <Button
                type="button"
                onClick={handlePay}
                className="mt-4 h-12 w-full rounded-[8px] bg-brand text-[15px] font-semibold text-white hover:bg-brand/90"
              >
                <LockKeyhole aria-hidden="true" className="size-4" />
                Pay {total}
              </Button>

              <p className="mt-3 flex items-start gap-2 text-[12px] leading-5 text-[#828997]">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>
                  You&apos;ll be redirected to Stripe Checkout to complete your
                  payment securely. Nothing is charged until you confirm there.
                </span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export { Checkout }
