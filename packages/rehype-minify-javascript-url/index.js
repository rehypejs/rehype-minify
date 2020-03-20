/**
 * @fileoverview
 *   Minify JavaScript URLs.
 * @example
 *   <img src="javascript:alert(true)">
 */

'use strict'

var Uglify = require('uglify-js')
var trim = require('trim')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')
var is = require('hast-util-is-element')
var attributes = require('html-url-attributes')

module.exports = url

var own = {}.hasOwnProperty

/* eslint-disable no-script-url */
var protocol = 'javascript:'
/* eslint-enable no-script-url */

var prefix = 'function a(){'
var suffix = '}a();'

function url() {
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
  var result = value
  var output

  if (
    typeof result === 'string' &&
    result.slice(0, protocol.length).toLowerCase() === protocol
  ) {
    result = result.slice(protocol.length)

    try {
      output = Uglify.minify(prefix + result + suffix)
      result = output.code.slice(prefix.length, -suffix.length)
    } catch (_) {}

    result = protocol + trim(result)
  }

  return result
}
