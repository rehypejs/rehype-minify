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
    <td align="right">421.49KB</td>
    <td align="right">8.21%</td>
    <td align="right"><b>23.02%</b></td>
    <td align="right">112.46KB</td>
    <td align="right">6.36%</td>
    <td align="right"><b>21.09%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.bbc.co.uk/">bbc</a></th>
    <td align="right">274.29KB</td>
    <td align="right">14.24%</td>
    <td align="right"><b>16.11%</b></td>
    <td align="right">41.48KB</td>
    <td align="right">11.38%</td>
    <td align="right"><b>12.52%</b></td>
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
    <td align="right">7.55MB</td>
    <td align="right">16.57%</td>
    <td align="right"><b>16.85%</b></td>
    <td align="right">240.34KB</td>
    <td align="right">4.78%</td>
    <td align="right"><b>6.35%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://tc39.es/ecma262/">ecmascript</a></th>
    <td align="right">6.49MB</td>
    <td align="right">8.78%</td>
    <td align="right"><b>9.10%</b></td>
    <td align="right">782.31KB</td>
    <td align="right"><b>4.96%</b></td>
    <td align="right">4.95%</td>
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
    <td align="right">134.37KB</td>
    <td align="right"><b>13.51%</b></td>
    <td align="right">12.42%</td>
    <td align="right">35.02KB</td>
    <td align="right">4.62%</td>
    <td align="right"><b>4.66%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.google.com/">google</a></th>
    <td align="right">12.22KB</td>
    <td align="right"><b>7.92%</b></td>
    <td align="right">7.85%</td>
    <td align="right">5.36KB</td>
    <td align="right"><b>4.85%</b></td>
    <td align="right">4.45%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.theguardian.com/us">guardian</a></th>
    <td align="right">855.78KB</td>
    <td align="right">3.95%</td>
    <td align="right"><b>4.41%</b></td>
    <td align="right">119.37KB</td>
    <td align="right"><b>2.45%</b></td>
    <td align="right">2.44%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://html.spec.whatwg.org">html</a></th>
    <td align="right">11.22MB</td>
    <td align="right">3.36%</td>
    <td align="right"><b>3.38%</b></td>
    <td align="right">1.67MB</td>
    <td align="right">5.48%</td>
    <td align="right"><b>5.53%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.linkedin.com/">linkedin</a></th>
    <td align="right">87.02KB</td>
    <td align="right"><b>37.90%</b></td>
    <td align="right">37.85%</td>
    <td align="right">10.33KB</td>
    <td align="right">14.06%</td>
    <td align="right"><b>14.20%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.microsoft.com/en-us/">microsoft</a></th>
    <td align="right">191.64KB</td>
    <td align="right">9.00%</td>
    <td align="right"><b>21.10%</b></td>
    <td align="right">39.26KB</td>
    <td align="right">4.56%</td>
    <td align="right"><b>6.95%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nbc.com/">nbc</a></th>
    <td align="right">1.46MB</td>
    <td align="right">5.65%</td>
    <td align="right"><b>5.81%</b></td>
    <td align="right">205.19KB</td>
    <td align="right"><b>1.47%</b></td>
    <td align="right">1.31%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.npmjs.com/">npm</a></th>
    <td align="right">25.3KB</td>
    <td align="right"><b>7.93%</b></td>
    <td align="right">7.47%</td>
    <td align="right">7.9KB</td>
    <td align="right"><b>4.17%</b></td>
    <td align="right">3.68%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nytimes.com/">nytimes</a></th>
    <td align="right">1.7MB</td>
    <td align="right"><b>9.03%</b></td>
    <td align="right">8.80%</td>
    <td align="right">157.72KB</td>
    <td align="right"><b>4.00%</b></td>
    <td align="right">3.67%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://rocket.chat">rocketchat</a></th>
    <td align="right">179.83KB</td>
    <td align="right"><b>5.32%</b></td>
    <td align="right">5.24%</td>
    <td align="right">28.76KB</td>
    <td align="right">3.69%</td>
    <td align="right"><b>3.84%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://slack.com/intl/en-gb/features">slack</a></th>
    <td align="right">119.39KB</td>
    <td align="right"><b>4.70%</b></td>
    <td align="right">3.84%</td>
    <td align="right">35.33KB</td>
    <td align="right"><b>1.79%</b></td>
    <td align="right">1.42%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://stackoverflow.com/">stackoverflow</a></th>
    <td align="right">113.38KB</td>
    <td align="right">30.72%</td>
    <td align="right"><b>32.37%</b></td>
    <td align="right">21.03KB</td>
    <td align="right">9.62%</td>
    <td align="right"><b>10.61%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://twitter.com/">twitter</a></th>
    <td align="right">41.31KB</td>
    <td align="right"><b>8.25%</b></td>
    <td align="right">7.95%</td>
    <td align="right">12.98KB</td>
    <td align="right"><b>2.90%</b></td>
    <td align="right">2.64%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.vice.com/en_us">vice</a></th>
    <td align="right">193.29KB</td>
    <td align="right"><b>4.32%</b></td>
    <td align="right">4.17%</td>
    <td align="right">38.08KB</td>
    <td align="right"><b>4.41%</b></td>
    <td align="right">4.30%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://en.wikipedia.org/wiki/President_of_the_United_States">wikipedia</a></th>
    <td align="right">601.68KB</td>
    <td align="right">6.29%</td>
    <td align="right"><b>6.92%</b></td>
    <td align="right">114.93KB</td>
    <td align="right"><b>2.04%</b></td>
    <td align="right">1.97%</td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <th scope="row">total</th>
    <td align="right">31.72MB</td>
    <td align="right">29.29MB</td>
    <td align="right">29.18MB</td>
    <td align="right">3.66MB</td>
    <td align="right">3.49MB</td>
    <td align="right">3.47MB</td>
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
