/**
 * @fileoverview
 *   Sort attribute values.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <div class="qux quux foo bar"></div>
 */

import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

export default function rehypeSortAttributeValues() {
  return transform
}

function transform(tree) {
  const counts = {}
  const queues = []

  visit(tree, 'element', visitor)

  flush(optimize())

  function visitor(node) {
    const props = node.properties
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
  }

  function add(prop, values) {
    const cache = counts[prop] || (counts[prop] = {known: []})
    let index = -1

    while (++index < values.length) {
      const value = safe(values[index])

      if (value in cache) {
        cache[value]++
      } else {
        cache[value] = 1
        cache.known.push(values[index])
      }
    }

    queues.push([values, prop])
  }

  function optimize() {
    const caches = {}
    let prop

    for (prop in counts) {
      if (own.call(counts, prop)) {
        const values = counts[prop]
        caches[prop] = values.known.sort(
          (a, b) => values[safe(b)] - values[safe(a)] || compare(a, b, 0)
        )
      }
    }

    return caches
  }

  function flush(caches) {
    let index = -1

    while (++index < queues.length) {
      const queue = queues[index]
      const cache = caches[queue[1]]
      queue[0].sort((a, b) => cache.indexOf(a) - cache.indexOf(b))
    }
  }
}

function safe(value) {
  return '$' + value
}

// This would create an infinite loop if `a` and `b` could be equal, but the
// list we operate on only has unique values.
function compare(a, b, index) {
  return (
    (a.charCodeAt(index) || 0) - (b.charCodeAt(index) || 0) ||
    compare(a, b, index + 1)
  )
}
