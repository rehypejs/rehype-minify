/**
 * @import {Nodes, Properties} from 'hast'
 */

/**
 * @typedef {Properties[keyof Properties]} PropertyValue
 */

import {collapseWhiteSpace} from 'collapse-white-space'

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
 * Check if a node is a `<script>` that contains or references JavaScript.
 *
 * Returns `true` if `node` is a `<script>` element that has a valid JavaScript
 * `type`, has no `type` and a valid JavaScript `language`, or has neither.
 *
 * @param {Nodes} node
 *   Node to check.
 * @returns {boolean}
 *   Whether a node is a `<script>` that contains or references JavaScript.
 */
export function isJavaScript(node) {
  if (node.type !== 'element' || node.tagName !== 'script') {
    return false
  }

  if (node.properties.type) {
    return check(node.properties.type)
  }

  return !node.properties.language || check(node.properties.language, 'text/')
}

/**
 * Check one value.
 *
 * @param {PropertyValue} d
 *   Property value.
 * @param {string | undefined} [prefix='']
 *   Optional prefix (default: `''`).
 * @returns {boolean}
 *   Whether it matches.
 */
function check(d, prefix) {
  if (typeof d !== 'string') {
    return false
  }

  const value = collapseWhiteSpace(d.split(';', 1)[0], {
    style: 'html',
    trim: true
  }).toLowerCase()

  return value === '' || mime.has((prefix || '') + value)
}
