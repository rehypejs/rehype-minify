/**
 * rehype plugin to minify event handlers.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the JavaScript used as the values of
 * event handler attributes.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyEventHandler)`
 *
 * Minify whitespace in attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <h1 onclick="javascript:alert(false)">Hello</h1>
 */

export {default} from './lib/index.js'
