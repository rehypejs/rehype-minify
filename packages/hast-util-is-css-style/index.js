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

import trim from 'trim'

export function isCssStyle(node) {
  var value

  if (!node || node.tagName !== 'style') {
    return false
  }

  value = (node.properties || {}).type

  return value == null || trim(value).toLowerCase() === 'text/css'
}
