/**
 * @import {Root} from 'hast'
 */

import {fromString} from 'hast-util-from-string'
import {isJavaScript} from 'hast-util-is-javascript'
import {toString} from 'hast-util-to-string'
import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'

/**
 * Minify JavaScript `<script>`s.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyJavaScriptScript() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (isJavaScript(node) && !node.properties.src) {
        try {
          let value = Uglify.minify(toString(node)).code

          if (value.charAt(value.length - 1) === ';') {
            value = value.slice(0, -1)
          }

          fromString(node, value)
          /* c8 ignore next -- in a try/catch for potential future third party errors */
        } catch {}
      }
    })
  }
}
