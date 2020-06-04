<!--lint disable no-html-->

# ![rehype-minify][logo]

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] preset to minify HTML.

##### In

```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-US">
    <script src="index.js" type="text/javascript" language="javascript">
      alert(true);
    </script>
    <link rel="stylesheet" href="index.css" type="text/css">
    <title>Foo  &amp;  bar</title>
  </head>
  <body>
    <h1 class="foo foo">bar  bar</h1>
    <p id="alfred" id="alfred">  <strong>foo</strong> <em>bar</em> </p>
    <button type="BUTTON" onclick="javascript:return false">Alpha</button>
  </body>
</html>
```

##### Out

```html
<!doctypehtml><html lang=en-US><meta charset=utf8><script src=index.js></script><link rel=stylesheet href=index.css><title>Foo &amp bar</title><h1 class=foo>bar bar</h1><p id=alfred><strong>foo</strong> <em>bar</em></p><button type=button onclick=return!1>Alpha</button>
```

## Install

[npm][]:

```sh
npm install rehype-preset-minify
```

## Use

*   [Use on the API »][api]
*   [Use on the CLI »][cli]

## Plugins

The following plugins are included in the preset.
They are mostly harmless (disclaimer: **rehype-minify** is quite young).

<!--plugins-core start-->

*   [`rehype-minify-attribute-whitespace`](./packages/rehype-minify-attribute-whitespace)
*   [`rehype-minify-css-style`](./packages/rehype-minify-css-style)
*   [`rehype-minify-enumerated-attribute`](./packages/rehype-minify-enumerated-attribute)
*   [`rehype-minify-event-handler`](./packages/rehype-minify-event-handler)
*   [`rehype-minify-javascript-script`](./packages/rehype-minify-javascript-script)
*   [`rehype-minify-javascript-url`](./packages/rehype-minify-javascript-url)
*   [`rehype-minify-json-script`](./packages/rehype-minify-json-script)
*   [`rehype-minify-media-attribute`](./packages/rehype-minify-media-attribute)
*   [`rehype-minify-meta-color`](./packages/rehype-minify-meta-color)
*   [`rehype-minify-meta-content`](./packages/rehype-minify-meta-content)
*   [`rehype-minify-style-attribute`](./packages/rehype-minify-style-attribute)
*   [`rehype-minify-whitespace`](./packages/rehype-minify-whitespace)
*   [`rehype-normalize-attribute-value-case`](./packages/rehype-normalize-attribute-value-case)
*   [`rehype-remove-comments`](./packages/rehype-remove-comments)
*   [`rehype-remove-duplicate-attribute-values`](./packages/rehype-remove-duplicate-attribute-values)
*   [`rehype-remove-empty-attribute`](./packages/rehype-remove-empty-attribute)
*   [`rehype-remove-external-script-content`](./packages/rehype-remove-external-script-content)
*   [`rehype-remove-meta-http-equiv`](./packages/rehype-remove-meta-http-equiv)
*   [`rehype-remove-script-type-javascript`](./packages/rehype-remove-script-type-javascript)
*   [`rehype-remove-style-type-css`](./packages/rehype-remove-style-type-css)
*   [`rehype-sort-attribute-values`](./packages/rehype-sort-attribute-values)
*   [`rehype-sort-attributes`](./packages/rehype-sort-attributes)

<!--plugins-core end-->

## Other plugins

The following plugins are not included because they are potentially
**dangerous**, can make sites slower in some cases, or need extra configuration.
Read their readmes carefully before using!

<!--plugins-other start-->

*   [`rehype-concat-css-style`](./packages/rehype-concat-css-style)
*   [`rehype-concat-javascript`](./packages/rehype-concat-javascript)
*   [`rehype-css-to-top`](./packages/rehype-css-to-top)
*   [`rehype-javascript-to-bottom`](./packages/rehype-javascript-to-bottom)
*   [`rehype-minify-doctype`](./packages/rehype-minify-doctype)
*   [`rehype-minify-url`](./packages/rehype-minify-url)
*   [`rehype-prevent-favicon-request`](./packages/rehype-prevent-favicon-request)

<!--plugins-other end-->

Also: pass [`allowDangerousCharacters`][stringify] to `rehype-stringify` if you
trust your content.

## Benchmark

