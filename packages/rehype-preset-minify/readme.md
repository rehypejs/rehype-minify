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
  "presets": ["minify"]
}
```

Then use [**rehype-cli**][cli]:

```sh
rehype src -o dist
```

## API

> Caveat: Plugins cannot configure how HTML is formatted on the API.
> You must do that yourself.  An object of suggested settings is at
> `minify.config`;

Use:

```js
var rehype = require('rehype');
var minify = require('rehype-preset-minify');

rehype()
  .use(minify)
  .process(`<!DOCTYPE html>
  <html>
    <head>
      <title>Hello</title>
    </head>
    <body>
      <h1>World!</h1>
    </body>
  </html>
`, minify.config, function (err, file) {
    if (err) throw err;
    console.log(String(file));
  });
```

Yields:

```html
<!DOCTYPE html><title>Hello</title><h1>World!</h1>
```

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/rehype-minify.svg

[build-status]: https://travis-ci.org/wooorm/rehype-minify

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/rehype-minify.svg

[coverage-status]: https://codecov.io/github/wooorm/rehype-minify

[chat-badge]: https://img.shields.io/gitter/room/wooorm/rehype.svg

[chat]: https://gitter.im/wooorm/rehype

[author]: http://wooorm.com

[rehype]: https://github.com/wooorm/rehype

[cli]: https://github.com/wooorm/rehype/tree/master/packages/rehype-cli

[license]: ../../LICENSE
