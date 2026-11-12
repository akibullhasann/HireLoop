import type { NewApplication } from "@/lib/applications"

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:5000"

export type SubmitApplicationResult =
  { ok: true; id: string } | { ok: false; error: string }

type ApiResponse = {
  insertedId?: unknown
  message?: unknown
}

/**
 * Persists an application. The server owns de-duplication, default status, and
 * the applied-at timestamp; this helper only reports the outcome to the UI.
 */
export async function submitApplication(
  application: NewApplication
): Promise<SubmitApplicationResult> {
  try {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(application),
    })

    const data: unknown = await res.json().catch(() => null)
    const payload = data as ApiResponse | null

    if (!res.ok) {
      const message =
        typeof payload?.message === "string"
          ? payload.message
          : `The applications API responded with ${res.status}.`

      return { ok: false, error: message }
    }

    return {
      ok: true,
      id: payload?.insertedId ? String(payload.insertedId) : application.jobId,
    }
  } catch {
    return {
      ok: false,
      error: "Could not reach the applications service. Please try again.",
    }
  }
}
