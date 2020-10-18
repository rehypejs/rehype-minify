/**
 * @fileoverview
 *   Check if an element is a CSS `<style>` element.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   var h = require('hastscript')
 *   var ok = require('hast-util-is-css-style')
 *
 *   ok(h('style')) //=> true
 *   ok(h('style', {type: ' TEXT/CSS '})) //=> true
 *   ok(h('style', {type: 'text/foo'})) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isCssStyle(node)`
 *
 *   Return `true` if `node` is a `<style>` element that has no `type`, an empty
 *   `type`, or `'text/css'` as its `type`.
 */

'use strict'

var trim = require('trim')

module.exports = cssStyle

function cssStyle(node) {
  var value

  if (!node || node.tagName !== 'style') {
    return false
  }

  value = (node.properties || {}).type

  return value == null || trim(value).toLowerCase() === 'text/css'
}
