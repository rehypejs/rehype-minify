/**
 * @fileoverview
 *   Minify style attributes.
 * @example
 *   <meta name="theme-color" content="#0000ff">
 *   <meta name="msapplication-TileColor" content="#ff0000">
 */

'use strict'

var CleanCSS = require('clean-css')
var visit = require('unist-util-visit')
var is = require('hast-util-is-element')
var has = require('hast-util-has-property')

module.exports = styleAttribute

var clean = new CleanCSS()

var prefix = '*{color:'
var suffix = '}'

function styleAttribute() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var name = props.name
  var val
  var output

  if (
    is(node, 'meta') &&
    (name === 'msapplication-TileColor' || name === 'theme-color') &&
    has(node, 'content')
  ) {
    val = props.content

    if (typeof val === 'string') {
      try {
        output = clean.minify(prefix + val + suffix)
        val = output.styles.slice(prefix.length, -suffix.length)
      } catch (error) {}

      props.content = val
    }
  }
}
