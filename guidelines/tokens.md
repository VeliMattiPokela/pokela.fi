# Tokens

Use CSS variables for every value: `var(--ink)`, `var(--space-24)`,
`var(--hairline)`. Never write a raw colour, length or font weight.

**No accent colour.** This system has none. Emphasis is a black and white
inversion — `--invert-surface` with `--invert-ink` — or the quiet
`--badge-surface`. Do not introduce a brand blue, a primary green, or any
coloured button. Colour on the page comes only from photographs.

The one exception is `--danger`, a state colour for errors only. Do not use it
for emphasis, buttons or decoration. `TextField`, `ChoiceGroup` and `Select` already apply it, always
with the `alert` icon and a message, so the meaning never depends on colour.

**No shadows.** There are no shadow tokens. Separation is a 1px line
(`--hairline`), never elevation.

**No rounded corners.** `--radius` is `0`. Everything is square. The one
exception is `Radio`, which is a circle so it never reads as a checkbox.

<!-- generated:make-valit -->**No spacing outside the scale.** 16 steps, each named by its value:<!-- /generated -->
`--space-24` is 24px. If a value is missing, use the nearest step rather than
inventing one.
