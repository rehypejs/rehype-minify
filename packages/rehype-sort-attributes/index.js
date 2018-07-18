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
var has = require('hast-util-has-property')

module.exports = sort

var own = {}.hasOwnProperty

function sort() {
  return transform
}

function transform(tree) {
  var counts = {}
  var all = []

  visit(tree, 'element', count)

  /* Most-used first. */
  all.sort(function(left, right) {
    return counts[right] - counts[left]
  })

  visit(tree, 'element', reorder)

  function count(node) {
    var props = node.properties
    var name

    for (name in props) {
      if (has(node, name)) {
        if (own.call(counts, name)) {
          counts[name]++
        } else {
          all.push(name)
          counts[name] = 1
        }
      }
    }
  }

  function reorder(node) {
    var props = node.properties
    var length = all.length
    var index = -1
    var result = {}
    var prop

    while (++index < length) {
      prop = all[index]

      if (has(node, prop)) {
        result[prop] = props[prop]
      }
    }

    node.properties = result
  }
}
