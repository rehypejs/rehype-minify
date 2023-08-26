/**
 * rehype plugin to minify whitespace in attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can remove unneeded whitespace around the
 * values of certain attributes.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyAttributeWhitespace)`
 *
 * Minify whitespace in attributes.
 * There are no options.
 *
 * @example
 *   <a href="  http://example.com "></a>
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {isEventHandler} from 'hast-util-is-event-handler'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

/**
 * Minify whitespace in attributes.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeMinifyAttributeWhitespace() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      /** @type {string} */
      let prop

      for (prop in node.properties) {
        if (
          hasProperty(node, prop) &&
          (isEventHandler(prop) ||
            (own.call(schema, prop) && isElement(node, schema[prop])))
        ) {
          // @ts-expect-error: a bug in `has-property`.
          node.properties[prop] = minify(node.properties[prop])
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
