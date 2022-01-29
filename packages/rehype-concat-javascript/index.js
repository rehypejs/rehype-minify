/**
 * rehype plugin to concatenate `<script>`s together.
 *
 * ## What is this?
 *
 * This package is a plugin that can improve performance by merging multiple
 * JS `<script>` elements together.
 * This plugin can be dangerous if JavaScript is invalid or values are expected
 * to be `undefined` in one script but not in another.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you are certain that your JavaScript is
 * and you want to improve the size of HTML.
 *
 * ## API
 *
 * ### `unified().use(rehypeConcatJavaScript)`
 *
 * Concatenate `<script>` elements together.
 * There are no options.
 *
 * @example
 *   <script>function foo() {}</script>
 *   <script>function bar() {}</script>
 */

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isJavaScript} from 'hast-util-is-javascript'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * Concatenate JS `<script>` elements together.
 *
 * This plugin can be dangerous if a) JS is invalid, or b) values are expected
 * to be undefined in one script and defined in another.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeConcatJavaScript() {
  return (tree) => {
    /** @type {Array<[Root|Element, Element]>} */
    const matches = []

    visit(tree, 'element', (node, _, parent) => {
      if (isJavaScript(node) && !hasProperty(node, 'src')) {
        // @ts-expect-error: `parent` matches.
        matches.push([parent, node])
      }
    })

    if (matches.length > 1) {
      concat()
    }

    function concat() {
      let index = -1
      /** @type {Array<string>} */
      const contents = []

      while (++index < matches.length) {
        const match = matches[index]

        if (index) {
          const siblings = match[0].children
          siblings.splice(siblings.indexOf(match[1]), 1)
        }

        contents[index] = toString(match[1])
      }

      fromString(matches[0][1], contents.join(';'))
    }
  }
}
