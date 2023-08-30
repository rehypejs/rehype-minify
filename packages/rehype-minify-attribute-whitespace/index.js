/**
 * rehype plugin to minify whitespace in attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can remove unneeded whitespace around the
 * values of certain attributes.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyAttributeWhitespace)`
 *
 * Minify whitespace in attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <a href="  http://example.com "></a>
 */

export {default} from './lib/index.js'
