/**
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('hast').Root} Root
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
      let prop

      for (prop in node.properties) {
        if (
          node.properties[prop] &&
          Object.hasOwn(schema, prop) &&
          isElement(node, schema[prop])
        ) {
          node.properties[prop] = minify(node.properties[prop])
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
