/**
 * @fileoverview
 *   Collapse whitespace.
 * @example
 *   <h1>Heading</h1>
 *   <p><strong>This</strong> and <em>that</em></p>
 */

'use strict';

/* Dependencies. */
var collapseWhiteSpace = require('collapse-white-space');
var whitespaceSensitive = require('html-whitespace-sensitive-tag-names');
var is = require('unist-util-is');
var modify = require('unist-util-modify-children');
var element = require('hast-util-is-element');
var has = require('hast-util-has-property');
var embedded = require('hast-util-embedded');
var bodyOK = require('hast-util-is-body-ok-link');
var list = require('./list');

/* Expose. */
module.exports = collapse;

function collapse() {
  return transform;
}

function transform(tree) {
  var modifier = modify(visitor);
  var inside = false;
  var seen = false;

  visitor(tree);

  return tree;

  function visitor(node, index, parent) {
    var head;
    var prev;
    var next;
    var value;
    var start;
    var end;

    if (is('text', node)) {
      prev = parent.children[index - 1];
      next = parent.children[index + 1];

      value = collapseWhiteSpace(node.value);
      end = value.length;
      start = 0;

      if (value.charAt(0) === ' ' && viable(prev)) {
        start++;
      }

      if (value.charAt(end - 1) === ' ' && viable(next)) {
        end--;
      }

      value = value.slice(start, end);

      /* Remove the node if it’s collapsed entirely. */
      if (!value) {
        parent.children.splice(index, 1);

        return index;
      }

      node.value = value;
    }

    if (!seen && !inside) {
      inside = seen = head = element(node, 'head');
    }

    if (node.children && !element(node, whitespaceSensitive)) {
      modifier(node);
    }

    if (head) {
      inside = false;
    }
  }

  function viable(node) {
    return !node || inside || !collapsable(node);
  }
}

/* Check if `node` is collapsable. */
function collapsable(node) {
  return is('text', node) ||
    element(node, list) ||
    embedded(node) ||
    bodyOK(node) ||
    (element(node, 'meta') && has(node, 'itemProp'));
}
