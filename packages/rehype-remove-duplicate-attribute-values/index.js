/**
 * @fileoverview
 *   Remove duplicates in attribute values with unique tokens.
 * @example
 *   <div class="foo foo"></label>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

/**
 * Remove duplicates in attribute values with unique tokens.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeRemoveDuplicateAttributeValues() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (own.call(props, prop)) {
          const value = props[prop]

          if (
            own.call(schema, prop) &&
            isElement(node, schema[prop]) &&
            Array.isArray(value)
          ) {
            props[prop] = [...new Set(value)]
          }
        }
      }
    })
  }
}
