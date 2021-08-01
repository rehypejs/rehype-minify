/**
 * @fileoverview
 *   Normalize casing of attribute values.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <form method="GET"></form>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

/**
 * Normalize casing of attribute values.
 * This optimizes for repetition-based compression (such as GZip).
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeNormalizeAttributeValueCase() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (
          hasProperty(node, prop) &&
          own.call(schema, prop) &&
          isElement(node, schema[prop])
        ) {
          props[prop] = minify(props[prop])
        }
      }
    })
  }
}

/**
 * @param {null|undefined|string|number|boolean|Array.<string|number>} value
 * @returns {null|undefined|string|number|boolean|Array.<string|number>}
 */
function minify(value) {
  return Array.isArray(value) ? all(value) : one(value)
}

/**
 * @param {Array.<string|number>} value
 * @returns {Array.<string|number>}
 */
function all(value) {
  let index = -1
  /** @type {Array.<string|number>} */
  const result = []

  while (++index < value.length) {
    // @ts-expect-error: input type matches output type.
    result[index] = one(value[index])
  }

  return result
}

/**
 * @param {null|undefined|string|number|boolean} value
 * @returns {null|undefined|string|number|boolean}
 */
function one(value) {
  return typeof value === 'string' ? value.toLowerCase() : value
}
