/**
 * @fileoverview
 *   Remove content of external JavaScript
 *   `script` elements.
 * @example
 *   <script src="index.js">Hello!</script>
 */

'use strict';

var visit = require('unist-util-visit');
var js = require('hast-util-is-javascript');
var has = require('hast-util-has-property');

module.exports = scriptJS;

function scriptJS() {
  return transform;
}

function transform(tree) {
  visit(tree, 'element', visitor);
}

function visitor(node) {
  if (js(node) && has(node, 'src')) {
    node.children = [];
  }
}
