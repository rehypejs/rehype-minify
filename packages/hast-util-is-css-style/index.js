/**
 * hast utility to check if an element is a CSS `<style>` element.
 *
 * ## What is this?
 *
 * This package is a utility to check whether a hast node is a `<style>` that
 * contains CSS.
 *
 * ## When should I use this?
 *
 * You can use this package to check whether `<style>` elements contain CSS or
 * something else.
 *
 * ## Use
 *
 * ```js
 * import {h} from 'hastscript'
 * import {isCssStyle} from 'hast-util-is-css-style'
 *
 * isCssStyle(h('style')) //=> true
 * isCssStyle(h('style', {type: ' TEXT/CSS '})) //=> true
 * isCssStyle(h('style', {type: 'text/foo'})) //=> false
 * ```
 *
 * ## API
 *
 * ### `isCssStyle(node)`
 *
 * Check whether a hast node is a `<style>` that contains CSS.
 *
 * Returns `true` if `node` is a `<style>` element that has no `type`, an empty
 * `type`, or `'text/css'` as its `type`.
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — hast node
 *
 * ###### Returns
 *
 * Whether a node is a `<style>` that references CSS (`boolean`).
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {Root|Root['children'][number]} Node
 */

/**
 * Check whether a hast node is a `<style>` that contains CSS.
 *
 * @param {Node} node
 * @returns {boolean}
 */
export function isCssStyle(node) {
  if (!node || !('tagName' in node) || node.tagName !== 'style') {
    return false
  }

  const value = (node.properties || {}).type

  return (
    value === undefined ||
    value === null ||
    String(value).trim().toLowerCase() === 'text/css'
  )
}
