/**
 * @fileoverview
 *   Concatenate JS `<script>` elements together.
 *
 *   This plugin can be dangerous if a) JS is invalid,
 *   or b) values are expected to be undefined in one script
 *   and defined in another.
 * @example
 *   <script>function foo() {}</script>
 *   <script>function bar() {}</script>
 */

'use strict';

var visit = require('unist-util-visit');
var has = require('hast-util-has-property');
var javascript = require('hast-util-is-javascript');
var fromString = require('hast-util-from-string');
var toString = require('hast-util-to-string');

module.exports = concatJS;

function concatJS() {
  return transform;
}

function transform(tree) {
  var matches = [];

  visit(tree, 'element', visitor);

  if (matches.length > 1) {
    concat();
  }

  function visitor(node, index, parent) {
    if (javascript(node) && !has(node, 'src')) {
      matches.push([parent, node]);
    }
  }

  function concat() {
    var length = matches.length;
    var index = -1;
    var contents = [];
    var match;
    var siblings;

    while (++index < length) {
      match = matches[index];

      if (index) {
        siblings = match[0].children;
        siblings.splice(siblings.indexOf(match[1]), 1);
      }

      contents[index] = toString(match[1]);
    }

    fromString(matches[0][1], contents.join(';'));
  }
}
