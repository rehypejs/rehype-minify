/**
 * @fileoverview
 *   Minify whitespace in attributes.
 * @example
 *   <a href="  http://example.com "></a>
 */

// Note: Don’t include non-strings (such as `boolean`s) here, they’re already
// handled in the generator.

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {isEventHandler} from 'hast-util-is-event-handler'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

export default function rehypeMinifyAttributeWhitespace() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  const props = node.properties
  let prop

  for (prop in props) {
    if (
      hasProperty(node, prop) &&
      (isEventHandler(prop) ||
        (own.call(schema, prop) && isElement(node, schema[prop])))
    ) {
      props[prop] = minify(props[prop])
    }
  }
}

function minify(value) {
  return (Array.isArray(value) ? all : one)(value)
}

function all(value) {
  let index = -1
  const result = []

  while (++index < value.length) {
    result[index] = one(value[index])
  }

  return result
}

function one(value) {
  return typeof value === 'string' ? String(value).trim() : value
}
