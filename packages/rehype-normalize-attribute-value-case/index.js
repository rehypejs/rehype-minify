/**
 * rehype plugin to normalize casing of attribute values.
 *
 * ## What is this?
 *
 * This package is a plugin that normalizes the casing of certain attribute
 * values, which optimizes for repetition-based compression (such as GZip).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeNormalizeAttributeValueCase)`
 *
 * Normalize casing of attributes.
 * There are no options.
 *
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
 * Normalize casing of attributes.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeNormalizeAttributeValueCase() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      /** @type {string} */
      let prop

      for (prop in node.properties) {
        if (
          hasProperty(node, prop) &&
          own.call(schema, prop) &&
          isElement(node, schema[prop])
        ) {
          // @ts-expect-error: bug in `has-property`.
          node.properties[prop] = minify(node.properties[prop])
        }
      }
    })
  }
}

/**
 * @param {null|undefined|string|number|boolean|Array<string|number>} value
 * @returns {null|undefined|string|number|boolean|Array<string|number>}
 */
function minify(value) {
  return Array.isArray(value) ? all(value) : one(value)
}

/**
 * @param {Array<string|number>} value
 * @returns {Array<string|number>}
 */
function all(value) {
  let index = -1
  /** @type {Array<string|number>} */
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
