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

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`enumeratedAttributes`](#enumeratedattributes)
  * [`Definition`](#definition)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

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
import {enumeratedAttributes} from 'https://esm.sh/html-enumerated-attributes@1'
```

In browsers with [`esm.sh`][esm-sh]:

```html
<script type="module">
  import {enumeratedAttributes} from 'https://esm.sh/html-enumerated-attributes@1?bundle'
</script>
```

## Use

```js
import {enumeratedAttributes} from 'html-enumerated-attributes'

console.log(enumeratedAttributes.loading)
//=> {selector: 'iframe, img', invalid: 'eager', missing: 'eager', states: ['eager', 'lazy']}
```

## API

This package exports the identifier
`enumeratedAttributes`.
There is no default export.

### `enumeratedAttributes`

Enumerated HTML attributes (`Record<string, Array<Definition> | Definition>`).

### `Definition`

Info (TypeScript type).

###### Fields

* `allowUnknown` (`boolean`, default: `false`)
  — whether arbitrary values are allowed
* `caseSensitive` (`boolean`, default: `false`)
  — enumerated values are often treated case-insensitive, except when
  this field is on
* `invalid` (`string`, `null`, optional)
  — invalid value default; `null` means a particular unnamed state
* `missing` (`string`, `null`, optional)
  — missing value default; `null` means a particular unnamed state
* `selector` (`string`, optional, example: `'meta, script'`)
  — simple CSS selector; can contain commas; missing means it applies to
  all elements
* `states` (`Array<Array<string> | string | null>`)
  — possible states

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
`html-enumerated-attributes@^1`,
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

[size]: https://bundlejs.com/?q=html-enumerated-attributes

[size-badge]: https://img.shields.io/bundlejs/size/html-enumerated-attributes

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
