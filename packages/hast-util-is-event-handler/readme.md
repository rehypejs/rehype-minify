<!--This file is generated-->

# hast-util-is-event-handler

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

[`hast`][hast] utility to check if an attribute name is an event handler.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`isEventHandler(name)`](#iseventhandlername)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a utility to check if an attribute name or DOM property is an
event handler.
It does not check whether the supposed event handler is valid or known
(`onmadeupevent` will also yield `true`).

## When should I use this?

You can use this package to check whether an attribute value likely contains
JavaScript or something else.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install hast-util-is-event-handler
```

In Deno with [`esm.sh`][esm-sh]:

```js
import {isEventHandler} from 'https://esm.sh/hast-util-is-event-handler@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import {isEventHandler} from 'https://esm.sh/hast-util-is-event-handler@3?bundle'
</script>
```

## Use

```js
import {isEventHandler} from 'hast-util-is-event-handler'

isEventHandler('oncut') //=> true
isEventHandler('onpushsubscriptionchange') //=> true
isEventHandler('ones') //=> false
isEventHandler('class') //=> false
```

## API

This package exports the identifier
`isEventHandler`.
There is no default export.

### `isEventHandler(name)`

Check if a property is an event handler.

Returns `true` when starting with `'on'` and its `length` is `5` or more.

###### Parameters

* `name` (`string`) — property name to check

###### Returns

Whether `prop` is an event handler (`boolean`).

## Syntax

HTML is parsed according to WHATWG HTML (the living standard), which is also
followed by all browsers.

## Syntax tree

The syntax tree used is [hast][].

## Types

This package is fully typed with [TypeScript][].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`hast-util-is-event-handler@^3`,
compatible with Node.js 16.

## Security

As **rehype** works on HTML and improper use of HTML can open you up to a
[cross-site scripting (XSS)][xss] attack, use of rehype can also be unsafe.
Use [`rehype-sanitize`][rehype-sanitize] to make the tree safe.

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

[author]: https://wooorm.com

[build]: https://github.com/rehypejs/rehype-minify/actions

[build-badge]: https://github.com/rehypejs/rehype-minify/workflows/main/badge.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[coverage]: https://codecov.io/github/rehypejs/rehype-minify

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-minify.svg

[downloads]: https://www.npmjs.com/package/hast-util-is-event-handler

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-is-event-handler.svg

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esm-sh]: https://esm.sh

[funding]: https://opencollective.com/unified

[funding-backers-badge]: https://opencollective.com/unified/backers/badge.svg

[funding-sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[hast]: https://github.com/syntax-tree/hast

[health]: https://github.com/rehypejs/.github

[license]: https://github.com/rehypejs/rehype-minify/blob/main/license

[npm]: https://docs.npmjs.com/cli/install

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[size]: https://bundlejs.com/?q=hast-util-is-event-handler

[size-badge]: https://img.shields.io/bundlejs/size/hast-util-is-event-handler

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
