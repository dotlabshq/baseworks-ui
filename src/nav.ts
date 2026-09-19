/**
 * The shape of a module list — not any particular list.
 *
 * A surface supplies its own modules: the console's are the realm's services,
 * a product's are its own screens. What is shared is the shape and the rule
 * for which one is active, because the frame renders both the same way.
 */

export type SubItem = {
  label: string
  /** A route to go to. */
  href?: string
  /** A card on the module's own page to scroll to. */
  hash?: string
  /** Which count to show beside the label, looked up in `counts`. */
  countKey?: string
  /** Designed, not built. The frame says so rather than navigating. */
  soon?: boolean
}

export type Module = {
  key: string
  href: string
  title: string
  /** Shown under the title when no count is configured. */
  desc: string
  descCountKey?: string
  descCountLabel?: string
  /**
   * The service this module is a face for, if it needs one. The frame does not
   * use this — a surface filters its own list before passing it in — but it
   * travels with the module so that filter has something to read.
   */
  service?: string
  items: SubItem[]
}

/**
 * The module a path belongs to: the longest `href` that prefixes it, so
 * `/reports/vat` picks `reports` over `/`. Falls back to the first module.
 */
export function activeModule(pathname: string, modules: Module[]): Module {
  const found = modules
    .filter((m) => (m.href === '/' ? pathname === '/' : pathname.startsWith(m.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]
  return found ?? modules[0]!
}
