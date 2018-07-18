/**
 * @fileoverview
 *   Minify `script` elements with a JSON body.
 * @example
 *   <script type="application/ld+json">
 *   {
 *     "@context": {
 *       "name": "http://xmlns.com/foaf/0.1/name",
 *       "@id": "http://me.example.com",
 *       "@type": "Person",
 *       "name": "John Smith",
 *       "homepage": "http://www.example.com/"
 *     }
 *   }
 *   </script>
 */

'use strict'

var visit = require('unist-util-visit')
var fromString = require('hast-util-from-string')
var toString = require('hast-util-to-string')
var is = require('hast-util-is-element')

module.exports = scriptJSON

function scriptJSON() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  if (is(node, 'script') && node.properties.type === 'application/ld+json') {
    try {
      fromString(node, JSON.stringify(JSON.parse(toString(node))))
    } catch (err) {}
  }
}
