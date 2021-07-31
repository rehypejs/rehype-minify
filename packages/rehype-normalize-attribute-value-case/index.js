/**
 * @fileoverview
 *   Normalize casing of attribute values.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <form method="GET"></form>
 */

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

export default function rehypeNormalizeAttributeValueCase() {
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
      own.call(schema, prop) &&
      isElement(node, schema[prop])
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
  return typeof value === 'string' ? value.toLowerCase() : value
}
