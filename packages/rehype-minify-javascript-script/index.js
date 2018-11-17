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
  var val
  if (js(node) && !has(node, 'src')) {
    try {
      val = Uglify.minify(toString(node)).code
      /* istanbul ignore else - not used, but just to be sure there’s an if */
      if (val.charAt(val.length - 1) === ';') {
        val = val.slice(0, -1)
      }
      fromString(node, val)
    } catch (error) {}
  }
}
