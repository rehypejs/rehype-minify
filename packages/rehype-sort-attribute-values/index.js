/**
 * rehype plugin to sort attribute values.
 *
 * ## What is this?
 *
 * This package is a plugin that sorts attribute values, which optimizes for
 * repetition-based compression (such as GZip).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeSortAttributeValues)`
 *
 * Sort attribute values.
 * There are no options.
 *
 * @example
 *   <div class="qux quux foo bar"></div>
 */

export {default} from './lib/index.js'
