/**
 * @typedef {import('hast').Root} Root
 *
 * @typedef Options
 *   Configuration.
 * @property {boolean | null | undefined} [removeConditional=false]
 *   Remove conditional comments (default: `false`).
 *
 *   The default is to leave them.
 */

import {isConditionalComment} from 'hast-util-is-conditional-comment'
import {visit} from 'unist-util-visit'

/** @type {Options} */
const emptyOptions = {}

/**
 * Remove comments (except conditional comments).
 *
 * Pass `removeConditional: true` to also remove them.
 * are also removed.
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
        (settings.removeConditional || !isConditionalComment(node))
      ) {
        parent.children.splice(index, 1)
        return index
      }
    })
  }
}
