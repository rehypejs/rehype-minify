/**
 * @import {Root} from 'hast'
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'

const clean = new CleanCSS()

const prefix = '*{color:'
const suffix = '}'

/**
 * Minify color attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyMetaColor() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (
        node.tagName === 'meta' &&
        (node.properties.name === 'msapplication-TileColor' ||
          node.properties.name === 'theme-color')
      ) {
        let value = node.properties.content

        if (typeof value === 'string') {
          try {
            const output = clean.minify(prefix + value + suffix)
            value = output.styles.slice(prefix.length, -suffix.length)
            /* c8 ignore next -- in a try/catch for potential future third party errors */
          } catch {}

          node.properties.content = value
        }
      }
    })
  }
}
