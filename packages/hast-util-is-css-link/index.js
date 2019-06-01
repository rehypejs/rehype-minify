/**
 * @fileoverview
 *   Check if an element is a CSS link.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   var h = require('hastscript')
 *   var ok = require('hast-util-is-css-link')
 *
 *   ok(h('link', {rel: ['stylesheet', 'author']})) //=> true
 *   ok(h('link', {rel: ['stylesheet'], type: 'text/css'})) //=> true
 *   ok(h('link', {rel: ['stylesheet'], type: 'text/foo'})) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isCSSLink(node)`
 *
 *   Return `true` if `node` is a `<link>` element with a `rel` list that
 *   contains `'stylesheet'` and has no `type`, an empty `type`, or `'text/css'`
 *   as its `type`.
 */

'use strict'

var trim = require('trim')

module.exports = cssLink

function cssLink(node) {
  var props
  var rel
  var type

  if (!node || node.tagName !== 'link') {
    return false
  }

  props = node.properties || {}
  rel = props.rel

  if (!rel || !rel.indexOf || rel.indexOf('stylesheet') === -1) {
    return false
  }

  type = trim(props.type || '').toLowerCase()

  return !type || type === 'text/css'
}
