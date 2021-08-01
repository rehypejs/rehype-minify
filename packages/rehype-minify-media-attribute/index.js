/**
 * @fileoverview
 *   Minify media attributes.
 * @example
 *   <link rel="stylesheet" media="only screen and (min-width: 320px)" href="index.css">
 *   <link rel="stylesheet" media="all" href="index.css">
 */

/**
 * @typedef {import('hast').Root} Root
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'

const clean = new CleanCSS()

const prefix = '@media '
const suffix = '{i{color:red}}'

/**
 * Minify media attributes.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyMediaAttribute() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties

      if (props && isElement(node, ['link', 'source', 'style'])) {
        let value = props.media

        if (typeof value === 'string') {
          try {
            const output = clean.minify(prefix + value + suffix)
            value = output.styles.slice(prefix.length, -suffix.length)
            // Potential third party errors?
            /* c8 ignore next */
          } catch {}

          props.media = value === 'all' || !value ? null : value
        }
      }
    })
  }
}
