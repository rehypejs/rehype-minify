/**
 * @typedef {import('hast').Nodes} Nodes
 */

// To do: next major: remove return result.
/**
 * Set the plain-text value of a hast node.
 * This is like the DOMs `Node#textContent` setter.
 * The given node is returned.
 *
 * @template {Nodes} Thing
 *   Node kind.
 * @param {Thing} node
 *   Node to change.
 * @param {string | null | undefined} [value='']
 *   Value to use (default: `''`)
 * @returns {Thing}
 *   Given node.
 */
export function fromString(node, value) {
  const normalized = value === undefined || value === null ? '' : String(value)

  if ('children' in node) {
    node.children = []

    if (value) {
      node.children.push({type: 'text', value: normalized})
    }
  } else if (node.type !== 'doctype') {
    node.value = normalized
  }

  return node
}
