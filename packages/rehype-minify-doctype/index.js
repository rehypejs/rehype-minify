/**
 * @fileoverview
 *   Minify the doctype.
 * @example
 *   {"processor": {"fragment": false}}
 *   <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head></head><body></body></html>
 */

import {visit} from 'unist-util-visit'

/**
 * @typedef {import('hast').Root} Root
 */

/**
 * Minify the doctype.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeMinifyDoctype() {
  return (tree) => {
    visit(tree, 'doctype', (node) => {
      // @ts-expect-error: removed from `hast`.
      if (node.public) node.public = undefined

      // @ts-expect-error: removed from `hast`.
      if (node.system) node.system = undefined

      return false
    })
  }
}
