/**
 * hast utility to check if a node is a conditional comment.
 *
 * ## What is this?
 *
 * This package is a utility to check whether a hast node is a “conditional”
 * comment.
 * Conditional comments are a legacy feature that was specific to Internet
 * Explorer.
 * They were no longer used in IE 10.
 *
 * ## When should I use this?
 *
 * You can use this package when you’re building tools that handle old and
 * non-standard HTML, but generally it’s recommended to remove conditional
 * comments.
 *
 * ## Use
 *
 * ```js
 * import {u} from 'unist-builder'
 * import {isConditionalComment} from 'hast-util-is-conditional-comment'
 *
 * isConditionalComment(u('comment', '[if IE]>...<![endif]')) //=> true
 * isConditionalComment(u('comment', '<![endif]')) //=> true
 * isConditionalComment(u('comment', 'foo')) //=> false
 * ```
 *
 * ## API
 *
 * ### `isConditionalComment(node)`
 *
 * Check if a node is a conditional comment.
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — hast node
 *
 * ###### Returns
 *
 * Whether a node is a conditional comment (`boolean`).
 */

const re = /^\[if[ \t\f\n\r]+[^\]]+]|<!\[endif]$/

/**
 * @typedef {import('hast').Root} Root
 * @typedef {Root|Root['children'][number]} Node
 */

/**
 * Check if a node is a conditional comment.
 *
 * @param {Node} node
 * @returns {boolean}
 */
export function isConditionalComment(node) {
  return node && node.type === 'comment' && re.test(node.value)
}
