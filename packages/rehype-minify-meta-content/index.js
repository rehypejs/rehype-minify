/**
 * rehype plugin to minify `content` attributes on `<meta>` elements.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the value of the `content` attribute
 * of `<meta>` elements.
 *
 * Note that `meta[name=theme-color]` and `meta[name=msapplication-TileColor]`
 * are handled by
 * [`rehype-minify-meta-color`](https://github.com/rehypejs/rehype-minify/tree/main/packages/rehype-minify-meta-color).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyMetaContent)`
 *
 * Minify `content` attributes on `meta` elements.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
 *   <meta name="keywords" content="foo, bar baz, qux">
 */

export {default} from './lib/index.js'
