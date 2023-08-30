# ![rehype-minify][logo]

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugins to minify HTML.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Presets](#presets)
*   [Plugins](#plugins)
*   [Benchmark](#benchmark)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This GitHub repository is a monorepo that contains a couple utilities, ±30
plugins, and a preset with good and safe default, to minify HTML:

###### In

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

###### Out

```html
<!doctypehtml><html lang=en><meta charset=utf8><script src=index.js></script><link href=index.css rel=stylesheet><title>Foo &#38 bar</title><h1 class=foo>bar bar</h1><p id=alfred><strong>foo</strong> <em>bar</em></p><button onclick=return!1 type=button>Alpha</button>
```

## When should I use this?

This project is useful when you want to improve the size of HTML documents.
It’s particularly useful when you’re already using rehype (and remark?) to
process HTML.

## Presets

Presets are combinations of plugins.
One preset is maintained here:

*   [`rehype-preset-minify`][rehype-preset-minify]
    — preset to minify and mangle HTML

## Plugins

The following plugins maintained here are included in the above preset.

<!--
  👉 **Note**: the following list is automatically generated.
-->

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

The following plugins are not included in the preset as they are potentially
**dangerous**, can make sites slower in certain cases, or need extra
configuration.
Read their readmes before using:

<!--
  👉 **Note**: the following list is automatically generated.
-->

<!--plugins-other start-->

*   [`rehype-concat-css-style`](./packages/rehype-concat-css-style)
*   [`rehype-concat-javascript`](./packages/rehype-concat-javascript)
*   [`rehype-css-to-top`](./packages/rehype-css-to-top)
*   [`rehype-javascript-to-bottom`](./packages/rehype-javascript-to-bottom)
*   [`rehype-minify-url`](./packages/rehype-minify-url)
*   [`rehype-prevent-favicon-request`](./packages/rehype-prevent-favicon-request)

<!--plugins-other end-->

Also: pass [`allowDangerousCharacters` to `rehype-stringify`][rehype-stringify]
if you trust your content.

## Benchmark

Here’s a benchmark comparing the results from [`html-minifier`][html-minifier]
and `rehype-minify`.
To summarize: differences are negligible, in fact, minifying HTML doesn’t matter
much.
What does matter is using good compressions, such as gzip.
Note: `html-minifier` sometimes crashes, such as on amazon.

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
    <td align="right">567.85KB</td>
    <td align="right"><b>5.71%</b></td>
    <td align="right">💥</td>
    <td align="right">128.65KB</td>
    <td align="right"><b>5.07%</b></td>
    <td align="right">💥</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.bbc.co.uk/">bbc</a></th>
    <td align="right">531.54KB</td>
    <td align="right"><b>4.70%</b></td>
    <td align="right">4.58%</td>
    <td align="right">58.09KB</td>
    <td align="right">1.85%</td>
    <td align="right"><b>1.96%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://getbootstrap.com/docs/4.4/getting-started/introduction/">bootstrap</a></th>
    <td align="right">33.96KB</td>
    <td align="right">22.36%</td>
    <td align="right"><b>22.82%</b></td>
    <td align="right">8.12KB</td>
    <td align="right">5.17%</td>
    <td align="right"><b>5.36%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://kangax.github.io/compat-table/es6/">compat-table</a></th>
    <td align="right">8.67MB</td>
    <td align="right">16.34%</td>
    <td align="right"><b>16.74%</b></td>
    <td align="right">275.06KB</td>
    <td align="right">8.26%</td>
    <td align="right"><b>10.06%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://tc39.es/ecma262/">ecmascript</a></th>
    <td align="right">6.62MB</td>
    <td align="right">10.86%</td>
    <td align="right"><b>11.56%</b></td>
    <td align="right">789.66KB</td>
    <td align="right">6.39%</td>
    <td align="right"><b>6.60%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://eloquentjavascript.net/20_node.html">eloquent</a></th>
    <td align="right">80.08KB</td>
    <td align="right">6.43%</td>
    <td align="right"><b>6.45%</b></td>
    <td align="right">19.13KB</td>
    <td align="right">1.25%</td>
    <td align="right"><b>1.26%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://github.com">github</a></th>
    <td align="right">233.14KB</td>
    <td align="right">13.39%</td>
    <td align="right"><b>14.51%</b></td>
    <td align="right">38.86KB</td>
    <td align="right">7.48%</td>
    <td align="right"><b>7.91%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.google.com">google</a></th>
    <td align="right">253.98KB</td>
    <td align="right">3.13%</td>
    <td align="right"><b>3.20%</b></td>
    <td align="right">80.56KB</td>
    <td align="right"><b>3.64%</b></td>
    <td align="right">3.63%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.theguardian.com">guardian</a></th>
    <td align="right">765.54KB</td>
    <td align="right">6.75%</td>
    <td align="right"><b>8.71%</b></td>
    <td align="right">112.21KB</td>
    <td align="right">3.96%</td>
    <td align="right"><b>4.38%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://html.spec.whatwg.org">html</a></th>
    <td align="right">12.72MB</td>
    <td align="right">3.15%</td>
    <td align="right"><b>3.19%</b></td>
    <td align="right">1.85MB</td>
    <td align="right">5.49%</td>
    <td align="right"><b>5.58%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.linkedin.com/">linkedin</a></th>
    <td align="right">120.77KB</td>
    <td align="right">32.29%</td>
    <td align="right"><b>32.34%</b></td>
    <td align="right">14.4KB</td>
    <td align="right"><b>13.99%</b></td>
    <td align="right">13.91%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.microsoft.com">microsoft</a></th>
    <td align="right">174.26KB</td>
    <td align="right">22.44%</td>
    <td align="right"><b>34.12%</b></td>
    <td align="right">26.45KB</td>
    <td align="right">12.96%</td>
    <td align="right"><b>15.45%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nbc.com">nbc</a></th>
    <td align="right">1.64MB</td>
    <td align="right">5.94%</td>
    <td align="right"><b>6.28%</b></td>
    <td align="right">221.08KB</td>
    <td align="right">1.86%</td>
    <td align="right"><b>1.92%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.npmjs.com">npm</a></th>
    <td align="right">27.98KB</td>
    <td align="right"><b>3.03%</b></td>
    <td align="right">2.61%</td>
    <td align="right">8.28KB</td>
    <td align="right"><b>2.22%</b></td>
    <td align="right">2.01%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.nytimes.com">nytimes</a></th>
    <td align="right">822.38KB</td>
    <td align="right">11.80%</td>
    <td align="right"><b>11.80%</b></td>
    <td align="right">137.47KB</td>
    <td align="right">2.71%</td>
    <td align="right"><b>2.72%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://slack.com">slack</a></th>
    <td align="right">205.45KB</td>
    <td align="right"><b>4.76%</b></td>
    <td align="right">4.55%</td>
    <td align="right">49.63KB</td>
    <td align="right"><b>2.06%</b></td>
    <td align="right">1.98%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://stackoverflow.com">stackoverflow</a></th>
    <td align="right">169.8KB</td>
    <td align="right">18.64%</td>
    <td align="right"><b>19.10%</b></td>
    <td align="right">45.4KB</td>
    <td align="right">6.42%</td>
    <td align="right"><b>6.67%</b></td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://www.vice.com">vice</a></th>
    <td align="right">337.93KB</td>
    <td align="right"><b>3.48%</b></td>
    <td align="right">3.22%</td>
    <td align="right">92.58KB</td>
    <td align="right"><b>2.61%</b></td>
    <td align="right">2.52%</td>
  </tr>
  <tr>
    <th scope="row" align="left"><a href="https://en.wikipedia.org/wiki/President_of_the_United_States">wikipedia</a></th>
    <td align="right">768.18KB</td>
    <td align="right">6.08%</td>
    <td align="right"><b>6.76%</b></td>
    <td align="right">144KB</td>
    <td align="right">1.58%</td>
    <td align="right"><b>1.77%</b></td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <th scope="row">total</th>
    <td align="right">34.63MB</td>
    <td align="right">31.9MB</td>
    <td align="right">31.83MB</td>
    <td align="right">4.05MB</td>
    <td align="right">3.85MB</td>
    <td align="right">3.85MB</td>
  </tr>
</tfoot>
</table>

<!--benchmark end-->

Huge differences in results are suspicious and may point to bugs.

💥 — Crash.

## Security

Use of `rehype-preset-minify` is *safe* by default if the tree is already safe.
As **rehype** works on HTML and improper use of HTML can open you up to a
[cross-site scripting (XSS)][xss] attack, use of rehype can also be unsafe.
Use [`rehype-sanitize`][rehype-sanitize] to make the tree safe.

To further optimize the result disregarding security, use the extra plugins
listed above and pass [`allowDangerousCharacters` to
`rehype-stringify`][rehype-stringify].

## Related

*   [`rehype-format`](https://github.com/rehypejs/rehype-format)
    — format HTML

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

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[logo]: https://raw.githubusercontent.com/rehypejs/rehype-minify/6f0f096/logo.svg?sanitize=true

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[rehype-preset-minify]: https://github.com/rehypejs/rehype-minify/tree/main/packages/rehype-preset-minify

[rehype-stringify]: https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify#api

[html-minifier]: https://github.com/kangax/html-minifier
