/**
 * @fileoverview
 *   Remove duplicates in attribute values with unique tokens.
 * @example
 *   <div class="foo foo"></label>
 */

'use strict'

var uniq = require('uniq')
var array = require('x-is-array')
var visit = require('unist-util-visit')
var is = require('hast-util-is-element')
var attributes = require('./schema')

module.exports = empty

var own = {}.hasOwnProperty

function empty() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var prop
  var val

  for (prop in props) {
    val = props[prop]

    if (
      own.call(attributes, prop) &&
      is(node, attributes[prop]) &&
      array(val)
    ) {
      uniq(val)
    }
  }
}