Here’s a benchmark comparing the results from [`html-minifier`][html-minifier]
and `rehype-minify`.
To summarize: differences are negligible, in fact, minifying HTML doesn’t matter
much.
What does matter is using good compressions, such as gzip.
Note: `html-minifier` crashes on `stackoverflow`.

<!--benchmark start-->

<table>
<thead>
  <tr>
    <th rowspan="2">name</th>
    <th colspan="3">raw</th>
    <th colspan="3">gzip</th>
  </tr>
  <tr>
    <th>original</th>
    <th>rehype-minify</th>
    <th>html-minifier</th>
    <th>original</th>
    <th>rehype-minify</th>
    <th>html-minifier</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row" align="left"><a href="https://www.amazon.co.uk/">amazon</a></th>
    <td align="right">416.87KB</td>
    <td align="right">8.85%</td>
    <td align="right"><b>23.05%</b></td>
    <td align="right">105.39KB</td>
    <td align="right">6.85%</td>
    <td align="right"><b>21.62%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.bbc.co.uk/">bbc</a></th>
    <td align="right">281.23KB</td>
    <td align="right">14.44%</td>
    <td align="right"><b>16.39%</b></td>
    <td align="right">41.97KB</td>
    <td align="right">11.57%</td>
    <td align="right"><b>13.07%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://getbootstrap.com/docs/4.4/getting-started/introduction/">bootstrap</a></th>
    <td align="right">35.18KB</td>
    <td align="right">21.66%</td>
    <td align="right"><b>22.08%</b></td>
    <td align="right">8.4KB</td>
    <td align="right">4.90%</td>
    <td align="right"><b>5.08%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://kangax.github.io/compat-table/es6/">compat table</a></th>
    <td align="right">7.28MB</td>
    <td align="right">16.52%</td>
    <td align="right"><b>16.80%</b></td>
    <td align="right">234.05KB</td>
    <td align="right">3.67%</td>
    <td align="right"><b>5.37%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://tc39.es/ecma262/">ecmascript</a></th>
    <td align="right">6.25MB</td>
    <td align="right">8.87%</td>
    <td align="right"><b>9.18%</b></td>
    <td align="right">752.17KB</td>
    <td align="right">4.86%</td>
    <td align="right"><b>4.87%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://eloquentjavascript.net/20_node.html">eloquent</a></th>
    <td align="right">80.09KB</td>
    <td align="right">6.44%</td>
    <td align="right"><b>6.45%</b></td>
    <td align="right">19.13KB</td>
    <td align="right"><b>1.29%</b></td>
    <td align="right">1.26%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://github.com">github</a></th>
    <td align="right">128.92KB</td>
    <td align="right"><b>13.36%</b></td>
    <td align="right">12.30%</td>
    <td align="right">33.72KB</td>
    <td align="right">4.51%</td>
    <td align="right"><b>4.57%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.google.com/">google</a></th>
    <td align="right">12.13KB</td>
    <td align="right"><b>7.97%</b></td>
    <td align="right">7.91%</td>
    <td align="right">5.29KB</td>
    <td align="right"><b>4.96%</b></td>
    <td align="right">4.49%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.theguardian.com/us">guardian</a></th>
    <td align="right">940.44KB</td>
    <td align="right">3.90%</td>
    <td align="right"><b>4.51%</b></td>
    <td align="right">130.18KB</td>
    <td align="right">1.97%</td>
    <td align="right"><b>2.06%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://html.spec.whatwg.org">html</a></th>
    <td align="right">11.11MB</td>
    <td align="right">3.35%</td>
    <td align="right"><b>3.38%</b></td>
    <td align="right">1.66MB</td>
    <td align="right">5.42%</td>
    <td align="right"><b>5.49%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.linkedin.com/">linkedin</a></th>
    <td align="right">93.07KB</td>
    <td align="right">35.98%</td>
    <td align="right"><b>36.10%</b></td>
    <td align="right">10.74KB</td>
    <td align="right">12.87%</td>
    <td align="right"><b>13.09%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.microsoft.com/en-us/">microsoft</a></th>
    <td align="right">184.04KB</td>
    <td align="right">9.55%</td>
    <td align="right"><b>21.29%</b></td>
    <td align="right">38.28KB</td>
    <td align="right">4.82%</td>
    <td align="right"><b>7.49%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nbc.com/">nbc</a></th>
    <td align="right">1.59MB</td>
    <td align="right">4.85%</td>
    <td align="right"><b>4.94%</b></td>
    <td align="right">191.42KB</td>
    <td align="right"><b>1.21%</b></td>
    <td align="right">1.01%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.npmjs.com/">npm</a></th>
    <td align="right">30.05KB</td>
    <td align="right"><b>10.53%</b></td>
    <td align="right">10.09%</td>
    <td align="right">8.93KB</td>
    <td align="right"><b>4.63%</b></td>
    <td align="right">4.12%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nytimes.com/">nytimes</a></th>
    <td align="right">1.55MB</td>
    <td align="right"><b>7.41%</b></td>
    <td align="right">7.24%</td>
    <td align="right">145.64KB</td>
    <td align="right"><b>4.19%</b></td>
    <td align="right">3.91%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://rocket.chat">rocketchat</a></th>
    <td align="right">50.58KB</td>
    <td align="right">31.44%</td>
    <td align="right"><b>31.91%</b></td>
    <td align="right">11.39KB</td>
    <td align="right"><b>12.46%</b></td>
    <td align="right">12.45%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://slack.com/intl/en-gb/features">slack</a></th>
    <td align="right">117.08KB</td>
    <td align="right"><b>6.05%</b></td>
    <td align="right">5.24%</td>
    <td align="right">27.78KB</td>
    <td align="right"><b>2.63%</b></td>
    <td align="right">2.08%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://stackoverflow.com/">stackoverflow</a></th>
    <td align="right">112.67KB</td>
    <td align="right"><b>31.50%</b></td>
    <td align="right">💥</td>
    <td align="right">19.96KB</td>
    <td align="right"><b>10.12%</b></td>
    <td align="right">💥</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://twitter.com/">twitter</a></th>
    <td align="right">261.7KB</td>
    <td align="right">9.31%</td>
    <td align="right"><b>19.80%</b></td>
    <td align="right">47.36KB</td>
    <td align="right">3.75%</td>
    <td align="right"><b>6.50%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.vice.com/en_us">vice</a></th>
    <td align="right">297.75KB</td>
    <td align="right"><b>9.08%</b></td>
    <td align="right">8.87%</td>
    <td align="right">48.54KB</td>
    <td align="right"><b>4.11%</b></td>
    <td align="right">3.93%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://en.wikipedia.org/wiki/President_of_the_United_States">wikipedia</a></th>
    <td align="right">588.07KB</td>
    <td align="right">6.16%</td>
    <td align="right"><b>6.81%</b></td>
    <td align="right">112.16KB</td>
    <td align="right"><b>1.94%</b></td>
    <td align="right">1.87%</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <th scope="row">total</th>
    <td align="right">31.32MB</td>
    <td align="right">28.95MB</td>
    <td align="right">28.85MB</td>
    <td align="right">3.6MB</td>
    <td align="right">3.44MB</td>
    <td align="right">3.42MB</td>
  </tr>
