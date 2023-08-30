/**
 * rehype plugin to normalize casing of attribute values.
 *
 * ## What is this?
 *
 * This package is a plugin that normalizes the casing of certain attribute
 * values, which optimizes for repetition-based compression (such as GZip).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeNormalizeAttributeValueCase)`
 *
 * Normalize casing of attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <form method="GET"></form>
 */

export {default} from './lib/index.js'
