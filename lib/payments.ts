export type PaymentPlan = {
  id: string
  name: string
  tagline: string
  price: number
  interval: "month" | "year"
  features: readonly string[]
}

export const PRO_PLAN: PaymentPlan = {
  id: "pro",
  name: "HireLoop Pro",
  tagline: "Unlock unlimited applications and premium job insights.",
  price: 20,
  interval: "month",
  features: [
    "Unlimited applications",
    "Premium job insights",
    "Priority candidate badge",
    "Direct recruiter messaging",
  ],
}

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function formatPrice(amount: number) {
  return usdFormatter.format(amount)
}
