/**
 * @fileoverview
 *   Check if an element is a CSS link.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {h} from 'hastscript'
 *   import {isCssLink} from 'hast-util-is-css-link'
 *
 *   isCssLink(h('link', {rel: ['stylesheet', 'author']})) //=> true
 *   isCssLink(h('link', {rel: ['stylesheet'], type: 'text/css'})) //=> true
 *   isCssLink(h('link', {rel: ['stylesheet'], type: 'text/foo'})) //=> false
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

import trim from 'trim'

export function isCssLink(node) {
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
