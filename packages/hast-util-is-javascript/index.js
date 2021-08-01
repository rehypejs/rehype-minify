/**
 * @fileoverview
 *   Check if an element is a JavaScript script.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {h} from 'hastscript'
 *   import {isJavaScript} from 'hast-util-is-javascript'
 *
 *   isJavaScript(h('script')) //=> true
 *   isJavaScript(h('script', {type: 'text/ecmascript'})) //=> true
 *   isJavaScript(h('script', {language: 'ecmascript'})) //=> true
 *   isJavaScript(h('script', {type: 'text/fooscript'})) //=> false
 *   isJavaScript(h('script', {language: 'fooscript'})) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isJavaScript(node)`
 *
 *   Return `true` if `node` is a `<script>` element that has a valid JavaScript
 *   `type`, has no `type` and a valid JavaScript `language`, or has neither.
 */

import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'

const mime = new Set([
  'application/ecmascript',
  'application/javascript',
  'application/x-ecmascript',
  'application/x-javascript',
  'text/ecmascript',
  'text/javascript',
  'text/javascript1.0',
  'text/javascript1.1',
  'text/javascript1.2',
  'text/javascript1.3',
  'text/javascript1.4',
  'text/javascript1.5',
  'text/jscript',
  'text/livescript',
  'text/x-ecmascript',
  'text/x-javascript'
])

/**
 * @typedef {import('hast').Root} Root
 * @typedef {Root|Root['children'][number]} Node
 */

/**
 * Check if an element is a JavaScript script.
 *
 * @param {Node} node
 * @returns {boolean}
 */
export function isJavaScript(node) {
  if (!isElement(node, 'script')) {
    return false
  }

  const props = node.properties || {}

  if (hasProperty(node, 'type')) {
    return check(props.type)
  }

  return !hasProperty(node, 'language') || check(props.language, 'text/')
}

/**
 * Check one value.
 *
 * @param {unknown} d
 * @param {string} [prefix]
 * @returns {boolean}
 */
function check(d, prefix) {
  if (typeof d !== 'string') {
    return false
  }

  const value = d.split(';', 1)[0].trim().toLowerCase()

  return value === '' || mime.has((prefix || '') + value)
}
