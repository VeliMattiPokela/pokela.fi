# Styles

**Do not use Tailwind utility classes for design system values.** This system
is plain CSS: global classes that come with the components, and CSS variables
for values. Writing `bg-blue-500` or `rounded-lg` bypasses the system and
produces the wrong result.

## Headings

Typography classes set the look, not the meaning. A page heading is an `<h1>`,
a section heading an `<h2>`, and so on — never a `<p>` carrying a display
class. The class and the element are two separate decisions, and a screen
reader only hears the element.

```jsx
<h1 className="display-xl">Selected work</h1>
```

## Typography

Two families. `--font-display` (Bodoni Moda, a serif) is for display sizes
only — headings and the wordmark. `--font-ui` (Archivo) is for everything
else. Never set body text in the display face.

<!-- generated:make-painot -->**No font weight other than 400, 500 or 600.**<!-- /generated --> Only those are loaded, and
`font-synthesis-weight` is `none`, so any other weight silently renders wrong.

## Layout

<!-- generated:make-sarakkeet -->`Grid` is 12 columns: 4 on mobile, 8 from 600px, 12 from 900px.<!-- /generated --> Place
things in columns, never in pixels. `Col` takes the span per breakpoint.

**No icon libraries and no emoji.** Use `Icon`. <!-- generated:make-ikonit -->It draws its own 9 marks<!-- /generated --> on
a 16×16 grid with the same hairline as every border.
