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

import {parse, stringify} from 'comma-separated-tokens'
import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'

const own = {}.hasOwnProperty

const handlers = {
  viewport,
  keywords: collapse,
  robots: collapse,
  'apple-itunes-app': collapse,
  'apple-media-service-subscription': collapse
}

export default function rehypeMinifyMetaContent() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  const props = node.properties
  const name = props.name

  if (
    isElement(node, 'meta') &&
    hasProperty(node, 'content') &&
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
  return stringify(parse(value), {padLeft: false})
}

function toNumber(value) {
  return Number(value)
}
