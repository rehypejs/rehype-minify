/**
 * @fileoverview
 *   Move CSS `<link>` elements to the `<head>`.
 *
 *   This can *decrease* the time to [first
 *   render](https://developer.yahoo.com/performance/rules.html#css_top)
 * @example {"processor": {"fragment": false}}
 *
 *   <!doctype html><html><head></head><body><link rel="stylesheet" href="index.css"></body></html>
 */

'use strict'

var visit = require('unist-util-visit')
var css = require('hast-util-is-css-link')

module.exports = cssToTop

function cssToTop() {
  return transform
}

function transform(tree) {
  var head
  var matches = []

  visit(tree, 'element', visitor)

  if (head && matches.length !== 0) {
    move()
  }

  function visitor(node, index, parent) {
    if (node.tagName === 'head') {
      head = node
    }

    if (css(node) && parent.tagName !== 'head') {
      matches.push([parent, node])
    }
  }

  function move() {
    var length = matches.length
    var index = -1
    var match
    var siblings

    while (++index < length) {
      match = matches[index]
      siblings = match[0].children
      siblings.splice(siblings.indexOf(match[1]), 1)
      head.children.push(match[1])
    }
  }
}
