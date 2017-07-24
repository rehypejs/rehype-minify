/**
 * @fileoverview
 *   Get the plain-text value of a HAST node.
 */

'use strict';

module.exports = toString;

function toString(node) {
  /* “The concatenation of data of all the Text node descendants
   * of the context object, in tree order.” */
  if ('children' in node) {
    return all(node);
  }

  /* “Context object’s data.” */
  return 'value' in node ? node.value : '';
}

function one(node) {
  if (node.type === 'text') {
    return node.value;
  }

  return node.children ? all(node) : '';
}

function all(node) {
  var children = node.children;
  var length = children.length;
  var index = -1;
  var result = [];

  while (++index < length) {
    result[index] = one(children[index]);
  }

  return result.join('');
}
