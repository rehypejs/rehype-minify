<!--This file is generated-->

# rehype-minify-url

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to minify URLs.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(rehypeMinifyUrl[, options])`](#unifieduserehypeminifyurl-options)
  * [`Options`](#options)
* [Example](#example)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a plugin that can minify URL values of certain attributes
using [`relateurl`](https://github.com/stevenvachon/relateurl).

## When should I use this?

You can use this plugin when you want to improve the size of HTML documents.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install rehype-minify-url
```

In Deno with [`esm.sh`][esm-sh]:

```js
import rehypeMinifyUrl from 'https://esm.sh/rehype-minify-url@5'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import rehypeMinifyUrl from 'https://esm.sh/rehype-minify-url@5?bundle'
</script>
```

## Use

On the API:

```js
import rehypeMinifyUrl from 'rehype-minify-url'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await unified()
  .use(rehypeParse)
  .use(rehypeMinifyUrl)
  .use(rehypeStringify)
  .process(await read('index.html'))

console.log(String(file))
```

On the CLI:

```sh
rehype input.html --use rehype-minify-url --output output.html
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "rehype": {
   "plugins": [
     …
+    "rehype-minify-url",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `rehypeMinifyUrl`.

### `unified().use(rehypeMinifyUrl[, options])`

Minify URLs.

###### Parameters

* `options` (`Options`, optional)
  — configuration

###### Returns

Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).

### `Options`

Configuration (TypeScript type).

All options except for `from` are passed through to
`relateurl`.

###### Fields

* `from` (`string`, optional)
  — absolute URL to where the document will be hosted; can also be set
  with an `origin` and `pathname` in `file.data.meta` (as supported by
  [`rehype-meta`](https://github.com/rehypejs/rehype-meta)).

## Example

###### In

```html
<a href="/foo/../bar.html"></a>
```

###### Out

(with `{ from: 'https://example.com' }` as options)

```html
<a href="bar.html"></a>
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
`rehype-minify-url@^5`,
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

[downloads]: https://www.npmjs.com/package/rehype-minify-url

[downloads-badge]: https://img.shields.io/npm/dm/rehype-minify-url.svg

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

[size]: https://bundlejs.com/?q=rehype-minify-url

[size-badge]: https://img.shields.io/bundlejs/size/rehype-minify-url

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
