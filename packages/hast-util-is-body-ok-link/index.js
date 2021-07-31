/**
 * @fileoverview
 *   Check if a `link` element is “Body OK”.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {h} from 'hastscript'
 *   import {isBodyOkLink} from 'hast-util-is-body-ok-link'
 *
 *   isBodyOkLink(h('link', {itemProp: 'foo'})) //=> true
 *   isBodyOkLink(h('link', {rel: ['stylesheet'], href: 'index.css'})) //=> true
 *   isBodyOkLink(h('link', {rel: ['author'], href: 'index.css'})) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isBodyOkLink(node)`
 *
 *   * Return `true` for `link` elements with an `itemProp`
 *   * Return `true` for `link` elements with a `rel` list where one or more
 *     entries are `pingback`, `prefetch`, or `stylesheet`.
 */

import {isElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'

var list = ['pingback', 'prefetch', 'stylesheet']

export function isBodyOkLink(node) {
  var length
  var index
  var rel

  if (!isElement(node, 'link')) {
    return false
  }

  if (hasProperty(node, 'itemProp')) {
    return true
  }

  rel = (node.properties || {}).rel || []
  length = rel.length
  index = -1

  if (rel.length === 0) {
    return false
  }

  while (++index < length) {
    if (list.indexOf(rel[index]) === -1) {
      return false
    }
  }

  return true
}
