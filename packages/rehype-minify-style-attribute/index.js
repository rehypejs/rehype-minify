/**
 * @fileoverview
 *   Minify style attributes.
 * @example
 *   <img style="display: block;">
 */

'use strict'

var CleanCSS = require('clean-css')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')

module.exports = styleAttribute

var clean = new CleanCSS()

var prefix = '*{'
var suffix = '}'

function styleAttribute() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props
  var value
  var output

  if (has(node, 'style')) {
    props = node.properties
    value = props.style

    if (typeof value === 'string') {
      try {
        output = clean.minify(prefix + value + suffix).styles
        value = output ? output.slice(prefix.length, -suffix.length) : value
      } catch (_) {}

      props.style = value || null
    }
  }
}
