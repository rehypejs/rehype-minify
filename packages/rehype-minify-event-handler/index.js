/**
 * @fileoverview
 *   Minify event handler attributes.
 * @example
 *   <h1 onclick="javascript:alert(false)">Hello</h1>
 */

'use strict'

var Uglify = require('uglify-js')
var trim = require('trim')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')
var handler = require('hast-util-is-event-handler')

module.exports = eventHandler

var prefix = 'function a(){'
var suffix = '}a();'

function eventHandler() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var name

  for (name in props) {
    if (has(node, name) && handler(name)) {
      props[name] = minify(props[name])
    }
  }
}

function minify(value) {
  var val = value
  var output

  if (typeof val !== 'string') {
    return val
  }

  try {
    output = Uglify.minify(prefix + val + suffix)
    val = output.code.slice(prefix.length, -suffix.length)
  } catch (error) {}

  return trim(val)
}
