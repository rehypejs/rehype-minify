/**
 * @typedef {import('hast').Root} Root
 */

import {isElement} from 'hast-util-is-element'
import {visit} from 'unist-util-visit'
import {schema} from './schema.js'

/**
 * Remove duplicates in attribute values with unique tokens.
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
      let prop

      for (prop in node.properties) {
        if (Object.hasOwn(node.properties, prop)) {
          const value = node.properties[prop]

          if (
            Object.hasOwn(schema, prop) &&
            isElement(node, schema[prop]) &&
            Array.isArray(value)
          ) {
            node.properties[prop] = [...new Set(value)]
          }
        }
      }
    })
  }
}
