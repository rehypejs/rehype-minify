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

export default function rehypeMinifyCssStyle() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  if (isCssStyle(node)) {
    try {
      const value = toString(node)
      fromString(node, clean.minify(value).styles || value)
      // Potential third party errors?
      /* c8 ignore next */
    } catch {}
  }
}
