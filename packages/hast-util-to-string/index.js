/**
 * hast utility to get the plain-text value of a node.
 *
 * ## What is this?
 *
 * This package is a utility to get the plain-text value of a node.
 *
 * ## When should I use this?
 *
 * You can use this package when you want to get the plain text value of a node.
 * The algorithm used by this package is like the DOMs `Node#textContent`
 * getter.
 *
 * To use the DOMs `Node#innerText` algorithm instead, use
 * [`hast-util-to-text`](https://github.com/syntax-tree/hast-util-to-text).
 * `innerText` is aware of how things are displayed, for example turning hard
 * breaks (`<br>`) into line endings.
 *
 * ## Use
 *
 * ```js
 * import {h} from 'hastscript'
 * import {toString} from 'hast-util-to-string'
 *
 * toString(h('p', 'Alpha'))
 * //=> 'Alpha'
 * toString(h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']))
 * //=> 'Bold and italic.'
 * ```
 *
 * ## API
 *
 * ### `toString(node)`
 *
 * Get the plain-text value of a node.
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — hast node
 *
 * ###### Returns
 *
 * Serialized node (`string`).
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 * @typedef {Root|Root['children'][number]} Node
 */

/**
 * Get the plain-text value of a hast node.
 *
 * @param {Node} node
 * @returns {string}
 */
export function toString(node) {
  // “The concatenation of data of all the Text node descendants of the context
  // object, in tree order.”
  if ('children' in node) {
    return all(node)
  }

  // “Context object’s data.”
  return 'value' in node ? node.value : ''
}

/**
 * @param {Node} node
 * @returns {string}
 */
function one(node) {
  if (node.type === 'text') {
    return node.value
  }

  return 'children' in node ? all(node) : ''
}

/**
 * @param {Root|Element} node
 * @returns {string}
 */
function all(node) {
  let index = -1
  /** @type {Array<string>} */
  const result = []

  while (++index < node.children.length) {
    result[index] = one(node.children[index])
  }

  return result.join('')
}
