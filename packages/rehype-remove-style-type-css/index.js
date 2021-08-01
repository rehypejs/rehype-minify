/**
 * @fileoverview
 *   Remove `type` on CSS `style` and `link`s.
 * @example
 *   <link rel="stylesheet alternate" type="text/css" href="index.css">
 *   <style type="text/css"></style>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isCssLink} from 'hast-util-is-css-link'
import {isCssStyle} from 'hast-util-is-css-style'

/**
 * Remove `type` on CSS `style` and `link`s.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeRemoveStyleTypeCss() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (
        node.properties &&
        'type' in node.properties &&
        (isCssLink(node) || isCssStyle(node))
      ) {
        node.properties.type = null
      }
    })
  }
}
