const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim().replace(/\/+$/, "") ||
  "http://localhost:5000"

export type CheckoutVerifyResult =
  { ok: true; alreadyVerified: boolean } | { ok: false; error: string }

type CheckoutVerifyResponse = {
  success?: unknown
  alreadyVerified?: unknown
  message?: unknown
}

/**
 * Asks the API server to record a completed Stripe Checkout Session and mark
 * the matching user as premium. The server owns the idempotency check, so this
 * is safe to call again when the success page is refreshed.
 */
export async function checkoutVerify(
  sessionId: string
): Promise<CheckoutVerifyResult> {
  try {
    const response = await fetch(`${BASE_URL}/payments/checkout-verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    })

    const payload = (await response
      .json()
      .catch(() => null)) as CheckoutVerifyResponse | null

    if (!response.ok) {
      return {
        ok: false,
        error:
          typeof payload?.message === "string"
            ? payload.message
            : `Payment verification failed (${response.status}).`,
      }
    }

    if (payload?.success !== true) {
      return {
        ok: false,
        error:
          typeof payload?.message === "string"
            ? payload.message
            : "Payment verification failed.",
      }
    }

    return { ok: true, alreadyVerified: payload.alreadyVerified === true }
  } catch {
    return {
      ok: false,
      error:
        "We couldn't reach the payment service. Please refresh the page or contact support.",
    }
  }
}
