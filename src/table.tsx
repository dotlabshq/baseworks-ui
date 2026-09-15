import type { ReactNode } from 'react'

export type PillTone = 'neutral' | 'ok' | 'off' | 'warn' | 'crit' | 'acc'

/** A status, as a word and a colour. Never a colour alone. */
export function Pill({ tone = 'neutral', children }: { tone?: PillTone; children: ReactNode }) {
  return (
    <span className={'pill' + (tone === 'neutral' ? '' : ` ${tone}`)}>
      {tone !== 'neutral' && <span className="d" />}{children}
    </span>
  )
}

/**
 * The first line of a cell: the thing's name.
 *
 * `tag` is the small note that belongs to the name rather than to a column of
 * its own — "you", "active", "default". It has its own class instead of
 * borrowing the rail's, which only has a rule inside the rail and rendered as
 * bare text pushed against the name everywhere else.
 */
export function CellName({ children, tag }: { children: ReactNode; tag?: ReactNode }) {
  return <div className="cell-name">{children}{tag && <span className="cell-tag">{tag}</span>}</div>
}

/** The quiet second line: an id, a timestamp, a reason. */
export function CellSub({ children }: { children: ReactNode }) {
  return <div className="cell-sub">{children}</div>
}

/**
 * A table with its scroll container.
 *
 * `note` renders as a single full-width row and is the only thing shown when
 * there are no rows: loading, an error, or "nothing here yet". Screens used to
 * hand-roll that row with a colSpan they had to keep in sync with the header;
 * `columns` gives the count for free.
 */
export function Table({ columns, note, children }:
  { columns: ReactNode[]; note?: ReactNode; children?: ReactNode }) {
  const empty = !children || (Array.isArray(children) && children.flat().filter(Boolean).length === 0)
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>
          {children}
          {note && empty && <tr><td colSpan={columns.length}><div className="cell-sub">{note}</div></td></tr>}
        </tbody>
      </table>
    </div>
  )
}
