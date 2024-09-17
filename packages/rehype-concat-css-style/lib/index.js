/**
 * @import {Element, Parents, Root} from 'hast'
 */

import {fromString} from 'hast-util-from-string'
import {isCssStyle} from 'hast-util-is-css-style'
import {toString} from 'hast-util-to-string'
import {visit} from 'unist-util-visit'

/**
 * Concatenate `<style>` elements together.
 *
 * There are no options.
 *
 * @returns
 *   Transform.
 */
export default function rehypeConcatCssStyle() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    /** @type {Array<[Parents, Element]>} */
    const matches = []

    visit(tree, 'element', function (node, _, parent) {
      if (parent && isCssStyle(node)) {
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

      fromString(matches[0][1], contents.join(''))
    }
  }
}
