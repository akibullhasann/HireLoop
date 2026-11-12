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

/**
 * Formats an ISO timestamp as a short relative age ("2 hours ago") and falls
 * back to a readable date once the value is older than about a month.
 */
export function formatRelativeTime(value: string) {
  if (!value) return "—"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000))

  if (seconds < 60) return "just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`

  return formatJobDate(value.slice(0, 10), value)
}
