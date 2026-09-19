/**
 * Display formatting. Timestamps arrive as ISO-8601 or epoch and are shown
 * relative; money arrives as integer minor units and is shown as a decimal.
 */

/**
 * How long ago, as a finished phrase.
 *
 * It includes "ago" on purpose. Returning a bare duration made every call site
 * append it, and the shortest case then read "just now ago".
 */
export function age(iso: string | number): string {
  const t = typeof iso === 'number' ? iso : new Date(iso).getTime()
  const minutes = Math.floor((Date.now() - t) / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.floor(hours / 24)} d ago`
}

/** How long until an ISO timestamp, or that it has already passed. */
export function until(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'expired'
  const hours = Math.floor(ms / 3_600_000)
  if (hours < 1) return `in ${Math.floor(ms / 60_000)} min`
  if (hours < 48) return `in ${hours} h`
  return `in ${Math.floor(hours / 24)} d`
}

export function untilEpoch(sec: number): string {
  const ms = sec * 1000 - Date.now()
  if (ms <= 0) return 'expired'
  const hours = Math.floor(ms / 3_600_000)
  if (hours < 1) return `${Math.floor(ms / 60_000)} min`
  return `${hours} h`
}

/**
 * Integer minor units → a decimal string. Money is never a float on the wire
 * (a float that is nearly the right amount is the wrong amount), so it is
 * divided only here, on the way to a screen.
 */
export function money(minor: number, currency?: string): string {
  const s = (minor / 100).toFixed(2)
  return currency ? `${s} ${currency}` : s
}

/** The same, grouped for a column of figures: 1234567 → "12,345.67". */
export function amount(minor: number): string {
  return (minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
