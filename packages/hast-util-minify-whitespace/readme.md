<!--This file is generated-->

# hast-util-minify-whitespace

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

[`hast`][hast] utility to minify whitespace between elements.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`Options`](#options)
  * [`minifywhitespace(tree[, options])`](#minifywhitespacetree-options)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a utility that can minify the whitespace between elements.

## When should I use this?

You can use this package when you want to improve the size of HTML fragments.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install hast-util-minify-whitespace
```

In Deno with [`esm.sh`][esm-sh]:

```js
import {minifyWhitespace} from 'https://esm.sh/hast-util-minify-whitespace@1'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import {minifyWhitespace} from 'https://esm.sh/hast-util-minify-whitespace@1?bundle'
</script>
```

## Use

```js
import {h} from 'hastscript'
import {minifyWhitespace} from 'hast-util-minify-whitespace'

const tree = h('p', [
  '  ',
  h('strong', 'foo'),
  '  ',
  h('em', 'bar'),
  '  ',
  h('meta', {itemProp: true}),
  '  '
])

minifyWhitespace(tree)

console.log(tree)
//=> h('p', [h('strong', 'foo'), ' ', h('em', 'bar'), h('meta', {itemProp: true})])
```

## API

This package exports the identifier
`minifyWhitespace`.
There is no default export.

### `Options`

Configuration (TypeScript type).

###### Fields

* `newlines` (`boolean`, default: `false`)
  — collapse whitespace containing newlines to `'\n'` instead of `' '`
  (default: `false`);
  the default is to collapse to a single space

###### Returns

Nothing (`undefined`).

### `minifywhitespace(tree[, options])`

Minify whitespace.

###### Parameters

* `tree` (`Node`) — tree
* `options` (`Options`, optional) — configuration

###### Returns

Nothing (`undefined`).

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
`hast-util-minify-whitespace@^1`,
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

[downloads]: https://www.npmjs.com/package/hast-util-minify-whitespace

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-minify-whitespace.svg

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

[size]: https://bundlejs.com/?q=hast-util-minify-whitespace

[size-badge]: https://img.shields.io/bundlejs/size/hast-util-minify-whitespace

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
