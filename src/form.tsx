import type { ReactNode } from 'react'

/** A labelled control with an optional line of help under it. */
export function Field({ label, htmlFor, hint, children }:
  { label: ReactNode; htmlFor?: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <small className="cell-sub">{hint}</small>}
    </div>
  )
}

/** One line: the input grows, the selector and the button stay their own size. */
export function FormRow({ children }: { children: ReactNode }) {
  return <div className="form-row">{children}</div>
}

/**
 * Why the write failed, next to the form that failed — not as a toast. A toast
 * is a receipt for something that happened; this is a correction to make.
 */
export function FormError({ children }: { children: ReactNode }) {
  return children ? <div className="form-error">{children}</div> : null
}

/** An on/off control that is its own label. */
export function Switch({ checked, onChange, label, disabled }:
  { checked: boolean; onChange: (next: boolean) => void; label: ReactNode; disabled?: boolean }) {
  return (
    <label className="optline" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: disabled ? 'default' : 'pointer' }}>
      <span className={'sw' + (checked ? ' on' : '')} role="switch" aria-checked={checked}
        aria-disabled={disabled} tabIndex={0}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => { if (!disabled && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onChange(!checked) } }} />
      <span>{label}</span>
    </label>
  )
}
