'use client'

import { useEffect, useRef, useState } from 'react'

export type ConfirmRequest = {
  title: string
  /** What is about to happen, in one sentence. */
  intro: string
  /** What disappears for good. */
  losses?: string[]
  /** A footnote: a grace period, where the data goes. */
  note?: string
  confirmLabel: string
  /** When set, the confirm button stays closed until this is typed exactly. */
  typeToConfirm?: string
  onConfirm: () => Promise<void>
}

/**
 * The confirmation for a destructive action.
 *
 * Two things here are deliberate. Focus lands on Cancel (or on the text box),
 * never on the destructive button, so a reflex Enter destroys nothing. And
 * `typeToConfirm` is the only guard against clicking the right button on the
 * wrong row — deletion has no undo, so the name has to be written out.
 *
 * A failure keeps the dialog open and shows why: closing it would leave the
 * person believing the thing happened.
 */
export function ConfirmDialog({ request, onClose }: { request: ConfirmRequest | null; onClose: () => void }) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!request) return
    setTyped(''); setError(null); setBusy(false)
    const t = setTimeout(() => (request.typeToConfirm ? inputRef.current : cancelRef.current)?.focus(), 30)
    return () => clearTimeout(t)
  }, [request])

  useEffect(() => {
    if (!request) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !busy) onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [request, busy, onClose])

  if (!request) return null
  const ready = !request.typeToConfirm || typed.trim() === request.typeToConfirm

  const run = async () => {
    if (!ready || busy) return
    setBusy(true); setError(null)
    try {
      await request.onConfirm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The action failed.')
      setBusy(false)
    }
  }

  return (
    <div className="dialog-wrap" onMouseDown={() => !busy && onClose()}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={request.title}
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="dialog-head"><span className="sev" /><h3>{request.title}</h3></div>
        <div className="dialog-body">
          <p>{request.intro}</p>
          {request.losses && request.losses.length > 0 && (
            <ul className="dialog-losses">{request.losses.map((l) => <li key={l}>{l}</li>)}</ul>
          )}
          {request.note && <p className="cell-sub">{request.note}</p>}
          {request.typeToConfirm && (
            <div className="field">
              <label htmlFor="confirm-name">Type <span className="mono">{request.typeToConfirm}</span> to confirm</label>
              <input id="confirm-name" ref={inputRef} type="text" autoComplete="off" spellCheck={false}
                value={typed} disabled={busy} onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && run()} />
            </div>
          )}
          {error && <div className="form-error">{error}</div>}
        </div>
        <div className="dialog-foot">
          <button className="btn ghost" ref={cancelRef} onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn danger" onClick={run} disabled={!ready || busy}>
            {busy ? 'Working…' : request.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
