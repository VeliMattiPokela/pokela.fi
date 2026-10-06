# Pokela Design System

Build with `@pokela/components` and `@pokela/tokens`. Both are on npm.

Component props are typed. Read them from the package — they are not repeated
here, because a copy would go stale.

## Always

- Import `@pokela/components/styles.css` once. It pulls in the tokens.
- Use CSS variables for every value: `var(--ink)`, `var(--space-24)`,
  `var(--hairline)`. Never write a raw colour, length or font weight.
- Use the components below instead of building an equivalent.

## Never

**No accent colour.** This system has none. Emphasis is a black and white
inversion — `--invert-surface` with `--invert-ink` — or the quiet
`--badge-surface`. Do not introduce a brand blue, a primary green, or any
coloured button. Colour on the page comes only from photographs.

**No rounded corners.** `--radius` is `0`. Everything is square.

**No shadows.** There are no shadow tokens. Separation is a 1px line
(`--hairline`), never elevation.

**No icon libraries and no emoji.** Use `Icon`. It draws its own six marks on
a 16×16 grid with the same hairline as every border.

**No font weight other than 400, 500 or 600.** Only those are loaded, and
`font-synthesis-weight` is `none`, so any other weight silently renders wrong.

**No spacing outside the scale.** Sixteen steps, each named by its value:
`--space-24` is 24px. If a value is missing, use the nearest step rather than
inventing one.

## Typography

Two families. `--font-display` (Bodoni Moda, a serif) is for display sizes
only — headings and the wordmark. `--font-ui` (Archivo) is for everything
else. Never set body text in the display face.

## Layout

`Grid` is twelve columns: 4 on mobile, 8 from 600px, 12 from 900px. Place
things in columns, never in pixels. `Col` takes the span per breakpoint.

## Components

<!-- generated:make-komponentit -->
- `Icon`, `ICON_NAMES`
- `ListRow`
- `Accordion`, `useAccordionGroup`
- `Grid`, `Col`
- `Reveal`
<!-- /generated -->

`ListRow` is the signature component. Use it for any list of items — a work
list, an index, a menu. Its three visual variants are modifiers on one row,
not separate components.

`ListRow` renders a plain `<a>`. In a router-based app, pass the router's link
component instead:

```jsx
<ListRow as={Link} title="Work title" href="/work/example" />
```

`Accordion` is the same row as a `<button>`. Use it when the row expands
rather than navigates. Only one may be open at a time — `useAccordionGroup`
handles that.

`Reveal` fades its children in on scroll. Wrap sections, not single elements.
