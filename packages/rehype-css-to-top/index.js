/**
 * @fileoverview
 *   Move CSS `<link>` elements to the `<head>`.
 *
 *   This can *decrease* the time to
 *   [first render](https://developer.yahoo.com/performance/rules.html#css_top)
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html><html><head></head><body><link rel="stylesheet" href="index.css"></body></html>
 */

import {visit} from 'unist-util-visit'
import {isCssLink} from 'hast-util-is-css-link'

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * Move CSS `<link>` elements to the `<head>`.
 *
 * This can *decrease* the time to
 * [first render](https://developer.yahoo.com/performance/rules.html#css_top)
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeCssToTop() {
  return (tree) => {
    /** @type {Array.<[Root|Element, Element]>} */
    const matches = []
    /** @type {Element|undefined} */
    let head

    visit(tree, 'element', (node, _, parent) => {
      const ancestor = /** @type {Root|Element} */ (parent)

      if (node.tagName === 'head') {
        head = node
      }

      if (
        isCssLink(node) &&
        (ancestor.type !== 'element' || ancestor.tagName !== 'head')
      ) {
        matches.push([ancestor, node])
      }
    })

    if (head) {
      let index = -1

      while (++index < matches.length) {
        const match = matches[index]
        const siblings = match[0].children
        siblings.splice(siblings.indexOf(match[1]), 1)
        head.children.push(match[1])
      }
    }
  }
}
