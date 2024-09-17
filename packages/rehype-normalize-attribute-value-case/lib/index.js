/**
 * @import {Properties, Root} from 'hast'
 */

/**
 * @typedef {Properties[keyof Properties]} PropertyValue
 * @typedef {Extract<PropertyValue, Array<any>>} Objects
 * @typedef {Exclude<PropertyValue, Array<any>>} Primitives
 */

import {isElement} from 'hast-util-is-element'
import {visit} from 'unist-util-visit'
import {schema} from './schema.js'

/**
 * Normalize casing of attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeNormalizeAttributeValueCase() {
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
        if (
          node.properties[property] &&
          Object.hasOwn(schema, property) &&
          isElement(node, schema[property])
        ) {
          node.properties[property] = minify(node.properties[property])
        }
      }
    })
  }
}

/**
 * @param {PropertyValue} value
 *   Value.
 * @returns {PropertyValue}
 *   Value.
 */
function minify(value) {
  return Array.isArray(value) ? all(value) : one(value)
}

/**
 * @param {Objects} value
 *   Value.
 * @returns {Objects}
 *   Value.
 */
function all(value) {
  let index = -1
  /** @type {Objects} */
  const result = []

  while (++index < value.length) {
    // @ts-expect-error: kind in -> kind out.
    result[index] = one(value[index])
  }

  return result
}

/**
 * @param {Primitives} value
 *   Value.
 * @returns {Primitives}
 *   Value.
 */
function one(value) {
  return typeof value === 'string' ? value.toLowerCase() : value
}
