/**
 * @fileoverview
 *   Check if a node is a conditional comment.
 */

'use strict';

module.exports = conditional;

var re = /^\[if[ \t\f\n\r]+[^\]]+\]|<!\[endif\]$/;

function conditional(node) {
  return node && node.type === 'comment' && re.test(node.value);
}
