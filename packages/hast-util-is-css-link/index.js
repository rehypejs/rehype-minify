/**
 * hast utility to check if an element is a CSS link.
 *
 * ## What is this?
 *
 * This package is a utility to check whether a hast node is a `<link>` that
 * references CSS.
 *
 * ## When should I use this?
 *
 * You can use this package to check whether links reference CSS or something
 * else.
 *
 * ## Use
 *
 * ```js
 * import {h} from 'hastscript'
 * import {isCssLink} from 'hast-util-is-css-link'
 *
 * isCssLink(h('link', {rel: ['stylesheet', 'author']})) //=> true
 * isCssLink(h('link', {rel: ['stylesheet'], type: 'text/css'})) //=> true
 * isCssLink(h('link', {rel: ['stylesheet'], type: 'text/foo'})) //=> false
 * ```
 *
 * ## API
 *
 * ### `isCssLink(node)`
 *
 * Check whether a hast node is a `<link>` that references CSS.
 *
 * Returns `true` if `node` is a `<link>` element with a `rel` list that
 * contains `'stylesheet'` and has no `type`, an empty `type`, or `'text/css'`
 * as its `type`.
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — hast node
 *
 * ###### Returns
 *
 * Whether a node is a `<link>` that references CSS (`boolean`).
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {Root|Root['children'][number]} Node
 */

/**
 * Check whether a hast node is a `<link>` that references CSS.
 *
 * @param {Node} node
 * @returns {boolean}
 */
export function isCssLink(node) {
  if (!node || !('tagName' in node) || node.tagName !== 'link') {
    return false
  }

  const props = node.properties || {}
  const rel = props.rel

  if (!rel || !Array.isArray(rel) || !rel.includes('stylesheet')) {
    return false
  }

  const type = String(props.type || '')
    .trim()
    .toLowerCase()

  return !type || type === 'text/css'
}
