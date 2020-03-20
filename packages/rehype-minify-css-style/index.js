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
  var value

  if (css(node)) {
    try {
      value = toString(node)
      fromString(node, clean.minify(value).styles || value)
    } catch (_) {}
  }
}
