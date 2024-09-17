<!--This file is generated-->

# rehype-remove-comments

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to remove comments.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(rehypeRemoveComments[, options])`](#unifieduserehyperemovecomments-options)
  * [`Options`](#options)
  * [`Test`](#test)
* [Example](#example)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a plugin that removes comments.
By default it keeps conditional comments, optionally it removes them too.

## When should I use this?

You can use this plugin when you want to improve the transfer size of HTML
documents.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install rehype-remove-comments
```

In Deno with [`esm.sh`][esm-sh]:

```js
import rehypeRemoveComments from 'https://esm.sh/rehype-remove-comments@6'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import rehypeRemoveComments from 'https://esm.sh/rehype-remove-comments@6?bundle'
</script>
```

## Use

On the API:

```js
import rehypeParse from 'rehype-parse'
import rehypeRemoveComments from 'rehype-remove-comments'
import rehypeStringify from 'rehype-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await unified()
  .use(rehypeParse)
  .use(rehypeRemoveComments)
  .use(rehypeStringify)
  .process(await read('index.html'))

console.log(String(file))
```

On the CLI:

```sh
rehype input.html --use rehype-remove-comments --output output.html
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "rehype": {
   "plugins": [
     …
+    "rehype-remove-comments",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `rehypeRemoveComments`.

### `unified().use(rehypeRemoveComments[, options])`

Remove comments.

###### Parameters

* `options` (`Options`, optional)
  — configuration

###### Returns

Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).

### `Options`

Configuration (TypeScript type).

###### Fields

* `removeConditional` (`boolean`, default: `false`)
  — remove conditional comments (default: `false`); the default is to
  leave them
* `test` (`Test`, optional)
  — choose which comments to keep (optional)

### `Test`

Test a comment (TypeScript type).

###### Parameters

* `value` (`string`)
  — comment value

###### Returns

Whether to keep the comment (`boolean`, optional).

## Example

###### In

```html
<!--Hello-->
<!--[if IE 6]>OK<![endif]-->
```

###### Out

```html
<!--[if IE 6]>OK<![endif]-->
```

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
`rehype-remove-comments@^6`,
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

[downloads]: https://www.npmjs.com/package/rehype-remove-comments

[downloads-badge]: https://img.shields.io/npm/dm/rehype-remove-comments.svg

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esm-sh]: https://esm.sh

[funding]: https://opencollective.com/unified

[funding-backers-badge]: https://opencollective.com/unified/backers/badge.svg

[funding-sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[hast]: https://github.com/syntax-tree/hast

[health]: https://github.com/rehypejs/.github

[license]: https://github.com/rehypejs/rehype-minify/blob/main/license

[npm]: https://docs.npmjs.com/cli/install

[rehype]: https://github.com/rehypejs/rehype

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[size]: https://bundlejs.com/?q=rehype-remove-comments

[size-badge]: https://img.shields.io/bundlejs/size/rehype-remove-comments

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
