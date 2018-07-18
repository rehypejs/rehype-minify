/**
 * @fileoverview
 *   Check if an element is a JavaScript script.
 * @longdescription
 *   ## Usage
 *
 *   ```javascript
 *   var h = require('hastscript');
 *   var ok = require('hast-util-is-javascript');
 *
 *   ok(h('script')); //=> true
 *   ok(h('script', {type: 'text/ecmascript'})); //=> true
 *   ok(h('script', {language: 'ecmascript'})); //=> true
 *   ok(h('script', {type: 'text/fooscript'})); //=> false
 *   ok(h('script', {language: 'fooscript'})); //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isJavaScript(node)`
 *
 *   Return `true` if `node` is a `<script>` element that has a valid
 *   JavaScript `type`, has no `type` and a valid JavaScript `language`,
 *   or has neither.
 */

'use strict'

var has = require('hast-util-has-property')
var is = require('hast-util-is-element')
var trim = require('trim')
var mime = require('./index.json')

module.exports = javascript

/* Check node. */
function javascript(node) {
  if (!is(node, 'script')) {
    return false
  }

  if (has(node, 'type')) {
    return check(node.properties.type)
  }

  return !has(node, 'language') || check(node.properties.language, 'text/')
}

/* Check one value. */
function check(value, prefix) {
  var val

  if (typeof value !== 'string') {
    return false
  }

  val = trim(value.split(';', 1)[0]).toLowerCase()

  return val === '' || mime.indexOf((prefix || '') + val) !== -1
}
