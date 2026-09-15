import type { ReactNode } from 'react'

/**
 * The centered card a person sees before they are inside: signing in, or
 * creating the organization they have to have. No rail, no top bar — there is
 * nothing to navigate to yet, and offering it would be a lie.
 */
export function Gate({ mark, title, children, above, className }: {
  /** The two-letter brand mark at the top of the card. */
  mark: ReactNode
  title: ReactNode
  children: ReactNode
  /** Rendered above the title — an invitation the person could accept instead. */
  above?: ReactNode
  className?: string
}) {
  return (
    <div className="onboard">
      <div className={['onboard-card', className].filter(Boolean).join(' ')}>
        <div className="onboard-brand">{mark}</div>
        {above}
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  )
}
