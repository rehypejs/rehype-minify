/**
 * @fileoverview
 *   Minify media attributes.
 * @example
 *   <link rel="stylesheet" media="only screen and (min-width: 320px)" href="index.css">
 *   <link rel="stylesheet" media="all" href="index.css">
 */

import CleanCSS from 'clean-css'
import visit from 'unist-util-visit'
import is from 'hast-util-is-element'

var clean = new CleanCSS()

var prefix = '@media '
var suffix = '{i{color:red}}'

export default function rehypeMinifyMediaAttribute() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var output
  var value

  if (is(node, ['link', 'source', 'style'])) {
    value = props.media

    if (typeof value === 'string') {
      try {
        output = clean.minify(prefix + value + suffix)
        value = output.styles.slice(prefix.length, -suffix.length)
        // Potential third party errors?
        /* c8 ignore next */
      } catch (_) {}

      props.media = value === 'all' || !value ? null : value
    }
  }
}
