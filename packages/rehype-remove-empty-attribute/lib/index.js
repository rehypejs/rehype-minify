/**
 * @import {Root} from 'hast'
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
      let property

      for (property in node.properties) {
        if (Object.hasOwn(node.properties, property)) {
          const value = node.properties[property]

          if (
            (value === '' || (Array.isArray(value) && value.length === 0)) &&
            (isEventHandler(property) ||
              (Object.hasOwn(schema, property) &&
                isElement(node, schema[property])))
          ) {
            node.properties[property] = undefined
          }
        }
      }
    })
  }
}
