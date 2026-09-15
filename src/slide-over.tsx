'use client'

import { useEffect, type ReactNode } from 'react'

/**
 * A form that slides in from the right and keeps the page behind it visible —
 * for creating something while still reading the list you are adding to.
 */
export function SlideOver({ open, onClose, title, footer, children }: {
  open: boolean
  onClose: () => void
  title: ReactNode
  footer?: ReactNode
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={onClose} />
      <aside className={'panel' + (open ? ' on' : '')} aria-hidden={!open} aria-label={typeof title === 'string' ? title : undefined}>
        <div className="panel-head">
          <h3>{title}</h3>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">{children}</div>
        {footer && <div className="panel-foot">{footer}</div>}
      </aside>
    </>
  )
}
