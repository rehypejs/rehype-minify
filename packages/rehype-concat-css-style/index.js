/**
 * @fileoverview
 *   Concatenate CSS `<style>` elements together.
 *
 *   This plugin can be dangerous if CSS is invalid.
 *   Additionally, this plugin does not handle `scoped` styles.
 *   Those are [deprecated](https://github.com/whatwg/html/issues/552) anyway.
 * @example
 *   <style>b{color:red}</style>
 *   <style>i{color:blue}</style>
 */

import {visit} from 'unist-util-visit'
import {isCssStyle} from 'hast-util-is-css-style'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * Concatenate CSS `<style>` elements together.
 *
 * This plugin can be dangerous if CSS is invalid.
 * Additionally, this plugin does not handle `scoped` styles.
 * Those are [deprecated](https://github.com/whatwg/html/issues/552) anyway.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeConcatCssStyle() {
  return (tree) => {
    /** @type {Array.<[Root|Element, Element]>} */
    const matches = []

    visit(tree, 'element', (node, _, parent) => {
      if (isCssStyle(node)) {
        // @ts-expect-error: `parent` matches.
        matches.push([parent, node])
      }
    })

    if (matches.length > 1) {
      concat()
    }

    function concat() {
      let index = -1
      /** @type {string[]} */
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
