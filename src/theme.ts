/**
 * Theme.
 *
 * There is one palette — see tokens.css — in a light and a dark form. The
 * operating system decides which, until someone says otherwise: `data-theme` on
 * <html> forces a form in both directions, and `ThemeToggle` is the control
 * that sets it.
 *
 * The choice is remembered in the realm's theme cookie, `bw_theme` — the one
 * the pages a service draws read and write too (the sign-in page, the
 * organization pages, the account pages; `@baseworks/core/pages`). So a theme
 * chosen on `/account` is the theme the product opens in, and the other way
 * round. It has to be restored before the first paint: `themeInitScript()` in
 * <head>, or the page renders the system's answer and then flips.
 *
 * Until 0.2.1 the choice lived in localStorage under `<prefix>.theme`, where a
 * server-drawn page could never see it. That key is still read when there is
 * no cookie, so nobody's choice is lost, and still written, so an older copy
 * of this package on the same origin keeps agreeing.
 */

export type ThemeMode = 'system' | 'light' | 'dark'

const themeKey = (prefix: string) => `${prefix}.theme`

/** The realm's theme cookie. Its values are `light`, `dark` and `auto`. */
export const THEME_COOKIE = 'bw_theme'

/** What the cookie says, or undefined when it is absent or says something else. */
function cookieTheme(): ThemeMode | undefined {
  if (typeof document === 'undefined') return undefined
  const m = new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=([^;]*)`).exec(document.cookie)
  const v = m?.[1]
  return v === 'light' || v === 'dark' ? v : v === 'auto' ? 'system' : undefined
}

/** The remembered choice: the cookie, else what an earlier version stored, else the system. */
export function storedTheme(prefix = 'bw'): ThemeMode {
  const fromCookie = cookieTheme()
  if (fromCookie) return fromCookie
  try {
    const legacy = localStorage.getItem(themeKey(prefix))
    if (legacy === 'light' || legacy === 'dark') return legacy
  } catch { /* no storage: nothing was stored */ }
  return 'system'
}

/** What the document is showing now — not what is stored. */
export function currentTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'system'
  const t = document.documentElement.dataset['theme']
  return t === 'dark' || t === 'light' ? t : 'system'
}

/**
 * What the viewer is actually seeing: the forced form if there is one, else the
 * system's. This is the honest answer to "which theme is on" — `currentTheme()`
 * says `system`, which is a setting, not a colour.
 */
export function resolvedTheme(): 'light' | 'dark' {
  const forced = currentTheme()
  if (forced !== 'system') return forced
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Force a form, or hand the decision back to the system. Remembered in the
 * realm's cookie, so the pages a service draws agree; `prefix` only names the
 * older localStorage key.
 */
export function applyTheme(mode: ThemeMode, prefix = 'bw'): void {
  if (mode === 'system') delete document.documentElement.dataset['theme']
  else document.documentElement.dataset['theme'] = mode
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${THEME_COOKIE}=${mode === 'system' ? 'auto' : mode}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  } catch { /* cookies refused: the choice just does not persist */ }
  try { localStorage.setItem(themeKey(prefix), mode) } catch { /* private mode: the same */ }
}

/**
 * The snippet for <head>, for a product that uses `applyTheme`. It is
 * deliberately tiny and wrapped in try/catch: a browser that refuses cookies
 * or localStorage must still render the page.
 *
 * It reads the realm's cookie first and the older localStorage key only when
 * there is no cookie. `auto` in the cookie means "the system decides", which
 * is what the page does with nothing set.
 *
 * A product with no toggle should still include this: its pages then open in
 * the theme the person chose on the account page.
 */
export function themeInitScript(prefix = 'bw'): string {
  return `try{var m=/(?:^|;\\s*)${THEME_COOKIE}=([^;]*)/.exec(document.cookie),t=m?m[1]:null;`
    + `if(t===null)t=localStorage.getItem("${themeKey(prefix)}");`
    + `if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`
}
