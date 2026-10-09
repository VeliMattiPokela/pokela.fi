# Components

Use these instead of building an equivalent.

<!-- generated:make-komponentit -->
- `Icon`, `ICON_NAMES`
- `ListRow`
- `Accordion`, `useAccordionGroup`
- `Timeline`, `TimelineItem`
- `ExplodedView`
- `PageHeader`
- `Section`
- `TextField`
- `Grid`, `Col`
- `Reveal`
- `ThemeScript`, `THEME_STORAGE_KEY`
- `ThemeToggle`
<!-- /generated -->

`ListRow` is the signature component. Use it for any list of items — a work
list, an index, a menu. Its three visual variants are modifiers on one row,
not separate components.

`ListRow` renders a plain `<a>`. In a router-based app, pass the router's link
component instead:

```jsx
<ListRow as={Link} title="Work title" href="/work/example" />
```

To show a row as selected, use `className="invert"` — not a new colour.

`ListRow` already applies `bleed` itself. Do not pass it again in `className`.

`Accordion` is the same row as a `<button>`. Use it when the row expands
rather than navigates. Only one may be open at a time; `useAccordionGroup`
handles that.

`Timeline` is a vertical list of dated or timed items. Put `TimelineItem`s
inside it; the labels line up because they share the list's grid. Use
`variant="emphasis"` for the one item that matters most and `variant="end"`
for the last. `weight` (0–1) stretches an item's rail, e.g. by its share of
the total duration.

```jsx
<Timeline>
  <TimelineItem label="0.00" title="Tokens" meta="under a second" />
  <TimelineItem label="0.03" title="Images" meta="5 min 32 s" variant="emphasis" weight={0.9} />
  <TimelineItem label="5.35" title="Site built" variant="end" />
</Timeline>
```

`ExplodedView` shows layers as plates in 3D space: how a finished surface is
built from its parts. Each layer is real markup, not an image. Give elements
the same `data-kohde` in several layers and they light up together on hover.
Mark a token with `data-token` (`"ink"` for `--ink`, `"display-l"` for
`--text-display-l`): hovering it lights every element in the other layers
whose computed style uses that value, and hovering an element lights its
tokens. Usage is read from computed styles, never marked by hand.
`tila="koottu"` starts with the layers collapsed into one surface. Put no
links or buttons inside the layers; the whole view is one image to a screen
reader, described by `label`.

```jsx
<ExplodedView
  label="The page as three layers: tokens, components and the finished page."
  layers={[
    { name: '01 Tokens', source: 'tokens.json', content: <Tokens /> },
    { name: '02 Components', content: <Components /> },
    { name: '03 Page', content: <Page /> },
  ]}
/>
```

`TextField` is the form field: label, input, hint and error in one. Use it
for every text input and text area (`multiline`) instead of a bare `<input>`.
Pass `error` with a message to show the error state; never colour a field
yourself. Mark an optional field with `optional="(optional)"`, not an asterisk
on the required ones. Put form buttons after the fields with the `.btn`
classes.

```jsx
<TextField label="Email" type="email" error="The address is missing a domain." />
<TextField label="Message" optional="(optional)" multiline hint="Up to 500 characters." />
## Patterns

`PageHeader` and `Section` are patterns: they add no look of their own, only
the layout every page uses. Build pages from them instead of arranging
headings and grids yourself.

`PageHeader` is the page's title with an optional `meta` and `lede`. The lede
always sits under the title in the same column, never beside it.

`Section` names a part of the page with a small `title` (and optional
`meta`). `layout="stacked"` puts the title row above the content;
`layout="aside"` puts the title in a narrow left column and the content
beside it. Use one layout per page.

```jsx
<PageHeader title="From idea to launch" meta="9 weeks" lede="Each phase ends in a shared decision." />
<Section title="Road to launch" layout="aside">
  <Timeline>…</Timeline>
</Section>
```

`Reveal` fades its children in on scroll. Wrap sections, not single elements.
