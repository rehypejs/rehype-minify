/**
 * @fileoverview
 *   Sort attribute values.
 *
 *   This optimises for repetition-based compression (such as GZip).
 * @example
 *   <div class="qux quux foo bar"></div>
 */

'use strict';

var own = require('has');
var array = require('x-is-array');
var visit = require('unist-util-visit');
var has = require('hast-util-has-property');
var is = require('hast-util-is-element');
var attributes = require('./schema');

module.exports = casing;

function casing() {
  return transform;
}

function transform(tree) {
  visit(tree, 'element', visitor);
}

function visitor(node) {
  var props = node.properties;
  var prop;

  for (prop in props) {
    if (has(node, prop) && own(attributes, prop) && is(node, attributes[prop])) {
      if (array(props[prop])) {
        props[prop].sort();
      }
    }
  }
}
