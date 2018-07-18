/**
 * @fileoverview
 *   Minify CSS style elements.
 * @example
 *   <style>
 *     * { color: #ff0000 }
 *   </style>
 */

'use strict'

var CleanCSS = require('clean-css')
var visit = require('unist-util-visit')
var fromString = require('hast-util-from-string')
var toString = require('hast-util-to-string')
var css = require('hast-util-is-css-style')

module.exports = cssStyle

var clean = new CleanCSS()

function cssStyle() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var val

  if (css(node)) {
    try {
      val = toString(node)
      fromString(node, clean.minify(val).styles || val)
    } catch (err) {}
  }
}
