/**
 * @import {Root} from 'hast'
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'

const clean = new CleanCSS()

const prefix = '@media '
const suffix = '{i{color:red}}'

/**
 * Minify media attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyMediaAttribute() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (
        node.properties &&
        (node.tagName === 'link' ||
          node.tagName === 'source' ||
          node.tagName === 'style')
      ) {
        let value = node.properties.media

        if (typeof value === 'string') {
          try {
            const output = clean.minify(prefix + value + suffix)
            value = output.styles.slice(prefix.length, -suffix.length)
            /* c8 ignore next -- in a try/catch for potential future third party errors */
          } catch {}

          node.properties.media = value === 'all' || !value ? undefined : value
        }
      }
    })
  }
}
