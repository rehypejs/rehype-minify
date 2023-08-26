/**
 * rehype plugin to minify `content` attributes on `<meta>` elements.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the value of the `content` attribute
 * of `<meta>` elements.
 *
 * Note that `meta[name=theme-color]` and `meta[name=msapplication-TileColor]`
 * are handled by
 * [`rehype-minify-meta-color`](https://github.com/rehypejs/rehype-minify/tree/main/packages/rehype-minify-meta-color).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyMetaContent)`
 *
 * Minify `content` attributes on `meta` elements.
 * There are no options.
 *
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
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeMinifyMetaContent() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const name = String(node.properties.name || '')
      let value = node.properties.content

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

        node.properties.content = value
      }
    })
  }
}
