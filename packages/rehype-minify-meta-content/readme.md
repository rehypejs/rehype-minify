<!--This file is generated-->

# rehype-minify-meta-content

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to minify `content` attributes on `<meta>` elements.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(rehypeMinifyMetaContent)`](#unifieduserehypeminifymetacontent)
* [Example](#example)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a plugin that can minify the value of the `content` attribute
of `<meta>` elements.

Note that `meta[name=theme-color]` and `meta[name=msapplication-TileColor]`
are handled by
[`rehype-minify-meta-color`](https://github.com/rehypejs/rehype-minify/tree/main/packages/rehype-minify-meta-color).

## When should I use this?

You can use this plugin when you want to improve the size of HTML documents.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install rehype-minify-meta-content
```

In Deno with [`esm.sh`][esm-sh]:

```js
import rehypeMinifyMetaContent from 'https://esm.sh/rehype-minify-meta-content@4'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import rehypeMinifyMetaContent from 'https://esm.sh/rehype-minify-meta-content@4?bundle'
</script>
```

## Use

On the API:

```js
import rehypeMinifyMetaContent from 'rehype-minify-meta-content'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await unified()
  .use(rehypeParse)
  .use(rehypeMinifyMetaContent)
  .use(rehypeStringify)
  .process(await read('index.html'))

console.log(String(file))
```

On the CLI:

```sh
rehype input.html --use rehype-minify-meta-content --output output.html
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "rehype": {
   "plugins": [
     …
+    "rehype-minify-meta-content",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `rehypeMinifyMetaContent`.

### `unified().use(rehypeMinifyMetaContent)`

Minify `content` attributes on `meta` elements.

###### Returns

Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).

## Example

###### In

```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
<meta name="keywords" content="foo, bar baz, qux">
```

###### Out

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="keywords" content="foo,bar baz,qux">
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
`rehype-minify-meta-content@^4`,
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

[downloads]: https://www.npmjs.com/package/rehype-minify-meta-content

[downloads-badge]: https://img.shields.io/npm/dm/rehype-minify-meta-content.svg

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

[size]: https://bundlejs.com/?q=rehype-minify-meta-content

[size-badge]: https://img.shields.io/bundlejs/size/rehype-minify-meta-content

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
