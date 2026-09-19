'use client'

/**
 * The assistant, sliding in from the right.
 *
 * The panel is generic; what it is connected to is not. `onAsk` is where a
 * surface binds a real agent — given none, the panel answers with a note that
 * says so, which is honest and keeps the frame demonstrable before the tools
 * exist. Nothing here computes an answer.
 *
 * `expanded` is owned by the frame, not by this component: widening the panel
 * takes room from the content beside it, so the decision belongs where both
 * are laid out.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'

type Msg = { id: number; kind: 'user' | 'bot' | 'typing'; body?: ReactNode }
let nextId = 1

export interface AssistantPanelProps {
  open: boolean
  onClose: () => void
  /** Whether the panel has taken the middle column as well. */
  expanded?: boolean
  onToggleExpand?: () => void
  /** The two-letter mark in the panel's head. */
  mark?: ReactNode
  title?: string
  subtitle?: string
  /** The first thing it says. */
  greeting?: ReactNode
  /**
   * Answer a question. Return the reply's body; throw to show an error as a
   * reply. Absent means the panel is a design preview and says so.
   */
  onAsk?: (text: string) => Promise<ReactNode>
}

const PREVIEW = 'This is a design preview — the assistant is not connected yet. It will use the same tools the screens and the CLI use.'

export function AssistantPanel({
  open,
  onClose,
  expanded = false,
  onToggleExpand,
  mark = 'bw',
  title = 'Assistant',
  subtitle = 'does what the screens do',
  greeting = 'Hello. I can answer questions about what is here and, once the tools are connected, act on your behalf — always asking before a write.',
  onAsk,
}: AssistantPanelProps) {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, kind: 'bot', body: greeting }])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [msgs])

  const add = (m: Omit<Msg, 'id'>) => {
    const id = nextId++
    setMsgs((p) => [...p, { ...m, id }])
    return id
  }

  const send = async () => {
    const asked = text.trim()
    if (!asked || busy) return
    add({ kind: 'user', body: asked })
    setText('')
    const typing = add({ kind: 'typing' })
    setBusy(true)
    try {
      const body = onAsk ? await onAsk(asked) : await new Promise<ReactNode>((r) => setTimeout(() => r(PREVIEW), 700))
      setMsgs((p) => p.filter((m) => m.id !== typing))
      add({ kind: 'bot', body })
    } catch (err) {
      setMsgs((p) => p.filter((m) => m.id !== typing))
      add({ kind: 'bot', body: err instanceof Error && err.message ? err.message : 'That did not answer.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className={'chat' + (open ? ' open' : '') + (expanded ? ' expanded' : '')} aria-label={title}>
      <div className="chat-inner">
        <div className="chat-head">
          <div className="brand-mark" style={{ width: 26, height: 26, fontSize: 13, margin: 0 }}>{mark}</div>
          <div>
            <div className="ttl">{title}</div>
            <div className="sub">{subtitle}</div>
          </div>
          {onToggleExpand && (
            <button
              className="icon-btn chat-expand"
              onClick={onToggleExpand}
              aria-label={expanded ? 'Narrow the assistant' : 'Widen the assistant'}
              aria-pressed={expanded}
              title={expanded ? 'Narrow' : 'Widen'}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
                {expanded ? <path d="M9.5 2v4.5H14M6.5 14V9.5H2" /> : <path d="M14 2H9.5v4.5M2 14h4.5V9.5" />}
              </svg>
            </button>
          )}
          <button className="icon-btn close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="chat-scroll" ref={scrollRef}>
          {msgs.map((m) =>
            m.kind === 'typing' ? (
              <div key={m.id} className="typing"><i /><i /><i /></div>
            ) : (
              <div key={m.id} className={'msg ' + m.kind}>{m.body}</div>
            ),
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask for something…"
            aria-label="Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void send()}
          />
          <button className="send" onClick={() => void send()} aria-label="Send" disabled={busy}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
