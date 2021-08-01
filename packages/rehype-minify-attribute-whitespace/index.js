/**
 * @fileoverview
 *   Minify whitespace in attributes.
 * @example
 *   <a href="  http://example.com "></a>
 */

// Note: Don’t include non-strings (such as `boolean`s) here, they’re already
// handled in the generator.

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {isEventHandler} from 'hast-util-is-event-handler'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * Minify whitespace in attributes.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyAttributeWhitespace() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (
          hasProperty(node, prop) &&
          (isEventHandler(prop) ||
            (own.call(schema, prop) && isElement(node, schema[prop])))
        ) {
          props[prop] = minify(props[prop])
        }
      }
    })
  }
}

/**
 * @param {null|undefined|string|number|boolean|Array<string|number>} value
 */
function minify(value) {
  return Array.isArray(value) ? all(value) : one(value)
}

/**
 * @param {Array<string|number>} value
 */
function all(value) {
  let index = -1
  /** @type {Array<string|number>} */
  const result = []

  while (++index < value.length) {
    // @ts-expect-error: input matches output.
    result[index] = one(value[index])
  }

  return result
}

/**
 * @param {null|undefined|string|number|boolean} value
 */
function one(value) {
  return typeof value === 'string' ? String(value).trim() : value
}
