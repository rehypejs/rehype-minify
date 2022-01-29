/**
 * rehype plugin to remove duplicates in attributes values.
 *
 * ## What is this?
 *
 * This package is a plugin that removes duplicates amongst attribute values of
 * unique tokens (such as `class`).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveDuplicateAttributeValues)`
 *
 * Remove duplicates in attributes values.
 * There are no options.
 *
 * @example
 *   <div class="foo foo"></div>
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
 * @type {import('unified').Plugin<Array<void>, Root>}
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
