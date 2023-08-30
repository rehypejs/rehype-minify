/**
 * rehype plugin to remove duplicates in attributes values.
 *
 * ## What is this?
 *
 * This package is a plugin that removes duplicates amongst attribute values of
 * unique tokens (such as `class`).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveDuplicateAttributeValues)`
 *
 * Remove duplicates in attributes values.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <div class="foo foo"></div>
 */

export {default} from './lib/index.js'
