/**
 * @fileoverview
 *   Move JS `<script>` elements to the end of `<body>`.
 *
 *   This can *decrease* the time to
 *   [first render](https://developer.yahoo.com/performance/rules.html#js_bottom).
 *
 *   You can pass `filter`, a function called with each checked node, returning
 *   `true` if the script should be moved, and `false` if not.
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

/**
 * Move JS `<script>` elements to the end of `<body>`.
 *
 * This can *decrease* the time to
 * [first render](https://developer.yahoo.com/performance/rules.html#js_bottom).
 *
 * @type {import('unified').Plugin<[Options?] | void[], Root>}
 */
export default function rehypeJavaScriptToBottom(options = {}) {
  const filter = options.filter || (() => true)

  return (tree) => {
    /** @type {Array.<[Root|Element, Element]>} */
    const matches = []
    /** @type {Element|undefined} */
    let body

    visit(tree, 'element', (node, _, parent) => {
      if (node.tagName === 'body') {
        body = node
      }

      if (isJavaScript(node) && filter(node)) {
        // @ts-expect-error: to do narrow parents.
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
