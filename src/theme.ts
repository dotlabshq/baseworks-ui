/**
 * Theme.
 *
 * There is one palette — see tokens.css — in a light and a dark form. The
 * operating system decides which, until someone says otherwise: `data-theme` on
 * <html> forces a form in both directions, and `ThemeToggle` is the control
 * that sets it.
 *
 * The choice is remembered per browser, so it has to be restored before the
 * first paint — `themeInitScript()` in <head>, or the page renders the system's
 * answer and then flips to the stored one.
 */

export type ThemeMode = 'system' | 'light' | 'dark'

const themeKey = (prefix: string) => `${prefix}.theme`

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

/** Force a form, or hand the decision back to the system. Remembered per browser. */
export function applyTheme(mode: ThemeMode, prefix = 'bw'): void {
  if (mode === 'system') delete document.documentElement.dataset['theme']
  else document.documentElement.dataset['theme'] = mode
  try { localStorage.setItem(themeKey(prefix), mode) } catch { /* private mode: the choice just does not persist */ }
}

/**
 * The snippet for <head>, for a product that uses `applyTheme`. It is
 * deliberately tiny and wrapped in try/catch: a browser that refuses
 * localStorage must still render the page.
 *
 * A product with no toggle does not need this at all — with nothing stored,
 * `prefers-color-scheme` already decides.
 */
export function themeInitScript(prefix = 'bw'): string {
  return `try{var t=localStorage.getItem("${themeKey(prefix)}");`
    + `if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`
}
