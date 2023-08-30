/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Parents} Parents
 * @typedef {import('hast').Root} Root
 */

/**
 * @callback Filter
 *   Filter scripts that would be moved.
 * @param {Element} node
 *   Script element.
 * @returns {boolean | null | undefined}
 *   Whether to move the script (`true`) or not.
 *
 * @typedef Options
 *   Configuration.
 * @property {Filter | null | undefined} [filter]
 *   Filter scripts that would otherwise be moved (optional).
 */

import {isJavaScript} from 'hast-util-is-javascript'
import {visit} from 'unist-util-visit'

/** @type {Options} */
const emptyOptions = {}

/**
 * Move JS `<script>` elements to the end of `<body>`.
 *
 * This can *decrease* the time to
 * [first render](https://developer.yahoo.com/performance/rules.html#js_bottom).
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeJavaScriptToBottom(options) {
  const settings = options || emptyOptions
  const filter = settings.filter || defaultFilter

  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    /** @type {Array<[Parents, Element]>} */
    const matches = []
    /** @type {Element | undefined} */
    let body

    visit(tree, 'element', function (node, _, parent) {
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

/**
 * @satisfies {Filter}
 */
function defaultFilter() {
  return true
}
