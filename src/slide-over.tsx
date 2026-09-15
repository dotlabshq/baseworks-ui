'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * A form that slides in from the right and keeps the page behind it visible —
 * for adding to a list while still reading the list you are adding to.
 *
 * The panel stays in the DOM and is moved off-screen, which is what makes the
 * animation possible and creates two problems it has to solve itself:
 *
 * - `autoFocus` on a field inside fires when the panel first mounts, closed, so
 *   opening it leaves focus on the button behind. The first field is focused
 *   here instead, and only when `open` changes — an effect that also depended on
 *   `onClose` re-ran on every render, because a caller writing `onClose={() =>
 *   setOpen(false)}` passes a new function each time, and the focus then jumped
 *   back to the first field on every keystroke in any other one.
 * - A closed panel's fields are still tabbable. `inert` takes the whole thing
 *   out of the tab order and away from assistive technology until it is open,
 *   so a keyboard does not wander into a panel nobody can see.
 */
export function SlideOver({ open, onClose, title, footer, children }: {
  open: boolean
  onClose: () => void
  title: ReactNode
  footer?: ReactNode
  children: ReactNode
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  // Read through a ref so the effect below depends on `open` alone. See the
  // note above: depending on the callback itself made it re-run per render.
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current() }
    document.addEventListener('keydown', onKey)
    // After the frame that opens it: focusing an element still being
    // transformed into place scrolls the panel oddly in some browsers.
    const t = setTimeout(() => {
      bodyRef.current?.querySelector<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      )?.focus()
    }, 60)
    return () => { document.removeEventListener('keydown', onKey); clearTimeout(t) }
  }, [open])

  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={onClose} />
      <aside
        className={'panel' + (open ? ' on' : '')}
        inert={!open}
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <div className="panel-head">
          <h3>{title}</h3>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body" ref={bodyRef}>{children}</div>
        {footer && <div className="panel-foot">{footer}</div>}
      </aside>
    </>
  )
}
