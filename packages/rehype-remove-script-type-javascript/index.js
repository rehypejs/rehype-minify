/**
 * @fileoverview
 *   Remove `type` and `language` on JavaScript scripts.
 * @example
 *   <script type="text/javascript"></script>
 *   <script language="javascript1.5"></script>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isJavaScript} from 'hast-util-is-javascript'

/**
 * Remove `type` and `language` on JavaScript scripts.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeRemoveScriptTypeJavaScript() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (isJavaScript(node) && node.properties) {
        if ('type' in node.properties) {
          node.properties.type = null
        }

        if ('language' in node.properties) {
          node.properties.language = null
        }
      }
    })
  }
}
