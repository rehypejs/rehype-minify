/**
 * @fileoverview
 *   Minify style attributes.
 * @example
 *   <img style="display: block;">
 */

/**
 * @typedef {import('hast').Root} Root
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'

const clean = new CleanCSS()

const prefix = '*{'
const suffix = '}'

/**
 * Minify style attributes.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyStyleAttribute() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.properties && hasProperty(node, 'style')) {
        let value = node.properties.style

        if (typeof value === 'string') {
          try {
            const output = clean.minify(prefix + value + suffix).styles
            value = output ? output.slice(prefix.length, -suffix.length) : value
            // Potential third party errors?
            /* c8 ignore next */
          } catch {}

          node.properties.style = value || null
        }
      }
    })
  }
}
