/**
 * @fileoverview
 *   Set the plain-text value of a hast node.
 *   This is like the DOMs `Node#textContent` setter.
 *   The given node is returned.
 *
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {h} from 'hastscript'
 *   import {fromString} from 'hast-util-from-string'
 *
 *   fromString(h('p'), 'Alpha')
 *   // { type: 'element',
 *   //   tagName: 'p',
 *   //   properties: {},
 *   //   children: [ { type: 'text', value: 'Alpha' } ] }
 *   fromString(h('div', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']), 'Charlie')
 *   // { type: 'element',
 *   //   tagName: 'div',
 *   //   properties: {},
 *   //   children: [ { type: 'text', value: 'Charlie' } ] }
 *   ```
 *
 *   ## API
 *
 *   ### `fromString(node[, value])`
 *
 *   If `node` is a text node (has a `value` property), set that to the given
 *   `value` or an empty string.
 *   If `node` is a parent node (has `children`), replace them with a text node
 *   whose data is set to the given `value`, or if `value` is not given, remove
 *   all its children.
 */

export function fromString(node, d) {
  var value = d == null ? '' : String(d)

  if ('children' in node) {
    node.children = []

    if (value) {
      node.children.push({type: 'text', value: value})
    }
  } else {
    node.value = value
  }

  return node
}
