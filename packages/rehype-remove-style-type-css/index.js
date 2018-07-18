/**
 * @fileoverview
 *   Remove `type` on CSS `style` and `link`s.
 * @example
 *   <link rel="stylesheet alternate" type="text/css" href="index.css">
 *   <style type="text/css"></style>
 */

'use strict'

var visit = require('unist-util-visit')
var link = require('hast-util-is-css-link')
var style = require('hast-util-is-css-style')

module.exports = removeStyleType

function removeStyleType() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties

  if ('type' in props && (link(node) || style(node))) {
    props.type = null
  }
}