</tfoot>
</table>

<!--benchmark end-->

Huge differences in results are suspicious and may point to bugs.

💥 — Crash.

## Security

Use of `rehype-preset-minify` is *safe* by default, if the tree is already safe.
Other plugins can open you up to a [cross-site scripting (XSS)][xss] attack.
Use [`rehype-sanitize`][sanitize] to make the tree safe.

To further optimize the result disregarding security, use the extra plugins
above and pass [`allowDangerousCharacters` to `rehype-stringify`][stringify].

## Related

*   [`rehype-format`](https://github.com/wooorm/rehype-format)
    — Format HTML

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/rehypejs/rehype-minify.svg

[build]: https://travis-ci.org/rehypejs/rehype-minify

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-minify.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-minify

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/rehype

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/master/contributing.md

[support]: https://github.com/rehypejs/.github/blob/master/support.md

[coc]: https://github.com/rehypejs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[logo]: https://raw.githubusercontent.com/rehypejs/rehype-minify/942349c/logo.svg?sanitize=true

[cli]: ./packages/rehype-preset-minify/readme.md#cli

[api]: ./packages/rehype-preset-minify/readme.md#api

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[sanitize]: https://github.com/rehypejs/rehype-sanitize

[stringify]: https://github.com/rehypejs/rehype/tree/master/packages/rehype-stringify#api

[html-minifier]: https://github.com/kangax/html-minifier
