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
  var val
  var output

  if (has(node, 'style')) {
    props = node.properties
    val = props.style

    if (typeof val === 'string') {
      try {
        output = clean.minify(prefix + val + suffix).styles
        val = output ? output.slice(prefix.length, -suffix.length) : val
      } catch (error) {}

      props.style = val || null
    }
  }
}
