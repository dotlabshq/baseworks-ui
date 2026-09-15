import type { ReactNode } from 'react'

export type AttentionTone = 'accent' | 'warn' | 'crit'

/**
 * Something the reader has to know before acting. `action` is the one thing
 * they can do about it, inline — a banner with no way out is just noise.
 */
export function Attention({ tone = 'accent', action, onAction, children, style }:
  { tone?: AttentionTone; action?: ReactNode; onAction?: () => void; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className={'attn' + (tone === 'accent' ? '' : ` ${tone}`)} style={style}>
      <span className="sev" />
      <div>{children}</div>
      {action && <button className="act" onClick={onAction}>{action}</button>}
    </div>
  )
}

/** Literal text: a token, a command, a config fragment. Never re-wrapped. */
export function CodeBox({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div className="codebox" style={style}>{children}</div>
}

/** The receipt for something that already happened. Null hides it. */
export function Toast({ message }: { message: string | null }) {
  return <div className={'toast' + (message ? ' on' : '')}>{message}</div>
}

/** Short, clickable suggestions — what to try when the page is empty. */
export function Chips({ items }: { items: { label: string; onPick: () => void }[] }) {
  return (
    <div className="chips">
      {items.map((c) => <button key={c.label} className="chip" onClick={c.onPick}>{c.label}</button>)}
    </div>
  )
}
