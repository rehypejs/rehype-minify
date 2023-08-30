/**
 * rehype plugin to minify `style` attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the value of `style` attributes.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyStyleAttribute)`
 *
 * Minify `style` attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <img style="display: block;">
 */

export {default} from './lib/index.js'
