/**
 * rehype plugin to concatenate `<style>`s together.
 *
 * ## What is this?
 *
 * This package is a plugin that can improve performance by merging multiple
 * CSS `<style>` elements together.
 * This plugin can be dangerous if CSS is invalid.
 * Additionally, this plugin does not handle `scoped` styles.
 * Those are [deprecated](https://github.com/whatwg/html/issues/552) anyway.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you are certain that your CSS is valid and you
 * want to improve the size of HTML.
 *
 * ## API
 *
 * ### `unified().use(rehypeConcatCssStyle)`
 *
 * Concatenate `<style>` elements together.
 * There are no options.
 *
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
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeConcatCssStyle() {
  return (tree) => {
    /** @type {Array<[Root|Element, Element]>} */
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
