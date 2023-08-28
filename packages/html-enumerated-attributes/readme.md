<!--This file is generated-->

# html-enumerated-attributes

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][funding-sponsors-badge]][funding]
[![Backers][funding-backers-badge]][funding]
[![Chat][chat-badge]][chat]

Utility with info on enumerated attributes.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`enumeratedAttributes`](#enumeratedattributes)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package contains info on enumerated attributes (attributes that have
a limited list of acceptable values).

## When should I use this?

You can use this package for linting and minification purposes.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install html-enumerated-attributes
```

In Deno with [`esm.sh`][esm-sh]:

```js
import {enumeratedAttributes} from 'https://esm.sh/html-enumerated-attributes@0'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import {enumeratedAttributes} from 'https://esm.sh/html-enumerated-attributes@0?bundle'
</script>
```

## Use

```js
import {enumeratedAttributes} from 'html-enumerated-attributes'

console.log(enumeratedAttributes.loading)
//=> {selector: 'iframe, img', invalid: 'eager', missing: 'eager', states: ['eager', 'lazy']}
```

## API

This package exports the following identifiers:
`enumeratedAttributes`.
There is no default export.

### `enumeratedAttributes`

Map of enumerated attributes in HTML (`Record<string, Definition|Array<Definition>>`).

Each `Definition` is an object with the following fields:

*   `selector` (`string`, optional, example: `'meta, script'`) — a simple CSS
    selector
*   `missing` (`string`, `null`, optional) — missing value default
*   `invalid` (`string`, `null`, optional) — invalid value default
*   `states` (`Array<string|null|Array<string>>`) — possible states
*   `allowUnknown` (`boolean`, optional) — whether arbitrary values are
    allowed
*   `caseSensitive` (`boolean`, optional) — enumerated values are often
    treated case-insensitive, except when this field is on

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

[downloads]: https://www.npmjs.com/package/html-enumerated-attributes

[downloads-badge]: https://img.shields.io/npm/dm/html-enumerated-attributes.svg

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

[size]: https://bundlephobia.com/result?p=html-enumerated-attributes

[size-badge]: https://img.shields.io/bundlephobia/minzip/html-enumerated-attributes.svg

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
