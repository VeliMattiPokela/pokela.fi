# Tokens

Use CSS variables for every value: `var(--ink)`, `var(--space-24)`,
`var(--hairline)`. Never write a raw colour, length or font weight.

**No accent colour.** This system has none. Emphasis is a black and white
inversion — `--invert-surface` with `--invert-ink` — or the quiet
`--badge-surface`. Do not introduce a brand blue, a primary green, or any
coloured button. Colour on the page comes only from photographs.

**No shadows.** There are no shadow tokens. Separation is a 1px line
(`--hairline`), never elevation.

**No rounded corners.** `--radius` is `0`. Everything is square.

<!-- generated:make-valit -->**No spacing outside the scale.** 16 steps, each named by its value:<!-- /generated -->
`--space-24` is 24px. If a value is missing, use the nearest step rather than
inventing one.
