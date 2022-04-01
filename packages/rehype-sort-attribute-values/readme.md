<!--This file is generated-->

# rehype-sort-attribute-values

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to sort attribute values.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(rehypeSortAttributeValues)`](#unifieduserehypesortattributevalues)
*   [Example](#example)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a plugin that sorts attribute values, which optimizes for
repetition-based compression (such as GZip).

## When should I use this?

You can use this plugin when you want to improve the transfer size of HTML
documents.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install rehype-sort-attribute-values
```

In Deno with [`esm.sh`][esmsh]:

```js
import rehypeSortAttributeValues from 'https://esm.sh/rehype-sort-attribute-values@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import rehypeSortAttributeValues from 'https://esm.sh/rehype-sort-attribute-values@4?bundle'
</script>
```

## Use

On the API:

```js
import {read} from 'to-vfile'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeSortAttributeValues from 'rehype-sort-attribute-values'

main()

async function main() {
  const file = await unified()
    .use(rehypeParse)
    .use(rehypeSortAttributeValues)
    .use(rehypeStringify)
    .process(await read('index.html'))

  console.log(String(file))
}
```

On the CLI:

```sh
rehype input.html --use rehype-sort-attribute-values --output output.html
```

On the CLI in a config file (here a `package.json`):

```diff
 …
 "rehype": {
   "plugins": [
     …
+    "rehype-sort-attribute-values",
     …
   ]
 }
 …
```

## API

This package exports no identifiers.
The default export is `rehypeSortAttributeValues`.

### `unified().use(rehypeSortAttributeValues)`

Sort attribute values.
There are no options.

## Example

###### In

```html
<div class="qux quux foo bar"></div>
```

###### Out

```html
<div class="bar foo quux qux"></div>
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

[downloads-badge]: https://img.shields.io/npm/dm/rehype-sort-attribute-values.svg

[downloads]: https://www.npmjs.com/package/rehype-sort-attribute-values

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-sort-attribute-values.svg

[size]: https://bundlephobia.com/result?p=rehype-sort-attribute-values

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

[rehype]: https://github.com/rehypejs/rehype
