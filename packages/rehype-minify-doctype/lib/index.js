/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'

// To do: deprecate.

/**
 * Minify the doctype.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyDoctype() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'doctype', function (node) {
      // @ts-expect-error: removed from `hast`.
      if (node.public) node.public = undefined

      // @ts-expect-error: removed from `hast`.
      if (node.system) node.system = undefined

      return false
    })
  }
}
