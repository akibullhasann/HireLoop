const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** Formats an ISO date (`YYYY-MM-DD`) for display, falling back to `value`. */
export function formatJobDate(value: string, fallback = "No deadline") {
  if (!value) return fallback

  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return value

  return `${months[month - 1]} ${day}, ${year}`
}
