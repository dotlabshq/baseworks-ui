# @baseworks/ui

The design system: **tokens**, **primitives**, and the **application frame**.
Plain CSS and React — no utility framework, no runtime styling.

```tsx
import '@baseworks/ui/styles.css'          // once, in the root layout
import { Button, Card, Table, Pill } from '@baseworks/ui'
```

## Three layers

| File | What is in it |
|---|---|
| `tokens.css` | Colour, type, shadow. Four brands × light/dark. The only place a value is written. |
| `primitives.css` | Buttons, cards, tables, forms, dialogs, palette, toast. |
| `frame.css` | Rail, sub panel, top bar, assistant, and the centered gate. |

`styles.css` imports all three. A product that wants the look without the frame
imports the first two.

## The palette

**Warm paper, ultramarine ink.** One palette, in a light and a dark form.
`prefers-color-scheme` chooses until the viewer does, with `ThemeToggle` in the
top bar. There is no brand switcher — a second palette is a second design to
keep correct in every state.

|  | Light | Dark |
|---|---|---|
| Page | `#FBFAF8` | `#1A1815` |
| Card | `#FFFFFF` | `#221F1B` |
| Text | `#1A1916` | `#EDE9E1` |
| Secondary | `#67635B` | `#A5A096` |
| Accent | `#2B44CE` | `#A9B5FF` |
| ok · warn · crit | `#16794F` `#8A6112` `#B3362F` | `#4FC28C` `#DFB255` `#F0736B` |

Two decisions are worth knowing, because they are the reason it looks like this.

**The neutrals are warm, not grey.** A console that is mostly tables and text is
sat in front of for hours, and a paper ground is easier to read than the cool
grey every admin panel ships with. Closest shadcn base: `stone`.

**The accent is 231° and that is functional.** The interface is full of status,
and ok/warn/crit own green, amber and red. An accent near any of them turns
"this is a link" into "this is a problem". Ultramarine sits 76° from ok, 169°
from warn and 132° from crit, so an accented thing never reads as a state. The
palette this replaced used a vermilion accent that sat beside its own crit red.

Every pairing the interface actually makes was measured rather than eyeballed:
body text ≥ 14:1, secondary ≥ 5.7:1, the accent as a link ≥ 7.4:1, a button
label on the accent ≥ 7.4:1, each status pill against its own tinted background
≥ 4.7:1.

`tokens.css` also carries shadcn/ui's names (`--background`, `--primary`,
`--border`, …) as aliases, so a component copied in from there inherits this
palette. They are raw colour values — the form shadcn uses with Tailwind v4, not
the older `hsl(var(--background))` triplets.

### Light and dark

```tsx
<script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />  // in <head>
<ThemeToggle />                                                      // in the top bar
```

`data-theme="light|dark"` on `<html>` overrides the system in both directions —
a forced dark on a light machine, and a forced light on a dark one. The script
in `<head>` restores a stored choice before the first paint; without it the page
renders the system's answer and then flips.

`ThemeToggle` renders both icons and lets CSS hide one, under the same
conditions that pick the palette. Asking JavaScript which theme is on cannot be
answered until after hydration, so a viewer on a dark machine would see the
wrong icon for a frame on every load.

`resolvedTheme()` is the honest answer to "which theme is on": `currentTheme()`
can say `system`, which is a setting rather than a colour.

## Type

Instrument Sans for the interface, IBM Plex Mono for anything literal (an id, a
token, a path), and **Instrument Serif for page titles only**. One serif, at the
top of a document, and nowhere else — it gives the console a voice without
making a table harder to read.

## Components

The components are thin. They put the right class on the right element and hold
the behaviour that would otherwise be retyped in every screen: the outside-click
that closes a menu, where focus lands in a confirm dialog, the highlight in the
palette. They never know what the product is.

| | |
|---|---|
| Layout | `PageHead` `Card` `CardBody` `CardGrid` `Stats` `Stat` `KeyValue` |
| Data | `Table` `Pill` `CellName` `CellSub` |
| Forms | `Field` `FormRow` `FormError` `Switch` `Button` `IconButton` |
| Telling | `Attention` `Toast` `CodeBox` `Chips` |
| Overlays | `ConfirmDialog` `SlideOver` `Popover` `MenuItem` `CommandPalette` `Gate` |
| Chrome | `ThemeToggle` |

Two of them carry a rule rather than a look:

- **`ConfirmDialog`** puts focus on Cancel, never on the destructive button, so
  a reflex Enter destroys nothing; `typeToConfirm` makes the person write the
  resource's name, which is the only guard against acting on the wrong row.
- **`Table`** takes `columns` and a `note`, and renders the note as one
  full-width row when there are no rows — loading, error, or empty. Screens used
  to hand-roll that row with a `colSpan` they had to keep in step with the
  header.

## How it is consumed

The package ships **source**, not a build: consumers list it in
`transpilePackages`. It has no repository of its own yet, so it is tracked in
the baseworks-ts root alongside `packages/tsconfig`. When it is published it
gets `dotlabshq/baseworks-ui`, a `tsup` build, and a line in PACKAGES.md §2.

## Where it came from

Ported from the zone9 console (`apps/web`), which is where this shell was
designed and proven. What came across is what no product owns: tokens, frame,
primitives. What stayed behind is everything that knows about servers, regions
or domains. `apps/console` is the reference consumer; zone9 becomes one when it
drops its copy.
