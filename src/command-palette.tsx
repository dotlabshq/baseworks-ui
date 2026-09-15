'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export type PaletteItem = {
  label: string
  /** The intent name, shown on the right. The palette, the API and the assistant share it. */
  intent: string
  run: () => void
}

/**
 * ⌘K. Presentational: it filters, moves the highlight and calls `run`. What is
 * in the list is the application's business, never the palette's.
 */
export function CommandPalette({ open, onClose, items, placeholder = 'What do you want to do?' }: {
  open: boolean
  onClose: () => void
  items: PaletteItem[]
  placeholder?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [hl, setHl] = useState(0)

  useEffect(() => { if (open) { setQ(''); setHl(0); inputRef.current?.focus() } }, [open])

  const shown = useMemo(
    () => items.filter((it) => !q || `${it.label} ${it.intent}`.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  )
  if (!open) return null

  const pick = (it: PaletteItem) => { onClose(); it.run() }

  return (
    <div className="cmdk on" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmdk-box">
        <input ref={inputRef} type="text" placeholder={placeholder} value={q}
          onChange={(e) => { setQ(e.target.value); setHl(0) }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setHl((h) => Math.min(h + 1, shown.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setHl((h) => Math.max(h - 1, 0)) }
            if (e.key === 'Escape') onClose()
            if (e.key === 'Enter' && shown[hl]) pick(shown[hl])
          }} />
        <div className="cmdk-list">
          {shown.map((it, i) => (
            <button key={it.intent + it.label} className={'cmdk-item' + (i === hl ? ' hl' : '')}
              onMouseEnter={() => setHl(i)} onClick={() => pick(it)}>
              <span>{it.label}</span><span className="k">{it.intent}</span>
            </button>
          ))}
          {shown.length === 0 && <div className="cell-sub" style={{ padding: '10px 14px' }}>Nothing matches.</div>}
        </div>
      </div>
    </div>
  )
}
