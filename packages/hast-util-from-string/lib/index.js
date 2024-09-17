/**
 * @import {Nodes} from 'hast'
 */

/**
 * Set the plain-text value of a hast node.
 *
 * This is like the DOMs `Node#textContent` setter.
 * The given node is returned.
 *
 * @param {Nodes} node
 *   Node to change.
 * @param {string | null | undefined} [value='']
 *   Value to use (default: `''`)
 * @returns {undefined}
 *   Nothing.
 */
export function fromString(node, value) {
  const normalized = value === null || value === undefined ? '' : String(value)

  if ('children' in node) {
    node.children = []

    if (value) {
      node.children.push({type: 'text', value: normalized})
    }
  } else if (node.type !== 'doctype') {
    node.value = normalized
  }
}
