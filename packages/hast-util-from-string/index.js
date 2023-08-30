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
 * const p = h('p')
 * fromString(p, 'Alpha')
 * console.log(p)
 * // { type: 'element',
 * //   tagName: 'p',
 * //   properties: {},
 * //   children: [ { type: 'text', value: 'Alpha' } ] }
 *
 * const div = h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.'])
 * fromString(div, 'Charlie')
 * console.log(div)
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
 * ###### Parameters
 *
 * *   `node` (`Node`) — node to change
 * *   `value` (`string`, default: `''`) — value to use
 *
 * ###### Returns
 *
 * Nothing (`undefined`).
 *
 * ###### Algorithm
 *
 * *   if `node` is a `comment` or `text` node, sets its `value`
 * *   if `node` is an `element` or `root`, replaces its children with a text
 *     node for `value`
 */

export {fromString} from './lib/index.js'
