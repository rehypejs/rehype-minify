/**
 * @fileoverview
 *   Check if an element is a JavaScript script.
 */

'use strict';

var has = require('hast-util-has-property');
var is = require('hast-util-is-element');
var trim = require('trim');
var mime = require('./index.json');

module.exports = javascript;

/* Check node. */
function javascript(node) {
  if (!is(node, 'script')) {
    return false;
  }

  if (has(node, 'type')) {
    return check(node.properties.type);
  }

  return !has(node, 'language') || check(node.properties.language, 'text/');
}

/* Check one value. */
function check(value, prefix) {
  var val;

  if (typeof value !== 'string') {
    return false;
  }

  val = trim(value.split(';', 1)[0]).toLowerCase();

  return val === '' || mime.indexOf((prefix || '') + val) !== -1;
}
