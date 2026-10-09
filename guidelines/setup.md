# Setup

Install **both** packages as direct dependencies, at the same, latest
version. `@pokela/components` uses the tokens of the same release.

Import the stylesheet once, in the app entry:

```js
import '@pokela/components/styles.css';
```

It pulls in the tokens. Do not import the tokens stylesheet separately.

Load the two typefaces from Google Fonts, once, in the document head. The
tokens fall back to them by name (`--font-display` → Bodoni Moda,
`--font-ui` → Archivo); without them the page renders in Georgia and
Helvetica.

<!-- generated:make-fontit -->
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Bodoni+Moda:wght@400;500&display=swap" rel="stylesheet">
```
<!-- /generated -->

Component props are typed. Read them from the package — they are not repeated
in these guidelines, because a copy would go stale.
