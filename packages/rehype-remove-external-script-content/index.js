/**
 * @fileoverview
 *   Remove content of external JavaScript `script` elements.
 * @example
 *   <script src="index.js">Hello!</script>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isJavaScript} from 'hast-util-is-javascript'
import {hasProperty} from 'hast-util-has-property'

/**
 * Remove content of external JavaScript `script` elements.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeRemoveExternalScriptContent() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (isJavaScript(node) && hasProperty(node, 'src')) {
        node.children = []
      }
    })
  }
}
