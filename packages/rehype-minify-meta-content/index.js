/**
 * @fileoverview
 *   Minify `content` on `meta` elements.
 *
 *   Note: `meta[name=theme-color]` and `meta[name=msapplication-TileColor]`
 *   are handled by `rehype-minify-meta-color`.
 * @example
 *   <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
 *   <meta name="keywords" content="foo, bar baz, qux">
 */

'use strict'

var comma = require('comma-separated-tokens')
var visit = require('unist-util-visit')
var is = require('hast-util-is-element')
var has = require('hast-util-has-property')

module.exports = content

var own = {}.hasOwnProperty

var handlers = {}

handlers.viewport = viewport
handlers.keywords = collapse
handlers.robots = collapse
handlers['apple-itunes-app'] = collapse
handlers['apple-media-service-subscription'] = collapse

function content() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var name = props.name

  if (is(node, 'meta') && has(node, 'content') && own.call(handlers, name)) {
    if (typeof props.content === 'string') {
      props.content = handlers[name](props.content)
    }
  }
}

function viewport(value) {
  return collapse(
    value.replace(/(\d+\.\d+)/, toNumber).replace(/user-scalable=\s*yes/, '')
  )
}

function collapse(value) {
  return comma.stringify(comma.parse(value), {padLeft: false})
}

function toNumber(val) {
  return Number(val)
}
