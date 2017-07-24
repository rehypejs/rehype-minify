/**
 * @fileoverview
 *   Set the plain-text value of a HAST node.
 *   This is like the DOMs `Node#textContent` setter.
 *   The given node is returned.
 */

'use strict';

module.exports = fromString;

function fromString(node, value) {
  var val = value == null ? '' : String(value);

  if ('children' in node) {
    node.children = [];

    if (val) {
      node.children.push({type: 'text', value: val});
    }
  } else {
    node.value = val;
  }

  return node;
}
