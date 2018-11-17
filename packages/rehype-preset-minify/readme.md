# rehype-preset-minify [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status] [![Chat][chat-badge]][chat]

**rehype-preset-minify** minifies and mangles HTML with [**rehype**][rehype].

## Install

```sh
npm install rehype-preset-minify
```

## CLI

After installing, add the following to `.rehyperc` (or `package.json`
under `"rehype"`):

```js
{
  "plugins": [
    "preset-minify"
  ]
}
```

Then use [**rehype-cli**][cli]:

```sh
rehype src -o dist
```

## API

Use:

```js
var rehype = require('rehype')
var minify = require('rehype-preset-minify')

var doc = `<!doctype html>
<html>
  <head>
    <title>Hello</title>
  </head>
  <body>
    <h1>World!</h1>
  </body>
</html>
`

rehype()
  .use(minify)
  .process(doc, function(err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Yields:

```html
<!doctype html><title>Hello</title><h1>World!</h1>
```

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/rehypejs/rehype-minify.svg

[build-status]: https://travis-ci.org/rehypejs/rehype-minify

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-minify.svg

[coverage-status]: https://codecov.io/github/rehypejs/rehype-minify

[chat-badge]: https://img.shields.io/gitter/room/rehypejs/Lobby.svg

[chat]: https://gitter.im/rehypejs/Lobby

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[cli]: https://github.com/rehypejs/rehype/tree/master/packages/rehype-cli

[license]: ../../LICENSE
