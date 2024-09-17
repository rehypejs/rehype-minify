<!--This file is generated-->

# hast-util-is-javascript

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

[`hast`][hast] utility to check if an element is a JavaScript script.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`isJavaScript(node)`](#isjavascriptnode)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a utility to check whether a hast node is a `<script>` that
contains or references JavaScript.

## When should I use this?

You can use this package to check whether `<script>` elements contain or
reference JavaScript or something else.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install hast-util-is-javascript
```

In Deno with [`esm.sh`][esm-sh]:

```js
import {isJavaScript} from 'https://esm.sh/hast-util-is-javascript@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import {isJavaScript} from 'https://esm.sh/hast-util-is-javascript@3?bundle'
</script>
```

## Use

```js
import {h} from 'hastscript'
import {isJavaScript} from 'hast-util-is-javascript'

isJavaScript(h('script')) //=> true
isJavaScript(h('script', {type: 'text/ecmascript'})) //=> true
isJavaScript(h('script', {language: 'ecmascript'})) //=> true
isJavaScript(h('script', {type: 'text/fooscript'})) //=> false
isJavaScript(h('script', {language: 'fooscript'})) //=> false
```

## API

This package exports the identifier
`isJavaScript`.
There is no default export.

### `isJavaScript(node)`

Check if a node is a `<script>` that contains or references JavaScript.

Returns `true` if `node` is a `<script>` element that has a valid JavaScript
`type`, has no `type` and a valid JavaScript `language`, or has neither.

###### Parameters

* `node` (`Node`) — node to check

###### Returns

Whether a node is a `<script>` that contains or references JavaScript
(`boolean`).

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
`hast-util-is-javascript@^3`,
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

[downloads]: https://www.npmjs.com/package/hast-util-is-javascript

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-is-javascript.svg

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

[size]: https://bundlejs.com/?q=hast-util-is-javascript

[size-badge]: https://img.shields.io/bundlejs/size/hast-util-is-javascript

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
