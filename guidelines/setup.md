# Setup

## Before you build

First decide which of three jobs this is. If the request does not make it
clear, ask this one question and wait: **"Are you building a view, a new
component, or a change to an existing component?"**

1. **A view or prototype**, new or existing. Ask what the page is, what is
   on it and what can be clicked. Build it only from this package: pages
   start with `PageHeader`, content goes in `Section`s. If the view needs a
   part the package does not have, do not invent it inside the view: build
   it separately as in 2 and label it "Proposed component".
2. **A new component.** Ask its name, what it does, its states, and which
   existing component is closest. Build it alone on an empty page, every
   state visible side by side, using only tokens. Name its props like the
   package's components (`variant`, `size`, `title`, `meta`), so it can
   become a pull request and a story as is.
3. **A change to an existing component.** Package components cannot be
   edited here. Show the change as a new state next to the current one and
   label it "Proposed change".

## Install

Install **both** packages as direct dependencies, at the same, latest
version. `@pokela/components` uses the tokens of the same release.

Styles, tokens and typefaces load with the components. Do not import any stylesheet or add font
links yourself.

Component props are typed. Read them from the package — they are not repeated
in these guidelines, because a copy would go stale.
