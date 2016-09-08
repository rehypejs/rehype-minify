/**
 * @fileoverview
 *   Check if an element is a CSS `<style>` element.
 */

'use strict';

var trim = require('trim');

module.exports = cssStyle;

function cssStyle(node) {
  var val;

  if (!node || node.tagName !== 'style') {
    return false;
  }

  val = (node.properties || {}).type;

  return val == null || trim(val).toLowerCase() === 'text/css';
}
