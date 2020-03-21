/**
 * @fileoverview
 *   Normalize casing of attribute values.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <form method="GET"></form>
 */

'use strict'

var array = require('x-is-array')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')
var is = require('hast-util-is-element')
var attributes = require('./schema')

module.exports = casing

var own = {}.hasOwnProperty

function casing() {
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
      own.call(attributes, prop) &&
      is(node, attributes[prop])
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
  return typeof value === 'string' ? value.toLowerCase() : value
}
