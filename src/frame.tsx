'use client'

/**
 * The application frame: icon rail, sub panel, top bar, assistant, ⌘K, toast
 * and the confirm dialog.
 *
 * It is presentational. It knows how a surface is laid out and nothing about
 * what the surface is for: the modules, the icons, the counts, who is signed
 * in and which organization is active all arrive as props or slots. The
 * console fills them with a realm; a product fills them with its own screens.
 *
 * What it does own is the state that belongs to the layout — which panel is
 * open, whether the assistant has taken the middle column, what the palette
 * is showing, the toast that is up — because every surface would otherwise
 * write the same thing again.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react'
import { CommandPalette, type PaletteItem } from './command-palette'
import { ConfirmDialog, type ConfirmRequest } from './dialog'
import { Toast } from './feedback'
import { activeModule, type Module, type SubItem } from './nav'

export type FrameCtx = {
  toast: (message: string) => void
  confirm: (request: ConfirmRequest) => void
  /** Whether the assistant is open, for a screen that wants to offer it. */
  assistantOpen: boolean
  openAssistant: () => void
}

const Ctx = createContext<FrameCtx | null>(null)

export function useFrame(): FrameCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useFrame must be used inside Frame')
  return c
}

export interface FrameProps {
  /** The surface's own modules, already filtered to what it offers. */
  modules: Module[]
  /** Usually the router's. Decides which module is active. */
  pathname: string
  onNavigate: (href: string) => void
  /** Looked up by `countKey`; undefined means "not known yet", and nothing is shown. */
  counts?: Record<string, number | undefined>
  /** Rail icon per module key. */
  icons?: Record<string, ReactNode>
  fallbackIcon?: ReactNode
  /** A dot on a module's rail icon — something is waiting there. */
  badges?: Record<string, boolean>
  /** Above the module list: the organization switcher, usually. */
  railTop?: ReactNode
  /** Below it: the account menu. */
  railBottom?: ReactNode
  /** After the separator under the modules: settings, help. */
  railExtra?: ReactNode
  topbarLeft?: ReactNode
  topbarRight?: ReactNode
  /** The foot of the sub panel: which organization, and the caller's role. */
  footer?: ReactNode
  commands?: PaletteItem[]
  /**
   * The assistant. Given a renderer, the frame owns whether it is open and
   * whether it is expanded, and puts the toggle in the top bar.
   */
  assistant?: (state: {
    open: boolean
    onClose: () => void
    expanded: boolean
    onToggleExpand: () => void
  }) => ReactNode
  assistantLabel?: string
  children: ReactNode
}

/**
 * The hover card beside a rail icon: its name, and a line on what is there.
 * Shown on hover and on keyboard focus of its parent, so put it inside the
 * button it describes. A surface uses it for its own rail slots too — the
 * organization button, the account — so every icon on the rail answers alike.
 */
export function RailTip({ title, desc }: { title: ReactNode; desc?: ReactNode }) {
  return (
    <span className="rail-tip" role="tooltip">
      <b>{title}</b>
      {desc && <span>{desc}</span>}
    </span>
  )
}

