/**
 * rehype plugin to minify color attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the value of the `content` attribute
 * of `<meta>` elements with a `name` attribute whose value is either
 * `theme-color` or `msapplication-TileColor`, and thus represents a CSS color.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyMetaColor)`
 *
 * Minify color attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <meta name="theme-color" content="#0000ff">
 *   <meta name="msapplication-TileColor" content="#ff0000">
 */

export {default} from './lib/index.js'
