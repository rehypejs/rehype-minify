/**
 * @fileoverview
 *   Remove `type` on CSS `style` and `link`s.
 * @example
 *   <link rel="stylesheet alternate" type="text/css" href="index.css">
 *   <style type="text/css"></style>
 */

import {visit} from 'unist-util-visit'
import {isCssLink} from 'hast-util-is-css-link'
import {isCssStyle} from 'hast-util-is-css-style'

export default function rehypeRemoveStyleTypeCss() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  const props = node.properties

  if ('type' in props && (isCssLink(node) || isCssStyle(node))) {
    props.type = null
  }
}
