<!--This file is generated-->

# hast-util-from-string

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

[`hast`][hast] utility to set the plain-text value of a node.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`fromString(node[, value])`](#fromstringnode-value)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

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
In Node.js (version 16+), install with [npm][]:

```sh
npm install hast-util-from-string
```

In Deno with [`esm.sh`][esm-sh]:

```js
import {fromString} from 'https://esm.sh/hast-util-from-string@3'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import {fromString} from 'https://esm.sh/hast-util-from-string@3?bundle'
</script>
```

## Use

```js
import {h} from 'hastscript'
import {fromString} from 'hast-util-from-string'

const p = h('p')
fromString(p, 'Alpha')
console.log(p)
// { type: 'element',
//   tagName: 'p',
//   properties: {},
//   children: [ { type: 'text', value: 'Alpha' } ] }

const div = h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.'])
fromString(div, 'Charlie')
console.log(div)
// { type: 'element',
//   tagName: 'div',
//   properties: {},
//   children: [ { type: 'text', value: 'Charlie' } ] }
```

## API

This package exports the identifier
`fromString`.
There is no default export.

### `fromString(node[, value])`

Set the plain-text value of a node.

###### Parameters

* `node` (`Node`) — node to change
* `value` (`string`, default: `''`) — value to use

###### Returns

Nothing (`undefined`).

###### Algorithm

* if `node` is a `comment` or `text` node, sets its `value`
* if `node` is an `element` or `root`, replaces its children with a text
  node for `value`

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
`hast-util-from-string@^3`,
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

[downloads]: https://www.npmjs.com/package/hast-util-from-string

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-from-string.svg

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

[size]: https://bundlejs.com/?q=hast-util-from-string

[size-badge]: https://img.shields.io/bundlejs/size/hast-util-from-string

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
