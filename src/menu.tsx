'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * A menu anchored to the button that opens it.
 *
 * It closes on a click anywhere outside itself, which every dropdown in the
 * frame needs and each one used to implement again. `align="rail"` is the
 * variant that opens to the right of the icon rail instead of below the button.
 */
export function Popover({ trigger, children, align = 'below', menuClassName, menuStyle, label }: {
  /** Rendered with the open state so the trigger can show it (a caret, a pressed look). */
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode
  children: ReactNode | ((close: () => void) => ReactNode)
  align?: 'below' | 'rail'
  menuClassName?: string
  menuStyle?: React.CSSProperties
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  const cls = ['brand-menu', align === 'rail' && 'org-menu rail', menuClassName].filter(Boolean).join(' ')
  return (
    <div className="brand-pop" ref={rootRef}>
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div className={cls} style={menuStyle} role="menu" aria-label={label}>
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  )
}

/** One row in a Popover. `selected` marks the current choice with a tick. */
export function MenuItem({ selected, onClick, children }:
  { selected?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button className={'brand-opt' + (selected ? ' sel' : '')} onClick={onClick} role="menuitem">
      {children}{selected && <span className="check">✓</span>}
    </button>
  )
}

export function MenuHead({ children }: { children: ReactNode }) {
  return <div className="org-menu-head">{children}</div>
}

export function MenuSeparator() {
  return <div className="org-menu-sep" role="separator" />
}
