/**
 * @fileoverview
 *   Remove `type` and `language` on JavaScript scripts.
 * @example
 *   <script type="text/javascript"></script>
 *   <script language="javascript1.5"></script>
 */

'use strict';

var visit = require('unist-util-visit');
var js = require('hast-util-is-javascript');

module.exports = removeScriptType;

function removeScriptType() {
  return transform;
}

function transform(tree) {
  visit(tree, 'element', visitor);
}

function visitor(node) {
  var props = node.properties;

  if (js(node)) {
    if ('type' in props) {
      props.type = null;
    }

    if ('language' in props) {
      props.language = null;
    }
  }
}
