/**
 * rehype plugin to remove empty attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that removes whole attributes when their value is
 * empty.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveEmptyAttribute)`
 *
 * Remove empty attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <label for id=""></label>
 */

export {default} from './lib/index.js'
