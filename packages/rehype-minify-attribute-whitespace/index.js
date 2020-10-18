/**
 * @fileoverview
 *   Minify whitespace in attributes.
 * @example
 *   <a href="  http://example.com "></a>
 */

// Note: Don’t include non-strings (such as `boolean`s) here, they’re already
// handled in the generator.

'use strict'

var trim = require('trim')
var array = require('x-is-array')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')
var is = require('hast-util-is-element')
var handler = require('hast-util-is-event-handler')
var attributes = require('./schema')

module.exports = whitespace

var own = {}.hasOwnProperty

function whitespace() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var prop

  for (prop in props) {
    if (
      has(node, prop) &&
      (handler(prop) ||
        (own.call(attributes, prop) && is(node, attributes[prop])))
    ) {
      props[prop] = minify(props[prop])
    }
  }
}

function minify(value) {
  return (array(value) ? all : one)(value)
}

function all(value) {
  var length = value.length
  var index = -1
  var result = []

  while (++index < length) {
    result[index] = one(value[index])
  }

  return result
}

function one(value) {
  return typeof value === 'string' ? trim(value) : value
}
