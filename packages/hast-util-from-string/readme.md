<!--This file is generated-->

# hast-util-from-string

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`hast`][hast] utility to set the plain-text value of a node.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`fromString(node[, value])`](#fromstringnode-value)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a utility to set the plain-text value of a node.

## When should I use this?

You can use this package when you want to set the plain text value of a node.
The algorithm used by this package is like the DOMs `Node#textContent`
setter.

To use the DOMs `Node#innerText` algorithm instead, use
[`hast-util-from-text`](https://github.com/syntax-tree/hast-util-from-text).
`innerText` is aware of how things are displayed, for example turning line
endings into `<br>` elements and joining table cells with tab (`\t`)
characters.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install hast-util-from-string
```

In Deno with [Skypack][]:

```js
import {fromString} from 'https://cdn.skypack.dev/hast-util-from-string@2?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import {fromString} from 'https://cdn.skypack.dev/hast-util-from-string@2?min'
</script>
```

## Use

```js
import {h} from 'hastscript'
import {fromString} from 'hast-util-from-string'

console.log(fromString(h('p'), 'Alpha'))
// { type: 'element',
//   tagName: 'p',
//   properties: {},
//   children: [ { type: 'text', value: 'Alpha' } ] }
console.log(fromString(h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']), 'Charlie'))
// { type: 'element',
//   tagName: 'div',
//   properties: {},
//   children: [ { type: 'text', value: 'Charlie' } ] }
```

## API

This package exports the following identifiers:
`fromString`.
There is no default export.

### `fromString(node[, value])`

Set the plain-text value of a node.

*   if `node` is a text node (has a `value` property; as in, `comment`,
    `text`), set that to the given `value` or an empty string
*   Otherwise, if `node` is a parent node (has `children`; as in, `element`,
    `root`), replace them with a text node whose data is set to the given
    `value`, or if `value` is not given, remove all its children

###### Parameters

*   `node` (`Node`) — hast node
*   `value` (`string`, optional) — new text

###### Returns

The given node (`Node`).

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

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-from-string.svg

[downloads]: https://www.npmjs.com/package/hast-util-from-string

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-from-string.svg

[size]: https://bundlephobia.com/result?p=hast-util-from-string

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[npm]: https://docs.npmjs.com/cli/install

[skypack]: https://www.skypack.dev

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
