'use client'

import { applyTheme, resolvedTheme } from './theme'

/**
 * Light ↔ dark, in the top bar.
 *
 * Both icons are rendered and CSS hides one, using the same conditions
 * tokens.css uses to pick the palette. The alternative — asking JavaScript
 * which theme is on and rendering that icon — cannot know the answer until
 * after hydration, so a viewer on a dark system would see the wrong icon for a
 * frame on every load. Here the icon is right in the first paint, and script
 * runs only when someone clicks.
 */
export function ThemeToggle({ prefix }: { prefix?: string }) {
  return (
    <button
      className="icon-btn theme-toggle"
      title="Switch between light and dark"
      aria-label="Switch between light and dark"
      onClick={() => applyTheme(resolvedTheme() === 'dark' ? 'light' : 'dark', prefix)}
    >
      {/* Shown in light: a moon, because it offers dark. */}
      <span className="i-to-dark" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.5 9.5A5.8 5.8 0 0 1 6.5 2.5a5.8 5.8 0 1 0 7 7Z"/></svg>
      </span>
      {/* Shown in dark: a sun. */}
      <span className="i-to-light" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"/></svg>
      </span>
    </button>
  )
}
