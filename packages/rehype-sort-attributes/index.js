/**
 * @fileoverview
 *   Reorder attributes based on how often they occur.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <div id="foo"><strong class="bar" id="baz">qux</strong></div>
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

import {visit} from 'unist-util-visit'

const own = {}.hasOwnProperty

/**
 * Reorder attributes based on how often they occur.
 *
 * This optimizes for repetition-based compression (such as GZip).
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeSortAttributes() {
  return (tree) => {
    /** @type {Record<string, {known: string[], counts: Record<string, number>}>} */
    const counts = {}

    visit(tree, 'element', (node) => {
      const name = node.tagName
      const cache = counts[name] || (counts[name] = {known: [], counts: {}})
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (own.call(props, prop)) {
          const value = safe(prop)

          if (value in cache.counts) {
            cache.counts[value]++
          } else {
            cache.counts[value] = 1
            cache.known.push(prop)
          }
        }
      }
    })

    const caches = optimize()

    visit(tree, 'element', (node) => {
      const cache = caches[node.tagName]
      const props = node.properties || {}
      /** @type {string[]} */
      const keys = []
      /** @type {Required<Element['properties']>} */
      const result = {}
      let index = -1
      /** @type {string} */
      let prop

      for (prop in props) {
        if (own.call(props, prop)) {
          keys.push(prop)
        }
      }

      keys.sort((a, b) => cache.indexOf(a) - cache.indexOf(b))

      while (++index < keys.length) {
        result[keys[index]] = props[keys[index]]
      }

      node.properties = result
    })

    function optimize() {
      /** @type {Record<string, Array.<string>>} */
      const caches = {}
      /** @type {string} */
      let name

      for (name in counts) {
        if (own.call(counts, name)) {
          const values = counts[name]
          caches[name] = values.known.sort(
            (a, b) =>
              values.counts[safe(b)] - values.counts[safe(a)] ||
              compare(a, b, 0)
          )
        }
      }

      return caches
    }
  }
}

/**
 * @param {string} value
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
