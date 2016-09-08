/**
 * @fileoverview
 *   Remove empty attributes, if possible.
 * @example
 *   <label for id=""></label>
 */

'use strict';

var has = require('has');
var array = require('x-is-array');
var visit = require('unist-util-visit');
var is = require('hast-util-is-element');
var handler = require('hast-util-is-event-handler');
var attributes = require('./schema');

module.exports = empty;

function empty() {
  return transform;
}

function transform(tree) {
  visit(tree, 'element', visitor);
}

function visitor(node) {
  var props = node.properties;
  var prop;
  var value;

  for (prop in props) {
    value = props[prop];

    if (
      (value === '' || (array(value) && !value.length)) &&
      (handler(prop) || (has(attributes, prop) && is(node, attributes[prop])))
    ) {
      props[prop] = null;
    }
  }
}
