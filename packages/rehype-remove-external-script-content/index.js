/**
 * rehype plugin to remove the contents of external JavaScript `<script>`s.
 *
 * ## What is this?
 *
 * This package is a plugin that removes the contents of JavaScript `<script>`s
 * that also have an `src` attribute.
 * Scripts are supposed to be either external (with `src`) or internal (with
 * code in them), and both is nonsensical.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveExternalScriptContent)`
 *
 * Remove the contents of external JavaScript `<script>`s.
 * There are no options.
 *
 * @example
 *   <script src="index.js">console.log(1);</script>
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
 * @type {import('unified').Plugin<Array<void>, Root>}
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
