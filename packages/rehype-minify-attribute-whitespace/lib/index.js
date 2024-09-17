/**
 * @import {Properties, Root} from 'hast'
 */

/**
 * @typedef {Extract<PropertyValue, Array<any>>} Objects
 * @typedef {Exclude<PropertyValue, Array<any>>} Primitives
 * @typedef {Properties[keyof Properties]} PropertyValue
 */

import {collapseWhiteSpace} from 'collapse-white-space'
import {isElement} from 'hast-util-is-element'
import {isEventHandler} from 'hast-util-is-event-handler'
import {visit} from 'unist-util-visit'
import {schema} from './schema.js'

/**
 * Minify whitespace in attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyAttributeWhitespace() {
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
          Object.hasOwn(node.properties, property) &&
          (isEventHandler(property) ||
            (Object.hasOwn(schema, property) &&
              isElement(node, schema[property])))
        ) {
          node.properties[property] = minify(node.properties[property])
        }
      }
    })
  }
}

/**
 * @param {PropertyValue} value
 *   Property value.
 * @returns {PropertyValue}
 *   Trimmed value.
 */
function minify(value) {
  return Array.isArray(value) ? all(value) : one(value)
}

/**
 * @param {Objects} value
 *   Objects.
 * @returns {Objects}
 *   Trimmed copy.
 */
function all(value) {
  let index = -1
  /** @type {Objects} */
  const result = []

  while (++index < value.length) {
    // @ts-expect-error: value in -> value out.
    result[index] = one(value[index])
  }

  return result
}

/**
 * @param {Primitives} value
 *   Primitive.
 * @returns {Primitives}
 *   Trimmed.
 */
function one(value) {
  return typeof value === 'string'
    ? collapseWhiteSpace(value, {style: 'html', trim: true})
    : value
}
