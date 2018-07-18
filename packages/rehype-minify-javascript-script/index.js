/**
 * @fileoverview
 *   Minify `script` elements with a JavaScript body.
 * @example
 *   <script>
 *     var name = "World";
 *     console.log("Hello, " + name + "!");
 *   </script>
 */

'use strict'

var Uglify = require('uglify-js')
var visit = require('unist-util-visit')
var fromString = require('hast-util-from-string')
var toString = require('hast-util-to-string')
var js = require('hast-util-is-javascript')
var has = require('hast-util-has-property')

module.exports = scriptJS

function scriptJS() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  if (js(node) && !has(node, 'src')) {
    try {
      fromString(node, Uglify.minify(toString(node)).code)
    } catch (err) {}
  }
}
