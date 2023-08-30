/**
 * @typedef {import('hast').Root} Root
 */

import {isJavaScript} from 'hast-util-is-javascript'
import {visit} from 'unist-util-visit'

/**
 * Remove content of external JavaScript `script` elements.
 *
 * @returns
 *   Transform.
 */
export default function rehypeRemoveExternalScriptContent() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (isJavaScript(node) && node.properties.src) {
        node.children = []
      }
    })
  }
}
