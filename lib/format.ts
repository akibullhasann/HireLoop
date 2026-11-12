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

/**
 * Formats a `YYYY-MM-DD` date (or an ISO timestamp) as `Mon D, YYYY`.
 * Returns `fallback` for empty values and the raw value when unparseable.
 */
export function formatJobDate(value: string, fallback = "No deadline") {
  if (!value) return fallback

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return value

  const [, year, month, day] = match
  const monthIndex = Number(month) - 1

  if (monthIndex < 0 || monthIndex > 11) return value

  return `${months[monthIndex]} ${Number(day)}, ${year}`
}
