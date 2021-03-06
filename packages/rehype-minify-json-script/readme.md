<!--This file is generated by `build-packages.js`-->

# rehype-minify-json-script

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Minify `script` elements with a JSON body.

## Install

[npm][]:

```sh
npm install rehype-minify-json-script
```

## Use

On the API:

```diff
 unified()
   .use(require('rehype-parse'))
+  .use(require('rehype-minify-json-script'))
   .use(require('rehype-stringify'))
   .process('<span>some html</span>', function (err, file) {
     console.error(report(err || file))
     console.log(String(file))
   })
```

On the CLI:

```sh
rehype input.html --use minify-json-script > output.html
```

## Example

##### In

```html
<script type="application/ld+json">
{
  "@context": {
    "name": "http://xmlns.com/foaf/0.1/name",
    "@id": "http://me.example.com",
    "@type": "Person",
    "name": "John Smith",
    "homepage": "http://www.example.com/"
  }
}
</script>
```

##### Out

```html
<script type="application/ld+json">{"@context":{"name":"John Smith","@id":"http://me.example.com","@type":"Person","homepage":"http://www.example.com/"}}</script>
```

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

[downloads-badge]: https://img.shields.io/npm/dm/rehype-minify-json-script.svg

[downloads]: https://www.npmjs.com/package/rehype-minify-json-script

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-minify-json-script.svg

[size]: https://bundlephobia.com/result?p=rehype-minify-json-script

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[license]: https://github.com/rehypejs/rehype-minify/blob/main/license

[author]: https://wooorm.com
