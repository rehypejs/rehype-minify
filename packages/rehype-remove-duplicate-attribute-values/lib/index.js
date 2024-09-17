/**
 * @import {Root} from 'hast'
 */

import {isElement} from 'hast-util-is-element'
import {visit} from 'unist-util-visit'
import {schema} from './schema.js'

/**
 * Remove duplicates in attributes values.
 *
 * @returns
 *   Transform.
 */
export default function rehypeRemoveDuplicateAttributeValues() {
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
            Object.hasOwn(schema, property) &&
            isElement(node, schema[property]) &&
            Array.isArray(value)
          ) {
            node.properties[property] = [...new Set(value)]
          }
        }
      }
    })
  }
}
