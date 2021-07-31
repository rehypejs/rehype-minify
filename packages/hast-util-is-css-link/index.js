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

export function isCssLink(node) {
  if (!node || node.tagName !== 'link') {
    return false
  }

  const props = node.properties || {}
  const rel = props.rel

  if (!rel || !rel.indexOf || !rel.includes('stylesheet')) {
    return false
  }

  const type = String(props.type || '')
    .trim()
    .toLowerCase()

  return !type || type === 'text/css'
}
