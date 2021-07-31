/**
 * @fileoverview
 *   Remove duplicates in attribute values with unique tokens.
 * @example
 *   <div class="foo foo"></label>
 */

import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

export default function rehypeRemoveDuplicateAttributeValue() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  const props = node.properties
  let prop

  for (prop in props) {
    if (own.call(props, prop)) {
      const value = props[prop]

      if (
        own.call(schema, prop) &&
        isElement(node, schema[prop]) &&
        Array.isArray(value)
      ) {
        props[prop] = [...new Set(value)]
      }
    }
  }
}
