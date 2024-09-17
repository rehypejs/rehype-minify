/**
 * @import {Root} from 'hast'
 */

import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'
import {visit} from 'unist-util-visit'

/**
 * Minify JSON `<script>`s.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyJsonScript() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (
        node.tagName === 'script' &&
        node.properties.type === 'application/ld+json'
      ) {
        try {
          fromString(node, JSON.stringify(JSON.parse(toString(node))))
        } catch {}
      }
    })
  }
}
