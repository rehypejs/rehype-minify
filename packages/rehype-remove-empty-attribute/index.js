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

var own = {}.hasOwnProperty

export default function rehypeRemoveEmptyAttribute() {
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
      (value === '' || (Array.isArray(value) && value.length === 0)) &&
      (isEventHandler(prop) ||
        (own.call(schema, prop) && isElement(node, schema[prop])))
    ) {
      props[prop] = null
    }
  }
}
