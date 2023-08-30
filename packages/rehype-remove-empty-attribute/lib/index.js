/**
 * @typedef {import('hast').Root} Root
 */

import {isElement} from 'hast-util-is-element'
import {isEventHandler} from 'hast-util-is-event-handler'
import {visit} from 'unist-util-visit'
import {schema} from './schema.js'

/**
 * Remove empty attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeRemoveEmptyAttribute() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      /** @type {string} */
      let prop

      for (prop in node.properties) {
        if (Object.hasOwn(node.properties, prop)) {
          const value = node.properties[prop]

          if (
            (value === '' || (Array.isArray(value) && value.length === 0)) &&
            (isEventHandler(prop) ||
              (Object.hasOwn(schema, prop) && isElement(node, schema[prop])))
          ) {
            node.properties[prop] = undefined
          }
        }
      }
    })
  }
}
