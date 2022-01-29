/**
 * rehype plugin to remove `type` and `language` attributes on
 * JavaScript scripts.
 *
 * ## What is this?
 *
 * This package is a plugin that removes `type` and/or `language` attributes
 * on JavaScript scripts, as they are unneeded.
 * This plugin does not touch other `<script>` elements (such as JavaScript
 * modules or non-JavaScript scripts).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveScriptTypeJavaScript)`
 *
 * Remove `type` and `language` attributes on JavaScript scripts.
 * There are no options.
 *
 * @example
 *   <script type="text/javascript"></script>
 *   <script language="javascript1.5"></script>
 *   <script type="module"></script>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isJavaScript} from 'hast-util-is-javascript'

/**
 * Remove `type` and `language` on JavaScript scripts.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
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
