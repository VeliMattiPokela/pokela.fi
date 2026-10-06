# Setup

Install **both** packages as direct dependencies:

```json
{
  "dependencies": {
    "@pokela/tokens": "1.1.0",
    "@pokela/components": "1.1.0"
  }
}
```

Import the stylesheet once, in the app entry:

```js
import '@pokela/components/styles.css';
```

It pulls in the tokens. Do not import the tokens stylesheet separately.

Component props are typed. Read them from the package — they are not repeated
in these guidelines, because a copy would go stale.
