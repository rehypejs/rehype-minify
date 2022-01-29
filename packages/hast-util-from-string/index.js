/**
 * hast utility to set the plain-text value of a node.
 *
 * ## What is this?
 *
 * This package is a utility to set the plain-text value of a node.
 *
 * ## When should I use this?
 *
 * You can use this package when you want to set the plain text value of a node.
 * The algorithm used by this package is like the DOMs `Node#textContent`
 * setter.
 *
 * To use the DOMs `Node#innerText` algorithm instead, use
 * [`hast-util-from-text`](https://github.com/syntax-tree/hast-util-from-text).
 * `innerText` is aware of how things are displayed, for example turning line
 * endings into `<br>` elements and joining table cells with tab (`\t`)
 * characters.
 *
 * ## Use
 *
 * ```js
 * import {h} from 'hastscript'
 * import {fromString} from 'hast-util-from-string'
 *
 * console.log(fromString(h('p'), 'Alpha'))
 * // { type: 'element',
 * //   tagName: 'p',
 * //   properties: {},
 * //   children: [ { type: 'text', value: 'Alpha' } ] }
 * console.log(fromString(h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']), 'Charlie'))
 * // { type: 'element',
 * //   tagName: 'div',
 * //   properties: {},
 * //   children: [ { type: 'text', value: 'Charlie' } ] }
 * ```
 *
 * ## API
 *
 * ### `fromString(node[, value])`
 *
 * Set the plain-text value of a node.
 *
 * *   if `node` is a text node (has a `value` property; as in, `comment`,
 *     `text`), set that to the given `value` or an empty string
 * *   Otherwise, if `node` is a parent node (has `children`; as in, `element`,
 *     `root`), replace them with a text node whose data is set to the given
 *     `value`, or if `value` is not given, remove all its children
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — hast node
 * *   `value` (`string`, optional) — new text
 *
 * ###### Returns
 *
 * The given node (`Node`).
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {Root|Root['children'][number]} Node
 */

/**
 * Set the plain-text value of a hast node.
 * This is like the DOMs `Node#textContent` setter.
 * The given node is returned.
 *
 * @template {Node} Thing
 * @param {Thing} node
 * @param {string|null|undefined} [d]
 * @returns {Thing}
 */
export function fromString(node, d) {
  const value = d === undefined || d === null ? '' : String(d)

  if ('children' in node) {
    node.children = []

    if (value) {
      node.children.push({type: 'text', value})
    }
  } else if (node.type !== 'doctype') {
    node.value = value
  }

  return node
}
