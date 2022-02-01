/**
 * rehype plugin to minify color attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the value of the `content` attribute
 * of `<meta>` elements with a `name` attribute whose value is either
 * `theme-color` or `msapplication-TileColor`, and thus represents a CSS color.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyMetaColor)`
 *
 * Minify color attributes.
 * There are no options.
 *
 * @example
 *   <meta name="theme-color" content="#0000ff">
 *   <meta name="msapplication-TileColor" content="#ff0000">
 */

/**
 * @typedef {import('hast').Root} Root
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'

const clean = new CleanCSS()

const prefix = '*{color:'
const suffix = '}'

/**
 * Minify color attributes.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeMinifyMetaColor() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      const name = props.name

      if (
        isElement(node, 'meta') &&
        (name === 'msapplication-TileColor' || name === 'theme-color') &&
        hasProperty(node, 'content')
      ) {
        let value = props.content

        if (typeof value === 'string') {
          try {
            const output = clean.minify(prefix + value + suffix)
            value = output.styles.slice(prefix.length, -suffix.length)
            // Potential third party errors?
            /* c8 ignore next */
          } catch {}

          props.content = value
        }
      }
    })
  }
}
