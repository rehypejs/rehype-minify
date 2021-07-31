/**
 * @fileoverview
 *   Reorder attributes based on how often they occur.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <div id="foo"><strong class="bar" id="baz">qux</strong></div>
 */

import {visit} from 'unist-util-visit'

const own = {}.hasOwnProperty

export default function rehypeSortAttributes() {
  return transform
}

function transform(tree) {
  const counts = {}

  visit(tree, 'element', count)

  const caches = optimize()

  visit(tree, 'element', reorder)

  function count(node) {
    const name = node.tagName
    const cache = counts[name] || (counts[name] = {known: []})
    const props = node.properties
    let prop

    for (prop in props) {
      if (own.call(props, prop)) {
        const value = safe(prop)

        if (value in cache) {
          cache[value]++
        } else {
          cache[value] = 1
          cache.known.push(prop)
        }
      }
    }
  }

  function optimize() {
    const caches = {}
    let name

    for (name in counts) {
      if (own.call(counts, name)) {
        const values = counts[name]
        caches[name] = values.known.sort(
          (a, b) => values[safe(b)] - values[safe(a)] || compare(a, b, 0)
        )
      }
    }

    return caches
  }

  function reorder(node) {
    const cache = caches[node.tagName]
    const props = node.properties
    const keys = []
    const result = {}
    let index = -1
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
