/**
 * @import {Root} from 'hast'
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'

const clean = new CleanCSS()

const prefix = '*{'
const suffix = '}'

/**
 * Minify `style` attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyStyleAttribute() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      let value = node.properties.style

      if (typeof value === 'string') {
        try {
          const output = clean.minify(prefix + value + suffix).styles
          value = output ? output.slice(prefix.length, -suffix.length) : value
          /* c8 ignore next -- in a try/catch for potential future third party errors */
        } catch {}

        node.properties.style = value || undefined
      }
    })
  }
}
