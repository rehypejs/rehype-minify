/**
 * @fileoverview
 *   Minify style attributes.
 * @example
 *   <img style="display: block;">
 */

import CleanCSS from 'clean-css'
import visit from 'unist-util-visit'
import has from 'hast-util-has-property'

var clean = new CleanCSS()

var prefix = '*{'
var suffix = '}'

export default function rehypeMinifyStyleAttribute() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props
  var value
  var output

  if (has(node, 'style')) {
    props = node.properties
    value = props.style

    if (typeof value === 'string') {
      try {
        output = clean.minify(prefix + value + suffix).styles
        value = output ? output.slice(prefix.length, -suffix.length) : value
        // Potential third party errors?
        /* c8 ignore next */
      } catch (_) {}

      props.style = value || null
    }
  }
}
