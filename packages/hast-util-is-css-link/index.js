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
 * *   `node` (`Node`) — node to check
 *
 * ###### Returns
 *
 * Whether a node is a `<link>` that references CSS (`boolean`).
 */

export {isCssLink} from './lib/index.js'
