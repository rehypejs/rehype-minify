<!--This file is generated-->

# hast-util-to-string

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`hast`][hast] utility to get the plain-text value of a node.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`toString(node)`](#tostringnode)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a utility to get the plain-text value of a node.

## When should I use this?

You can use this package when you want to get the plain text value of a node.
The algorithm used by this package is like the DOMs `Node#textContent`
getter.

To use the DOMs `Node#innerText` algorithm instead, use
[`hast-util-to-text`](https://github.com/syntax-tree/hast-util-to-text).
`innerText` is aware of how things are displayed, for example turning hard
breaks (`<br>`) into line endings.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install hast-util-to-string
```

In Deno with [`esm.sh`][esmsh]:

```js
import {toString} from 'https://esm.sh/hast-util-to-string@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {toString} from 'https://esm.sh/hast-util-to-string@2?bundle'
</script>
```

## Use

```js
import {h} from 'hastscript'
import {toString} from 'hast-util-to-string'

toString(h('p', 'Alpha'))
//=> 'Alpha'
toString(h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']))
//=> 'Bold and italic.'
```

## API

This package exports the following identifiers:
`toString`.
There is no default export.

### `toString(node)`

Get the plain-text value of a node.

###### Parameters

*   `node` (`Node`) — hast node

###### Returns

Serialized node (`string`).

## Syntax

HTML is handled according to WHATWG HTML (the living standard), which is also
followed by browsers such as Chrome and Firefox.

## Syntax tree

The syntax tree format used is [`hast`][hast].

## Types

This package is fully typed with [TypeScript][].

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

As **rehype** works on HTML, and improper use of HTML can open you up to a
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

[build-badge]: https://github.com/rehypejs/rehype-minify/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-minify/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-minify.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-minify

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-to-string.svg

[downloads]: https://www.npmjs.com/package/hast-util-to-string

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-to-string.svg

[size]: https://bundlephobia.com/result?p=hast-util-to-string

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/rehypejs/rehype-minify/blob/main/license

[author]: https://wooorm.com

[hast]: https://github.com/syntax-tree/hast
