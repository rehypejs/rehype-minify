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

import comma from 'comma-separated-tokens'
import visit from 'unist-util-visit'
import is from 'hast-util-is-element'
import has from 'hast-util-has-property'

var own = {}.hasOwnProperty

var handlers = {}

handlers.viewport = viewport
handlers.keywords = collapse
handlers.robots = collapse
handlers['apple-itunes-app'] = collapse
handlers['apple-media-service-subscription'] = collapse

export default function rehypeMinifyMetaContent() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var name = props.name

  if (
    is(node, 'meta') &&
    has(node, 'content') &&
    own.call(handlers, name) &&
    typeof props.content === 'string'
  ) {
    props.content = handlers[name](props.content)
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

function toNumber(value) {
  return Number(value)
}
