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
<!doctypehtml><html lang=en><meta charset=utf8><script src=index.js></script><link href=index.css rel=stylesheet><title>Foo &amp bar</title><h1 class=foo>bar bar</h1><p id=alfred><strong>foo</strong> <em>bar</em></p><button onclick=return!1 type=button>Alpha</button>
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
*   [`rehype-minify-language`](./packages/rehype-minify-language)
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
    <td align="right">446.35KB</td>
    <td align="right">7.74%</td>
    <td align="right"><b>8.83%</b></td>
    <td align="right">114.03KB</td>
    <td align="right">6.38%</td>
    <td align="right"><b>6.75%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.bbc.co.uk/">bbc</a></th>
    <td align="right">293.18KB</td>
    <td align="right"><b>3.65%</b></td>
    <td align="right">3.45%</td>
    <td align="right">36.3KB</td>
    <td align="right"><b>1.72%</b></td>
    <td align="right">1.71%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://getbootstrap.com/docs/4.4/getting-started/introduction/">bootstrap</a></th>
    <td align="right">35.18KB</td>
    <td align="right">21.66%</td>
    <td align="right"><b>22.08%</b></td>
    <td align="right">8.4KB</td>
    <td align="right">4.85%</td>
    <td align="right"><b>5.08%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://kangax.github.io/compat-table/es6/">compat table</a></th>
    <td align="right">7.6MB</td>
    <td align="right">16.67%</td>
    <td align="right"><b>16.97%</b></td>
    <td align="right">241.77KB</td>
    <td align="right">3.69%</td>
    <td align="right"><b>5.51%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://tc39.es/ecma262/">ecmascript</a></th>
    <td align="right">6.58MB</td>
    <td align="right">9.55%</td>
    <td align="right"><b>10.09%</b></td>
    <td align="right">790.72KB</td>
    <td align="right">5.26%</td>
    <td align="right"><b>5.43%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://eloquentjavascript.net/20_node.html">eloquent</a></th>
    <td align="right">80.09KB</td>
    <td align="right">6.43%</td>
    <td align="right"><b>6.45%</b></td>
    <td align="right">19.13KB</td>
    <td align="right">1.24%</td>
    <td align="right"><b>1.26%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://github.com">github</a></th>
    <td align="right">184.92KB</td>
    <td align="right"><b>16.86%</b></td>
    <td align="right">16.18%</td>
    <td align="right">34.39KB</td>
    <td align="right">7.00%</td>
    <td align="right"><b>7.20%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.google.com/">google</a></th>
    <td align="right">13.01KB</td>
    <td align="right"><b>7.60%</b></td>
    <td align="right">7.56%</td>
    <td align="right">5.75KB</td>
    <td align="right"><b>4.56%</b></td>
    <td align="right">4.26%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.theguardian.com/us">guardian</a></th>
    <td align="right">929.59KB</td>
    <td align="right">3.76%</td>
    <td align="right"><b>4.20%</b></td>
    <td align="right">128.07KB</td>
    <td align="right">2.78%</td>
    <td align="right"><b>2.93%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://html.spec.whatwg.org">html</a></th>
    <td align="right">11.17MB</td>
    <td align="right">3.28%</td>
    <td align="right"><b>3.31%</b></td>
    <td align="right">1.66MB</td>
    <td align="right">5.41%</td>
    <td align="right"><b>5.49%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.linkedin.com/">linkedin</a></th>
    <td align="right">84.47KB</td>
    <td align="right"><b>38.03%</b></td>
    <td align="right">37.97%</td>
    <td align="right">10.54KB</td>
    <td align="right"><b>13.70%</b></td>
    <td align="right">13.43%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.microsoft.com/en-us/">microsoft</a></th>
    <td align="right">197.87KB</td>
    <td align="right">8.82%</td>
    <td align="right"><b>21.02%</b></td>
    <td align="right">40.16KB</td>
    <td align="right">4.44%</td>
    <td align="right"><b>6.85%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nbc.com/">nbc</a></th>
    <td align="right">1.48MB</td>
    <td align="right">5.65%</td>
    <td align="right"><b>5.79%</b></td>
    <td align="right">214.5KB</td>
    <td align="right"><b>1.88%</b></td>
    <td align="right">1.77%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.npmjs.com/">npm</a></th>
    <td align="right">23.12KB</td>
    <td align="right"><b>8.31%</b></td>
    <td align="right">7.89%</td>
    <td align="right">7.13KB</td>
    <td align="right"><b>4.36%</b></td>
    <td align="right">3.99%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nytimes.com/">nytimes</a></th>
    <td align="right">1.17MB</td>
    <td align="right"><b>8.90%</b></td>
    <td align="right">8.59%</td>
    <td align="right">123.83KB</td>
    <td align="right"><b>4.42%</b></td>
    <td align="right">4.12%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://rocket.chat">rocketchat</a></th>
    <td align="right">186.83KB</td>
    <td align="right"><b>12.15%</b></td>
    <td align="right">💥</td>
    <td align="right">28.81KB</td>
    <td align="right"><b>7.10%</b></td>
    <td align="right">💥</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://slack.com/intl/en-gb/features">slack</a></th>
    <td align="right">119.24KB</td>
    <td align="right"><b>4.81%</b></td>
    <td align="right">3.94%</td>
    <td align="right">35.76KB</td>
    <td align="right"><b>1.95%</b></td>
    <td align="right">1.55%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://stackoverflow.com/">stackoverflow</a></th>
    <td align="right">117.91KB</td>
    <td align="right">31.43%</td>
    <td align="right"><b>33.03%</b></td>
    <td align="right">22.1KB</td>
    <td align="right">9.95%</td>
    <td align="right"><b>10.84%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://twitter.com/">twitter</a></th>
    <td align="right">42.86KB</td>
    <td align="right"><b>9.40%</b></td>
    <td align="right">9.11%</td>
    <td align="right">13.33KB</td>
    <td align="right"><b>3.70%</b></td>
    <td align="right">3.45%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.vice.com/en_us">vice</a></th>
    <td align="right">182.35KB</td>
    <td align="right"><b>5.29%</b></td>
    <td align="right">4.91%</td>
    <td align="right">40.65KB</td>
    <td align="right"><b>4.89%</b></td>
    <td align="right">4.70%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://en.wikipedia.org/wiki/President_of_the_United_States">wikipedia</a></th>
    <td align="right">658.95KB</td>
    <td align="right">6.06%</td>
    <td align="right"><b>6.81%</b></td>
    <td align="right">126.5KB</td>
    <td align="right">1.89%</td>
    <td align="right"><b>2.12%</b></td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <th scope="row">total</th>
    <td align="right">31.52MB</td>
    <td align="right">29.07MB</td>
    <td align="right">29.02MB</td>
    <td align="right">3.65MB</td>
    <td align="right">3.48MB</td>
    <td align="right">3.48MB</td>
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

[build-badge]: https://github.com/rehypejs/rehype-minify/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-minify/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-minify.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-minify

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[logo]: https://raw.githubusercontent.com/rehypejs/rehype-minify/942349c/logo.svg?sanitize=true

[cli]: ./packages/rehype-preset-minify/readme.md#cli

[api]: ./packages/rehype-preset-minify/readme.md#api

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[sanitize]: https://github.com/rehypejs/rehype-sanitize

[stringify]: https://github.com/rehypejs/rehype/tree/HEAD/packages/rehype-stringify#api

[html-minifier]: https://github.com/kangax/html-minifier
