import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonTone = 'primary' | 'ghost' | 'danger'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** `danger` is for the irreversible one; it is never the default. */
  tone?: ButtonTone
  small?: boolean
  children: ReactNode
}

/**
 * One button shape for the whole system.
 *
 * `type` defaults to "button": inside a form the HTML default is "submit", so a
 * secondary button that only opens a menu would submit the form instead.
 */
export function Button({ tone = 'primary', small, className, type, children, ...rest }: ButtonProps) {
  const cls = ['btn', tone === 'ghost' && 'ghost', tone === 'danger' && 'danger', small && 'sm', className]
    .filter(Boolean).join(' ')
  return <button type={type ?? 'button'} className={cls} {...rest}>{children}</button>
}

/** A square icon-only button, as used in the top bar. Always needs a label. */
export function IconButton({ label, className, type, children, ...rest }:
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { label: string; children: ReactNode }) {
  return (
    <button type={type ?? 'button'} className={['icon-btn', className].filter(Boolean).join(' ')}
      title={label} aria-label={label} {...rest}>{children}</button>
  )
}
