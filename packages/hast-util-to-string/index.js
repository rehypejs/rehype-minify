/**
 * @fileoverview
 *   Get the plain-text value of a hast node.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   var h = require('hastscript')
 *   var toString = require('hast-util-to-string')
 *
 *   toString(h('p', 'Alpha'))
 *   //=> 'Alpha'
 *   toString(h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']))
 *   //=> 'Bold and italic.'
 *   ```
 *
 *   ## API
 *
 *   ### `toString(node)`
 *
 *   Transform a node to a string.
 */

'use strict'

module.exports = toString

/**
 * @typedef {import('hast').Element} Element
 */

/**
 * @param {Element} node The HTML element to get the plain-text value of.
 * @returns {string} The plain text value of the HTML element.
 */
function toString(node) {
  // “The concatenation of data of all the Text node descendants of the context
  // object, in tree order.”
  if ('children' in node) {
    return all(node)
  }

  // “Context object’s data.”
  return 'value' in node ? node.value : ''
}

/**
 * @param {Element} node
 * @returns {string}
 */
function one(node) {
  if (node.type === 'text') {
    return node.value
  }

  return node.children ? all(node) : ''
}

/**
 * @param {Element} node
 * @returns {string}
 */
function all(node) {
  var children = node.children
  var length = children.length
  var index = -1
  var result = []

  while (++index < length) {
    result[index] = one(children[index])
  }

  return result.join('')
}
