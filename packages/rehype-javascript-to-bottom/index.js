/**
 * rehype plugin to move JavaScript `<script>`s to the end of the body.
 *
 * ## What is this?
 *
 * This package is a plugin that can improve performance by *decreasing* the
 * time to
 * [first render](https://developer.yahoo.com/performance/rules.html#js_bottom).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the speed of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeJavaScriptToBottom[, options])`
 *
 * Move JavaScript `<script>`s to the end of `<body>`.
 *
 * ##### `options`
 *
 * Configuration (optional).
 *
 * ###### `options.filter`
 *
 * Function called with each checked script that can return `true` to move the
 * script or `false` if not.
 *
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html><html><head><script src="index.js"></script></head><body></body></html>
 */

import {visit} from 'unist-util-visit'
import {isJavaScript} from 'hast-util-is-javascript'

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 *
 * @typedef Options
 *   Configuration
 * @property {(node: Element) => boolean|undefined|null} [filter]
 *   You can pass `filter`, a function called with each checked element,
 *   returning `true` if the script should be moved, and `false` if not.
 */
// To do: improve type above.

/**
 * Move JS `<script>` elements to the end of `<body>`.
 *
 * This can *decrease* the time to
 * [first render](https://developer.yahoo.com/performance/rules.html#js_bottom).
 *
 * @type {import('unified').Plugin<[Options?]|Array<void>, Root>}
 */
export default function rehypeJavaScriptToBottom(options = {}) {
  const filter = options.filter || (() => true)

  return (tree) => {
    /** @type {Array<[Root|Element, Element]>} */
    const matches = []
    /** @type {Element|undefined} */
    let body

    visit(tree, 'element', (node, _, parent) => {
      if (node.tagName === 'body') {
        body = node
      }

      if (parent && isJavaScript(node) && filter(node)) {
        matches.push([parent, node])
      }
    })

    if (body) {
      let index = -1

      while (++index < matches.length) {
        const match = matches[index]
        const siblings = match[0].children
        siblings.splice(siblings.indexOf(match[1]), 1)
        body.children.push(match[1])
      }
    }
  }
}
