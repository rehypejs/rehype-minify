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
    <td align="right">287.4KB</td>
    <td align="right">9.12%</td>
    <td align="right"><b>27.26%</b></td>
    <td align="right">81.06KB</td>
    <td align="right">7.79%</td>
    <td align="right"><b>24.75%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.bbc.co.uk/">bbc</a></th>
    <td align="right">263.94KB</td>
    <td align="right">14.09%</td>
    <td align="right"><b>15.93%</b></td>
    <td align="right">40.49KB</td>
    <td align="right">11.31%</td>
    <td align="right"><b>12.42%</b></td>
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
    <td align="right">6.78MB</td>
    <td align="right">16.34%</td>
    <td align="right"><b>16.83%</b></td>
    <td align="right">210.6KB</td>
    <td align="right">3.37%</td>
    <td align="right"><b>5.72%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://tc39.es/ecma262/">ecmascript</a></th>
    <td align="right">6.28MB</td>
    <td align="right"><b>10.28%</b></td>
    <td align="right">10.09%</td>
    <td align="right">750.44KB</td>
    <td align="right"><b>5.26%</b></td>
    <td align="right">5.17%</td>
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
    <td align="right">132.24KB</td>
    <td align="right"><b>13.73%</b></td>
    <td align="right">12.73%</td>
    <td align="right">34.41KB</td>
    <td align="right"><b>4.98%</b></td>
    <td align="right">4.87%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.google.com/">google</a></th>
    <td align="right">14.35KB</td>
    <td align="right">7.02%</td>
    <td align="right"><b>7.26%</b></td>
    <td align="right">5.89KB</td>
    <td align="right"><b>4.65%</b></td>
    <td align="right">4.41%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.theguardian.com/us">guardian</a></th>
    <td align="right">942.91KB</td>
    <td align="right">4.02%</td>
    <td align="right"><b>4.57%</b></td>
    <td align="right">127.89KB</td>
    <td align="right">2.16%</td>
    <td align="right"><b>2.17%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://html.spec.whatwg.org">html</a></th>
    <td align="right">10.23MB</td>
    <td align="right">3.68%</td>
    <td align="right"><b>3.70%</b></td>
    <td align="right">1.59MB</td>
    <td align="right">5.57%</td>
    <td align="right"><b>5.62%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.linkedin.com/">linkedin</a></th>
    <td align="right">99.17KB</td>
    <td align="right">35.71%</td>
    <td align="right"><b>35.99%</b></td>
    <td align="right">10.77KB</td>
    <td align="right">14.69%</td>
    <td align="right"><b>15.05%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.microsoft.com/en-us/">microsoft</a></th>
    <td align="right">180.79KB</td>
    <td align="right">9.61%</td>
    <td align="right"><b>21.32%</b></td>
    <td align="right">37.71KB</td>
    <td align="right">4.64%</td>
    <td align="right"><b>7.40%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nbc.com/">nbc</a></th>
    <td align="right">1.44MB</td>
    <td align="right">4.66%</td>
    <td align="right"><b>4.88%</b></td>
    <td align="right">177.58KB</td>
    <td align="right">1.39%</td>
    <td align="right"><b>1.39%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.npmjs.com/">npm</a></th>
    <td align="right">29.79KB</td>
    <td align="right"><b>10.64%</b></td>
    <td align="right">10.20%</td>
    <td align="right">8.8KB</td>
    <td align="right"><b>4.80%</b></td>
    <td align="right">4.22%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nytimes.com/">nytimes</a></th>
    <td align="right">1.41MB</td>
    <td align="right"><b>7.16%</b></td>
    <td align="right">7.15%</td>
    <td align="right">132.5KB</td>
    <td align="right"><b>3.29%</b></td>
    <td align="right">3.27%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://rocket.chat">rocketchat</a></th>
    <td align="right">55.35KB</td>
    <td align="right">33.53%</td>
    <td align="right"><b>33.90%</b></td>
    <td align="right">12.67KB</td>
    <td align="right"><b>13.35%</b></td>
    <td align="right">13.33%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://slack.com/intl/en-gb/features">slack</a></th>
    <td align="right">113.55KB</td>
    <td align="right"><b>5.35%</b></td>
    <td align="right">5.27%</td>
    <td align="right">27.34KB</td>
    <td align="right"><b>2.31%</b></td>
    <td align="right">2.19%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://stackoverflow.com/">stackoverflow</a></th>
    <td align="right">109.78KB</td>
    <td align="right"><b>31.24%</b></td>
    <td align="right">💥</td>
    <td align="right">19.41KB</td>
    <td align="right"><b>10.39%</b></td>
    <td align="right">💥</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://twitter.com/">twitter</a></th>
    <td align="right">303.27KB</td>
    <td align="right">8.94%</td>
    <td align="right"><b>19.69%</b></td>
    <td align="right">54.39KB</td>
    <td align="right">3.43%</td>
    <td align="right"><b>6.06%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.vice.com/en_us">vice</a></th>
    <td align="right">299.71KB</td>
    <td align="right"><b>9.01%</b></td>
    <td align="right">8.89%</td>
    <td align="right">48.9KB</td>
    <td align="right"><b>4.09%</b></td>
    <td align="right">4.03%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://en.wikipedia.org/wiki/President_of_the_United_States">wikipedia</a></th>
    <td align="right">580.77KB</td>
    <td align="right">6.06%</td>
    <td align="right"><b>6.70%</b></td>
    <td align="right">111.5KB</td>
    <td align="right"><b>1.99%</b></td>
    <td align="right">1.90%</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <th scope="row">total</th>
    <td align="right">29.59MB</td>
    <td align="right">27.25MB</td>
    <td align="right">27.17MB</td>
    <td align="right">3.46MB</td>
    <td align="right">3.3MB</td>
    <td align="right">3.29MB</td>
  </tr>
</tfoot>
</table>

<!--benchmark end-->

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
