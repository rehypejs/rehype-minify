/**
 * @fileoverview
 *   Reorder attributes based on how often they occur.
 *
 *   This optimizes for repetition-based compression (such as GZip).
 * @example
 *   <div id="foo"><strong class="bar" id="baz">qux</strong></div>
 */

'use strict'

var visit = require('unist-util-visit')

module.exports = sort

function sort() {
  return transform
}

function transform(tree) {
  var counts = {}

  visit(tree, 'element', count)

  var caches = optimize()

  visit(tree, 'element', reorder)

  function count(node) {
    var name = node.tagName
    var cache = counts[name] || (counts[name] = {known: []})
    var props = node.properties
    var prop
    var value

    for (prop in props) {
      value = safe(prop)

      if (value in cache) {
        cache[value]++
      } else {
        cache[value] = 1
        cache.known.push(prop)
      }
    }
  }

  function optimize() {
    var caches = {}
    var name
    var values

    for (name in counts) {
      values = counts[name]
      caches[name] = values.known.sort(sort)
    }

    return caches

    function sort(a, b) {
      return values[safe(b)] - values[safe(a)] || compare(a, b, 0)
    }
  }

  function reorder(node) {
    var cache = caches[node.tagName]
    var props = node.properties
    var keys = []
    var result = {}
    var index = -1
    var length
    var prop

    for (prop in props) {
      keys.push(prop)
    }

    keys.sort(sorter)
    length = keys.length

    while (++index < length) {
      prop = keys[index]
      result[prop] = props[prop]
    }

    node.properties = result

    function sorter(a, b) {
      return cache.indexOf(a) - cache.indexOf(b)
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
