/**
 * @fileoverview
 *   Minify style attributes.
 * @example
 *   <img style="display: block;">
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'

const clean = new CleanCSS()

const prefix = '*{'
const suffix = '}'

export default function rehypeMinifyStyleAttribute() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  if (hasProperty(node, 'style')) {
    const props = node.properties
    let value = props.style

    if (typeof value === 'string') {
      try {
        const output = clean.minify(prefix + value + suffix).styles
        value = output ? output.slice(prefix.length, -suffix.length) : value
        // Potential third party errors?
        /* c8 ignore next */
      } catch {}

      props.style = value || null
    }
  }
}
