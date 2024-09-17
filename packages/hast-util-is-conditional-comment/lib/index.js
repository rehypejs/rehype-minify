/**
 * @import {Nodes} from 'hast'
 */

const re = /^\[if[ \t\f\n\r]+[^\]]+]|<!\[endif]$/

/**
 * Check if a node is a conditional comment.
 *
 * @param {Nodes} node
 *   Node to check.
 * @returns {boolean}
 *   Whether `node` is a conditional comment.
 */
export function isConditionalComment(node) {
  return node.type === 'comment' && re.test(node.value)
}
