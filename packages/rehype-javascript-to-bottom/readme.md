<!--This file is generated-->

# rehype-javascript-to-bottom

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to move JavaScript `<script>`s to the end of the body.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(rehypeJavaScriptToBottom[, options])`](#unifieduserehypejavascripttobottom-options)
*   [Example](#example)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a plugin that can improve performance by *decreasing* the
time to
[first render](https://developer.yahoo.com/performance/rules.html#js_bottom).

## When should I use this?

You can use this plugin when you want to improve the speed of HTML documents.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install rehype-javascript-to-bottom
```

In Deno with [Skypack][]:

```js
import rehypeJavaScriptToBottom from 'https://cdn.skypack.dev/rehype-javascript-to-bottom@3?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import rehypeJavaScriptToBottom from 'https://cdn.skypack.dev/rehype-javascript-to-bottom@3?min'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeJavaScriptToBottom from 'rehype-javascript-to-bottom'

main()

async function main() {
  const file = await unified()
    .use(rehypeParse)
    .use(rehypeJavaScriptToBottom)
    .use(rehypeStringify)
    .process(await read('index.html'))

  console.log(String(file))
}
```

On the CLI:

```sh
rehype input.html --use rehype-javascript-to-bottom --output output.html
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "rehype": {
   "plugins": [
     …
+    "rehype-javascript-to-bottom",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `rehypeJavaScriptToBottom`.

### `unified().use(rehypeJavaScriptToBottom[, options])`

Move JavaScript `<script>`s to the end of `<body>`.

##### `options`

Configuration (optional).

###### `options.filter`

Function called with each checked script that can return `true` to move the
script or `false` if not.

## Example

###### In

```html
<!doctype html><html><head><script src="index.js"></script></head><body></body></html>
```

###### Out

```html
<!doctype html><html><head></head><body><script src="index.js"></script></body></html>
```

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

[downloads-badge]: https://img.shields.io/npm/dm/rehype-javascript-to-bottom.svg

[downloads]: https://www.npmjs.com/package/rehype-javascript-to-bottom

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-javascript-to-bottom.svg

[size]: https://bundlephobia.com/result?p=rehype-javascript-to-bottom

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

[rehype]: https://github.com/rehypejs/rehype
