/**
 * @fileoverview
 *   Check if an element is a css link.
 */

'use strict';

var trim = require('trim');

module.exports = cssLink;

function cssLink(node) {
  var props;
  var rel;
  var type;

  if (!node || node.tagName !== 'link') {
    return false;
  }

  props = node.properties || {};
  rel = props.rel;

  if (!rel || !rel.indexOf || rel.indexOf('stylesheet') === -1) {
    return false;
  }

  type = trim(props.type || '').toLowerCase();

  return !type || type === 'text/css';
}
