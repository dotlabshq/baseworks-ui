/**
 * @baseworks/ui — the design system every baseworks surface is built from.
 *
 * One palette, warm paper and ultramarine, in a light and a dark form. The
 * operating system chooses until the viewer does, with `ThemeToggle`. There is
 * no brand switcher: a second palette is a second design to keep correct.
 *
 * Three layers, and they stay in that order:
 *
 *   tokens.css      colour, type, spacing. The only place a value is written.
 *   primitives.css  buttons, cards, tables, forms, dialogs.
 *   frame.css       the rail, the sub panel, the top bar, the gate.
 *
 * The components here are thin: they put the right class on the right element
 * and hold the behaviour that would otherwise be retyped (outside-click on a
 * menu, focus placement in a confirm dialog, the highlight in the palette).
 * Anything that knows what the product *is* belongs in the product.
 *
 * Import the stylesheet once, in the root layout:
 *
 *   import '@baseworks/ui/styles.css'
 */

export { Button, IconButton } from './button'
export type { ButtonProps, ButtonTone } from './button'

export { PageHead, Card, CardBody, CardGrid, Stats, Stat, KeyValue } from './card'

export { Table, Pill, CellName, CellSub } from './table'
export type { PillTone } from './table'

export { Field, FormRow, FormError, Switch } from './form'

export { Attention, CodeBox, Toast, Chips } from './feedback'
export type { AttentionTone } from './feedback'

export { ConfirmDialog } from './dialog'
export type { ConfirmRequest } from './dialog'

export { Popover, MenuItem, MenuHead, MenuSeparator } from './menu'

export { CommandPalette } from './command-palette'
export type { PaletteItem } from './command-palette'

export { SlideOver } from './slide-over'
export { Gate } from './gate'

export { Frame, RailTip, useFrame } from './frame'
export type { FrameProps, FrameCtx } from './frame'
export { activeModule } from './nav'
export type { Module, SubItem } from './nav'
export { AssistantPanel } from './assistant'
export type { AssistantPanelProps } from './assistant'
export { navigationCommands } from './commands'
export { useResource } from './use-resource'
export type { Resource, ResourceOptions } from './use-resource'
export { age, until, untilEpoch, money, amount } from './format'

export { applyTheme, currentTheme, resolvedTheme, themeInitScript } from './theme'
export type { ThemeMode } from './theme'
export { ThemeToggle } from './theme-toggle'
