/**
 * @fileoverview
 *   Remove duplicates in attribute values with unique tokens.
 * @example
 *   <div class="foo foo"></label>
 */

import visit from 'unist-util-visit'
import is from 'hast-util-is-element'
import {schema} from './schema.js'

var own = {}.hasOwnProperty

export default function rehypeRemoveDuplicateAttributeValue() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var prop
  var value

  for (prop in props) {
    value = props[prop]

    if (
      own.call(schema, prop) &&
      is(node, schema[prop]) &&
      Array.isArray(value)
    ) {
      props[prop] = [...new Set(value)]
    }
  }
}
