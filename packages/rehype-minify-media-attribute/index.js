/**
 * @fileoverview
 *   Minify media attributes.
 * @example
 *   <link rel="stylesheet" media="only screen and (min-width: 320px)" href="index.css">
 *   <link rel="stylesheet" media="all" href="index.css">
 */

'use strict'

var CleanCSS = require('clean-css')
var visit = require('unist-util-visit')
var is = require('hast-util-is-element')

module.exports = mediaAttribute

var clean = new CleanCSS()

var prefix = '@media '
var suffix = '{i{color:red}}'

function mediaAttribute() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var output
  var value

  if (is(node, ['link', 'source', 'style'])) {
    value = props.media

    if (typeof value === 'string') {
      try {
        output = clean.minify(prefix + value + suffix)
        value = output.styles.slice(prefix.length, -suffix.length)
      } catch (_) {}

      props.media = value === 'all' || !value ? null : value
    }
  }
}
