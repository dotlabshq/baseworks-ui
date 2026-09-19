'use client'

/**
 * What ⌘K can do, derived from the module list so a new module is reachable
 * the moment it is added. A screen's own commands (create, revoke, switch) are
 * appended by whoever owns the action.
 */

import type { PaletteItem } from './command-palette'
import type { Module } from './nav'

/**
 * The palette offers what the rail offers. A command for something the surface
 * has filtered out would fail on the way in, and offering it is a worse answer
 * than not knowing about it.
 */
export function navigationCommands(modules: Module[], go: (href: string) => void): PaletteItem[] {
  const out: PaletteItem[] = []
  for (const m of modules) {
    for (const it of m.items) {
      if (!it.href) continue
      const slug = it.label.toLowerCase().replace(/\s+/g, '-')
      out.push({ label: `→ ${m.title} · ${it.label}`, intent: `${m.key}.${slug}`, run: () => go(it.href!) })
    }
  }
  return out
}
