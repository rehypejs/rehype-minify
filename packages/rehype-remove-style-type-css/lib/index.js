/**
 * @import {Root} from 'hast'
 */

import {isCssLink} from 'hast-util-is-css-link'
import {isCssStyle} from 'hast-util-is-css-style'
import {visit} from 'unist-util-visit'

/**
 * Remove `type` attributes on CSS `<style>`s and `<link>`s.
 *
 * @returns
 *   Transform.
 */
export default function rehypeRemoveStyleTypeCss() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if ('type' in node.properties && (isCssLink(node) || isCssStyle(node))) {
        node.properties.type = undefined
      }
    })
  }
}
