/**
 * @typedef {import('hast').Root} Root
 */

import {isElement} from 'hast-util-is-element'
import {visit} from 'unist-util-visit'
import {schema} from './schema.js'

/**
 * Sort attribute values.
 *
 * @returns
 *   Transform.
 */
export default function rehypeSortAttributeValues() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    // Map of properties to property values to counts.
    /** @type {Map<string, Map<number | string, number>>} */
    const counts = new Map()
    // List of all arrays, with their property names, so we don’t walk twice.
    /** @type {Array<[string, Array<number | string>]>} */
    const queues = []

    visit(tree, 'element', function (node) {
      /** @type {string} */
      let prop

      for (prop in node.properties) {
        if (Object.hasOwn(node.properties, prop)) {
          const value = node.properties[prop]

          if (
            Object.hasOwn(schema, prop) &&
            isElement(node, schema[prop]) &&
            Array.isArray(value)
          ) {
            add(prop, value)
          }
        }
      }
    })

    flush()

    /**
     * @param {string} prop
     *   Property name.
     * @param {Array<number | string>} values
     *   Values.
     * @returns {undefined}
     *   Nothing.
     */
    function add(prop, values) {
      let index = -1
      let cache = counts.get(prop)

      if (!cache) {
        cache = new Map()
        counts.set(prop, cache)
      }

      while (++index < values.length) {
        const value = values[index]
        cache.set(value, (cache.get(value) || 0) + 1)
      }

      queues.push([prop, values])
    }

    /**
     * @returns {undefined}
     *   Nothing.
     */
    function flush() {
      /** @type {Map<string, Array<number | string>>} */
      const caches = new Map()

      for (const [prop, cache] of counts) {
        caches.set(
          prop,
          [...cache.entries()]
            .sort(function (a, b) {
              return b[1] - a[1] || compare(String(a[0]), String(b[0]), 0)
            })
            .map(function (d) {
              return d[0]
            })
        )
      }

      let index = -1

      while (++index < queues.length) {
        const queue = queues[index]
        const cache = caches.get(queue[0])
        if (cache) {
          queue[1].sort(function (a, b) {
            return cache.indexOf(a) - cache.indexOf(b)
          })
        }
      }
    }
  }
}

/**
 * This would create an infinite loop if `a` and `b` could be equal, but the
 * list we operate on only has unique values.
 *
 * @param {string} a
 *   Left value.
 * @param {string} b
 *   Right value.
 * @param {number} index
 *   Current index in values.
 * @returns {number}
 *   Order.
 */
function compare(a, b, index) {
  return (
    (a.charCodeAt(index) || 0) - (b.charCodeAt(index) || 0) ||
    compare(a, b, index + 1)
  )
}
