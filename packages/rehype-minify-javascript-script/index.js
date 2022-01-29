/**
 * rehype plugin to minify JavaScript `<script>`s.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the contents of JavaScript
 * `<script>`s.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyJavaScriptScript)`
 *
 * Minify JavaScript `<script>`s.
 * There are no options.
 *
 * @example
 *   <script>
 *     var name = "World";
 *     console.log("Hello, " + name + "!");
 *   </script>
 */

import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'
import {isJavaScript} from 'hast-util-is-javascript'
import {hasProperty} from 'hast-util-has-property'

/**
 * @typedef {import('hast').Root} Root
 */

/**
 * Minify `script` elements with a JavaScript body.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeMinifyJavaScriptScript() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (isJavaScript(node) && !hasProperty(node, 'src')) {
        try {
          let value = Uglify.minify(toString(node)).code

          if (value.charAt(value.length - 1) === ';') {
            value = value.slice(0, -1)
          }

          fromString(node, value)
          // Potential third party errors?
          /* c8 ignore next */
        } catch {}
      }
    })
  }
}
