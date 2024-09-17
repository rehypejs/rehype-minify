/**
 * @import {Root} from 'hast'
 */

import {bcp47Normalize} from 'bcp-47-normalize'
import {visit} from 'unist-util-visit'

const fields = ['hrefLang', 'lang', 'srcLang', 'xmlLang']

/**
 * Minify language attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyLanguage() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      let index = -1

      while (++index < fields.length) {
        const property = fields[index]
        const value = node.properties[property]

        if (typeof value === 'string') {
          // BCP 47 tags are case-insensitive, but in this project we prefer
          // lowercase which *should* help GZIP.
          node.properties[property] = (
            bcp47Normalize(value) || value
          ).toLowerCase()
        }
      }
    })
  }
}