export function Frame({
  modules,
  pathname,
  onNavigate,
  counts = {},
  icons = {},
  fallbackIcon,
  badges = {},
  railTop,
  railBottom,
  railExtra,
  topbarLeft,
  topbarRight,
  footer,
  commands = [],
  assistant,
  assistantLabel = 'Assistant',
  children,
}: FrameProps) {
  const mod = activeModule(pathname, modules)

  const [navOpen, setNavOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatWide, setChatWide] = useState(false)
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [confirmReq, setConfirmReq] = useState<ConfirmRequest | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const toast = useCallback((m: string) => {
    setToastMsg(m)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600)
  }, [])
  const confirm = useCallback((request: ConfirmRequest) => setConfirmReq(request), [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // The sub panel overlays the content on a narrow screen, which is a body-level
  // concern: the rule that positions it is in frame.css, keyed off this class.
  useEffect(() => {
    document.body.classList.toggle('nav-open', navOpen)
    return () => document.body.classList.remove('nav-open')
  }, [navOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const onModuleClick = (m: Module) => {
    if (m.href === mod.href) setNavOpen((v) => !v)
    else {
      onNavigate(m.href)
      setNavOpen(true)
    }
  }

  const onSubItem = (it: SubItem) => {
    if (it.soon) {
      toast('On the roadmap — not designed yet.')
      return
    }
    if (it.href) {
      onNavigate(it.href)
      return
    }
    if (it.hash) {
      const go = () => document.getElementById(it.hash!)?.scrollIntoView({ behavior: 'smooth' })
      if (pathname !== mod.href) {
        onNavigate(mod.href)
        setTimeout(go, 250)
      } else go()
    }
  }

  const ctx = useMemo<FrameCtx>(
    () => ({ toast, confirm, assistantOpen: chatOpen, openAssistant: () => setChatOpen(true) }),
    [toast, confirm, chatOpen],
  )

  const desc =
    mod.descCountKey && counts[mod.descCountKey] !== undefined
      ? `${counts[mod.descCountKey]} ${mod.descCountLabel ?? ''}`.trim()
      : mod.desc

  return (
    <Ctx.Provider value={ctx}>
      <div className="app">
        <aside className="rail">
          <div className="rail-icons">
            {railTop}
            <nav aria-label="Main menu">
              {modules.map((m) => (
                <button
                  key={m.key}
                  className={'nav-item' + (m.key === mod.key ? ' active' : '')}
                  aria-label={m.title}
                  aria-current={m.key === mod.key ? 'page' : undefined}
                  onClick={() => onModuleClick(m)}
                >
                  {icons[m.key] ?? fallbackIcon}
                  {badges[m.key] && <span className="nav-dot" />}
                  <RailTip title={m.title} desc={m.desc} />
                </button>
              ))}
              {railExtra && <div className="rail-sep" role="separator" />}
              {railExtra}
            </nav>
            <button
              className="nav-item rail-toggle"
              aria-label="Toggle menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>
              <RailTip title={navOpen ? 'Hide menu' : 'Show menu'} />
            </button>
            {railBottom}
          </div>
          <div className="subrail">
            <div className="subrail-inner">
              <div className="subrail-head">
                <div className="mn">{mod.title}</div>
                <div className="md">{desc}</div>
              </div>
              <div className="subrail-items">
                {mod.items.map((it) => (
                  <button
                    key={it.label}
                    className={'sub-item' + (it.href && pathname === it.href ? ' active' : '')}
                    onClick={() => onSubItem(it)}
                  >
                    {it.label}
                    {it.countKey && counts[it.countKey] !== undefined && (
                      <span className="cnt num">{counts[it.countKey]}</span>
                    )}
                    {it.soon && <span className="soon">soon</span>}
                  </button>
                ))}
              </div>
              {footer && <div className="subrail-foot">{footer}</div>}
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            {topbarLeft}
            <button className="search-hint" onClick={() => setCmdkOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="5" /><path d="m11 11 3 3" /></svg>
              Search or run a command… <kbd>⌘K</kbd>
            </button>
            <div className="top-actions">
              {topbarRight}
              {assistant && (
                <button className="chat-toggle" onClick={() => setChatOpen((v) => !v)} aria-expanded={chatOpen}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v6a1.5 1.5 0 0 1-1.5 1.5H6l-3.2 2.6a.4.4 0 0 1-.65-.31L2 11V3.5Z" /></svg>
                  {assistantLabel}
                </button>
              )}
            </div>
          </header>
          <div className="content">{children}</div>
        </div>

        {assistant?.({
          open: chatOpen,
          onClose: () => setChatOpen(false),
          expanded: chatWide,
          onToggleExpand: () => setChatWide((v) => !v),
        })}
      </div>

      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} items={commands} />
      <ConfirmDialog request={confirmReq} onClose={() => setConfirmReq(null)} />
      <Toast message={toastMsg} />
    </Ctx.Provider>
  )
}
