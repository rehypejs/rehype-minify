/**
 * @import {Root} from 'hast'
 */

/**
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [removeConditional=false]
 *   Remove conditional comments (default: `false`);
 *   the default is to leave them.
 * @property {Test | null | undefined} [test]
 *   Choose which comments to keep.
 *
 * @callback Test
 *   Test a comment.
 * @param {string} value
 *   Comment value.
 * @returns {boolean | null | undefined}
 *   Whether to keep the comment.
 */

import {isConditionalComment} from 'hast-util-is-conditional-comment'
import {visit} from 'unist-util-visit'

/** @type {Options} */
const emptyOptions = {}

/**
 * Remove comments (except conditional comments).
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeRemoveComments(options) {
  const settings = options || emptyOptions

  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'comment', function (node, index, parent) {
      if (
        typeof index === 'number' &&
        parent &&
        (settings.removeConditional || !isConditionalComment(node)) &&
        (!settings.test || !settings.test(node.value))
      ) {
        parent.children.splice(index, 1)
        return index
      }
    })
  }
}
