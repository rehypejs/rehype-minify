/**
 * @import {Root} from 'hast'
 */

import CleanCSS from 'clean-css'
import {fromString} from 'hast-util-from-string'
import {isCssStyle} from 'hast-util-is-css-style'
import {toString} from 'hast-util-to-string'
import {visit} from 'unist-util-visit'

const clean = new CleanCSS()

/**
 * Minify CSS `<style>` elements.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyCssStyle() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (isCssStyle(node)) {
        try {
          const value = toString(node)
          fromString(node, clean.minify(value).styles || value)
          /* c8 ignore next -- in a try/catch for potential future third party errors */
        } catch {}
      }
    })
  }
}
