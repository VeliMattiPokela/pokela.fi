# Components

Use these instead of building an equivalent.

<!-- generated:make-komponentit -->
- `Icon`, `ICON_NAMES`
- `ListRow`
- `Accordion`, `useAccordionGroup`
- `Timeline`, `TimelineItem`
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

`Reveal` fades its children in on scroll. Wrap sections, not single elements.
