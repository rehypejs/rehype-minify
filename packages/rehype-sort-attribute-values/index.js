/**
 * @fileoverview
 *   Sort attribute values.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <div class="qux quux foo bar"></div>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

/**
 * Sort attribute values.
 *
 * This optimizes for repetition-based compression (such as GZip).
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeSortAttributeValues() {
  return (tree) => {
    /** @type {Record<string, {known: string[], counts: Record<string, number>}>} */
    const counts = {}
    /** @type {Array.<[Array.<string|number>, string]>} */
    const queues = []

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
            add(prop, value)
          }
        }
      }
    })

    flush()

    /**
     * @param {string} prop
     * @param {Array.<string|number>} values
     */
    function add(prop, values) {
      const cache = counts[prop] || (counts[prop] = {known: [], counts: {}})
      let index = -1

      while (++index < values.length) {
        const value = safe(values[index])

        if (value in cache.counts) {
          cache.counts[value]++
        } else {
          cache.counts[value] = 1
          cache.known.push(String(values[index]))
        }
      }

      queues.push([values, prop])
    }

    function flush() {
      /** @type {Record<string, Array.<string|number>>} */
      const caches = {}
      /** @type {string} */
      let prop

      for (prop in counts) {
        if (own.call(counts, prop)) {
          const values = counts[prop]
          caches[prop] = values.known.sort(
            (a, b) =>
              values.counts[safe(b)] - values.counts[safe(a)] ||
              compare(a, b, 0)
          )
        }
      }

      let index = -1

      while (++index < queues.length) {
        const queue = queues[index]
        const cache = caches[queue[1]]
        queue[0].sort((a, b) => cache.indexOf(a) - cache.indexOf(b))
      }
    }
  }
}

/**
 * @param {string|number} value
 * @returns {string}
 */
function safe(value) {
  return '$' + value
}

/**
 * This would create an infinite loop if `a` and `b` could be equal, but the
 * list we operate on only has unique values.
 *
 * @param {string} a
 * @param {string} b
 * @param {number} index
 * @returns {number}
 */
function compare(a, b, index) {
  return (
    (a.charCodeAt(index) || 0) - (b.charCodeAt(index) || 0) ||
    compare(a, b, index + 1)
  )
}
