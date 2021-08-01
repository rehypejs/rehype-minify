/**
 * @fileoverview
 *   Check if an element is a CSS `<style>` element.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {h} from 'hastscript'
 *   import {isCssStyle} from 'hast-util-is-css-style'
 *
 *   isCssStyle(h('style')) //=> true
 *   isCssStyle(h('style', {type: ' TEXT/CSS '})) //=> true
 *   isCssStyle(h('style', {type: 'text/foo'})) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isCssStyle(node)`
 *
 *   Return `true` if `node` is a `<style>` element that has no `type`, an empty
 *   `type`, or `'text/css'` as its `type`.
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {Root|Root['children'][number]} Node
 */

/**
 * Check if an element is a CSS `<style>` element.
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
