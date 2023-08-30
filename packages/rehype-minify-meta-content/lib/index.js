/**
 * @typedef {import('hast').Root} Root
 */

import {parse, stringify} from 'comma-separated-tokens'
import {visit} from 'unist-util-visit'

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
 * @returns
 *   Transform.
 */
export default function rehypeMinifyMetaContent() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      if (node.tagName === 'meta') {
        let value = node.properties.content

        if (typeof value === 'string') {
          const name = node.properties.name

          if (name === 'viewport') {
            value = value
              .replace(/(\d+\.\d+)/, function (d) {
                return String(Number(d))
              })
              .replace(/user-scalable=\s*yes/, '')
            // Fall through.
          }

          if (typeof name === 'string' && lists.has(name)) {
            value = stringify(parse(value), {padLeft: false})
          }

          node.properties.content = value
        }
      }
    })
  }
}
