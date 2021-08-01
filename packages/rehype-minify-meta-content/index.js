/**
 * @fileoverview
 *   Minify `content` on `meta` elements.
 *
 *   Note: `meta[name=theme-color]` and `meta[name=msapplication-TileColor]`
 *   are handled by `rehype-minify-meta-color`.
 * @example
 *   <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
 *   <meta name="keywords" content="foo, bar baz, qux">
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {parse, stringify} from 'comma-separated-tokens'
import {visit} from 'unist-util-visit'
import {isElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'

const lists = new Set([
  'viewport',
  'keywords',
  'robots',
  'apple-itunes-app',
  'apple-media-service-subscription'
])

/**
 * Minify `content` on `meta` elements.
 *
 * Note: `meta[name=theme-color]` and `meta[name=msapplication-TileColor]`
 * are handled by `rehype-minify-meta-color`.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyMetaContent() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      const name = String(props.name || '')
      let value = props.content

      if (
        isElement(node, 'meta') &&
        hasProperty(node, 'content') &&
        typeof value === 'string'
      ) {
        if (name === 'viewport') {
          value = value
            .replace(/(\d+\.\d+)/, (d) => String(Number(d)))
            .replace(/user-scalable=\s*yes/, '')
          // Fall through.
        }

        if (lists.has(name)) {
          value = stringify(parse(value), {padLeft: false})
        }

        props.content = value
      }
    })
  }
}
