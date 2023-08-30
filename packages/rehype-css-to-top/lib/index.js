/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Parents} Parents
 * @typedef {import('hast').Root} Root
 */

import {isCssLink} from 'hast-util-is-css-link'
import {visit} from 'unist-util-visit'

/**
 * Move CSS `<link>`s to the head.
 *
 * There are no options.
 *
 * @returns
 *   Transform.
 */
export default function rehypeCssToTop() {
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
    let head

    visit(tree, 'element', function (node, _, parent) {
      if (node.tagName === 'head') {
        head = node
      }

      if (
        parent &&
        isCssLink(node) &&
        (parent.type !== 'element' || parent.tagName !== 'head')
      ) {
        matches.push([parent, node])
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
