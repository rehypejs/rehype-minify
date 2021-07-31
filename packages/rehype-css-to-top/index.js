/**
 * @fileoverview
 *   Move CSS `<link>` elements to the `<head>`.
 *
 *   This can *decrease* the time to
 *   [first render](https://developer.yahoo.com/performance/rules.html#css_top)
 * @example {"processor": {"fragment": false}}
 *
 *   <!doctype html><html><head></head><body><link rel="stylesheet" href="index.css"></body></html>
 */

import {visit} from 'unist-util-visit'
import {isCssLink} from 'hast-util-is-css-link'

export default function rehypeCssToTop() {
  return transform
}

function transform(tree) {
  const matches = []
  let head

  visit(tree, 'element', visitor)

  if (head && matches.length > 0) {
    move()
  }

  function visitor(node, index, parent) {
    if (node.tagName === 'head') {
      head = node
    }

    if (isCssLink(node) && parent.tagName !== 'head') {
      matches.push([parent, node])
    }
  }

  function move() {
    let index = -1

    while (++index < matches.length) {
      const match = matches[index]
      const siblings = match[0].children
      siblings.splice(siblings.indexOf(match[1]), 1)
      head.children.push(match[1])
    }
  }
}
