/**
 * @fileoverview
 *   Minify style attributes.
 * @example
 *   <meta name="theme-color" content="#0000ff">
 *   <meta name="msapplication-TileColor" content="#ff0000">
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'

var clean = new CleanCSS()

var prefix = '*{color:'
var suffix = '}'

export default function rehypeMinifyMetaColor() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var name = props.name
  var value
  var output

  if (
    isElement(node, 'meta') &&
    (name === 'msapplication-TileColor' || name === 'theme-color') &&
    hasProperty(node, 'content')
  ) {
    value = props.content

    if (typeof value === 'string') {
      try {
        output = clean.minify(prefix + value + suffix)
        value = output.styles.slice(prefix.length, -suffix.length)
        // Potential third party errors?
        /* c8 ignore next */
      } catch (_) {}

      props.content = value
    }
  }
}
