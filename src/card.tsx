import type { ReactNode } from 'react'

/** The title of a screen, and one line saying what it is. */
export function PageHead({ title, children, actions }: { title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div><h1>{title}</h1>{children && <p>{children}</p>}</div>
      {actions && <><div className="spacer" />{actions}</>}
    </div>
  )
}

/**
 * A card. `title` gives it a header; `hint` is the one-sentence explanation
 * that sits on the right of that header — the place to say what the card is
 * for, so the screen does not need a paragraph above it.
 */
export function Card({ id, title, hint, children, style }:
  { id?: string; title?: ReactNode; hint?: ReactNode; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="card" id={id} style={style}>
      {title && <div className="card-head"><h2>{title}</h2>{hint && <span className="cell-sub">{hint}</span>}</div>}
      {children}
    </div>
  )
}

/** Padded body for a card whose content is not a table. */
export function CardBody({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div className="card-pad" style={style}>{children}</div>
}

/** Two columns on a wide screen, one on a narrow one. */
export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid2">{children}</div>
}

/** The strip of numbers at the top of an overview. */
export function Stats({ children }: { children: ReactNode }) {
  return <div className="stats">{children}</div>
}

/**
 * One number. `value` is undefined until its source answers — the dash says
 * "not known yet" rather than showing a zero that would read as a fact.
 */
export function Stat({ label, value, note }: { label: ReactNode; value: ReactNode; note?: ReactNode }) {
  return (
    <div className="stat">
      <div className="k">{label}</div>
      <div className="v num">{value ?? '–'}</div>
      {note && <div className="s">{note}</div>}
    </div>
  )
}

/** A labelled row inside a card: what it is on the left, the value on the right. */
export function KeyValue({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <div className="kv"><span>{label}</span><b>{children}</b></div>
}
