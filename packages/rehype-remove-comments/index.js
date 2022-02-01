/**
 * rehype plugin to remove comments.
 *
 * ## What is this?
 *
 * This package is a plugin that removes comments.
 * By default it keeps conditional comments, optionally it removes them too.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveComments[, options])`
 *
 * Remove comments.
 *
 * ##### `options`
 *
 * Configuration (optional).
 *
 * ###### `options.removeConditional`
 *
 * Whether to remove conditional comments too (`boolean`, default: `false`).
 * The default behavior is to keep conditional comments.
 * Conditional comments are a legacy feature that was specific to Internet
 * Explorer.
 * They were no longer used in IE 10.
 *
 * @example
 *   <!--Hello-->
 *   <!--[if IE 6]>OK<![endif]-->
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('unist').Node} Node
 * @typedef {Root|Root['children'][number]} HastNode
 *
 * @typedef Options
 *   Configuration.
 * @property {boolean} [removeConditional=false]
 *   Conditional comments are also removed when configured with `force: true`
 *   The default is to leave them.
 */

import {filter} from 'unist-util-filter'
import {isConditionalComment} from 'hast-util-is-conditional-comment'

/**
 * Remove comments (except conditional comments).
 *
 * When configured with `force: true` (default: `false`), conditional comments
 * are also removed.
 *
 * @type {import('unified').Plugin<[Options?]|Array<void>, Root>}
 */
export default function rehypeRemoveComments(options = {}) {
  const force = options.removeConditional

  return (tree) =>
    // `undefined` is never returned because we don’t remove nodes (but TS
    // doesn’t know it.)
    /* c8 ignore next */
    filter(tree, {cascade: false}, force ? hard : soft) || undefined
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function soft(node) {
  const x = /** @type {HastNode} */ (node)
  return hard(x) || isConditionalComment(x)
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function hard(node) {
  const x = /** @type {HastNode} */ (node)
  return x.type !== 'comment'
}
