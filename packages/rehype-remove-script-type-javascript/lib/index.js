/**
 * @typedef {import('hast').Root} Root
 */

import {isJavaScript} from 'hast-util-is-javascript'
import {visit} from 'unist-util-visit'

/**
 * Remove `type` and `language` on JavaScript scripts.
 *
 * @returns
 *   Transform.
 */
export default function rehypeRemoveScriptTypeJavaScript() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (isJavaScript(node)) {
        if ('type' in node.properties) {
          node.properties.type = undefined
        }

        if ('language' in node.properties) {
          node.properties.language = undefined
        }
      }
    })
  }
}
