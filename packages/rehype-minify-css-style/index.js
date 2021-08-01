/**
 * @fileoverview
 *   Minify CSS style elements.
 * @example
 *   <style>
 *     * { color: #ff0000 }
 *   </style>
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'
import {isCssStyle} from 'hast-util-is-css-style'

const clean = new CleanCSS()

/**
 * @typedef {import('hast').Root} Root
 */

/**
 * Minify CSS style elements.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyCssStyle() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (isCssStyle(node)) {
        try {
          const value = toString(node)
          fromString(node, clean.minify(value).styles || value)
          // Potential third party errors?
          /* c8 ignore next */
        } catch {}
      }
    })
  }
}
