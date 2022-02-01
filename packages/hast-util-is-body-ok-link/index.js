/**
 * hast utility to check if a `link` element is “body OK”.
 *
 * ## What is this?
 *
 * This package is a utility that, when given a hast node, checks whether it
 * is a “body OK” link.
 *
 * ## When should I use this?
 *
 * You can use this package to check whether links can exist inside `<body>`
 * (outside of `<head>`).
 *
 * ## Use
 *
 * ```js
 * import {h} from 'hastscript'
 * import {isBodyOkLink} from 'hast-util-is-body-ok-link'
 *
 * isBodyOkLink(h('link', {itemProp: 'foo'})) //=> true
 * isBodyOkLink(h('link', {rel: ['stylesheet'], href: 'index.css'})) //=> true
 * isBodyOkLink(h('link', {rel: ['author'], href: 'index.css'})) //=> false
 * ```
 *
 * ## API
 *
 * ### `isBodyOkLink(node)`
 *
 * Check whether a node is a “body OK” link.
 *
 * *   returns `true` for `link` elements with an `itemProp`
 * *   returns `true` for `link` elements with a `rel` list where one or more
 *     entries are `pingback`, `prefetch`, or `stylesheet`
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — hast node
 *
 * ###### Returns
 *
 * Whether a node is a “body OK” link (`boolean`).
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {Root|Root['children'][number]} Node
 */

import {isElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'

const list = new Set(['pingback', 'prefetch', 'stylesheet'])

/**
 * Checks whether a node is a “body OK” link.
 *
 * @param {Node} node
 * @returns {boolean}
 */
export function isBodyOkLink(node) {
  if (!isElement(node, 'link')) {
    return false
  }

  if (hasProperty(node, 'itemProp')) {
    return true
  }

  const props = node.properties || {}
  const rel = props.rel || []
  let index = -1

  if (!Array.isArray(rel) || rel.length === 0) {
    return false
  }

  while (++index < rel.length) {
    if (!list.has(String(rel[index]))) {
      return false
    }
  }

  return true
}
