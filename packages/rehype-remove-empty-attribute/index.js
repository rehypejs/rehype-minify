/**
 * @fileoverview
 *   Remove empty attributes, if possible.
 * @example
 *   <label for id=""></label>
 */

import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {isEventHandler} from 'hast-util-is-event-handler'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

export default function rehypeRemoveEmptyAttribute() {
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
        (value === '' || (Array.isArray(value) && value.length === 0)) &&
        (isEventHandler(prop) ||
          (own.call(schema, prop) && isElement(node, schema[prop])))
      ) {
        props[prop] = null
      }
    }
  }
}
