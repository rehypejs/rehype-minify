<!--This file is generated-->

# hast-util-is-conditional-comment

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`hast`][hast] utility to check if a node is a conditional comment.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`isConditionalComment(node)`](#isconditionalcommentnode)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a utility to check whether a hast node is a “conditional”
comment.
Conditional comments are a legacy feature that was specific to Internet
Explorer.
They were no longer used in IE 10.

## When should I use this?

You can use this package when you’re building tools that handle old and
non-standard HTML, but generally it’s recommended to remove conditional
comments.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install hast-util-is-conditional-comment
```

In Deno with [Skypack][]:

```js
import {isConditionalComment} from 'https://cdn.skypack.dev/hast-util-is-conditional-comment@2?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import {isConditionalComment} from 'https://cdn.skypack.dev/hast-util-is-conditional-comment@2?min'
</script>
```

## Use

```js
import {u} from 'unist-builder'
import {isConditionalComment} from 'hast-util-is-conditional-comment'

isConditionalComment(u('comment', '[if IE]>...<![endif]')) //=> true
isConditionalComment(u('comment', '<![endif]')) //=> true
isConditionalComment(u('comment', 'foo')) //=> false
```

## API

This package exports the following identifiers:
`isConditionalComment`.
There is no default export.

### `isConditionalComment(node)`

Check if a node is a conditional comment.

###### Parameters

*   `node` (`Node`) — hast node

###### Returns

Whether a node is a conditional comment (`boolean`).

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

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-is-conditional-comment.svg

[downloads]: https://www.npmjs.com/package/hast-util-is-conditional-comment

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-is-conditional-comment.svg

[size]: https://bundlephobia.com/result?p=hast-util-is-conditional-comment

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
