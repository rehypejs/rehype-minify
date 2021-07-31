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

import visit from 'unist-util-visit'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'
import is from 'hast-util-is-element'

export default function rehypeMinifyJsonScript() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  if (is(node, 'script') && node.properties.type === 'application/ld+json') {
    try {
      fromString(node, JSON.stringify(JSON.parse(toString(node))))
    } catch (_) {}
  }
}
