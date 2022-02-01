/**
 * rehype plugin to remove empty attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that removes whole attributes when their value is
 * empty.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveEmptyAttribute)`
 *
 * Remove empty attributes.
 * There are no options.
 *
 * @example
 *   <label for id=""></label>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {isEventHandler} from 'hast-util-is-event-handler'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

/**
 * Remove empty attributes, if possible.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeRemoveEmptyAttribute() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (own.call(props, prop)) {
          const value = props[prop]

          if (
            (value === '' || (Array.isArray(value) && value.length === 0)) &&
            (isEventHandler(prop) ||
              (own.call(schema, prop) && isElement(node, schema[prop])))
          ) {
            props[prop] = null
          }
        }
      }
    })
  }
}
