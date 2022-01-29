/**
 * rehype plugin to prevent a network request to the favicon when there
 * is none.
 *
 * ## What is this?
 *
 * This package is a plugin that inserts an empty favicon image, when there is
 * none referenced, to prevent a network request.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you don’t have a `favicon.ico` at the root of
 * your server, and want to prevent browsers sending out a network request to
 * find it.
 *
 * This plugin increases the size of the HTML, but prevents a round trip to
 * the server by inserting an empty favicon.
 *
 * ## API
 *
 * ### `unified().use(rehypePreventFaviconRequest)`
 *
 * Prevent a network request to the favicon when there is none.
 * There are no options.
 *
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html><html><head></head><body></body></html>
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

import {visit} from 'unist-util-visit'

/**
 * Prevent a `favicon.ico` request.
 *
 * Use this plugin if there’s no `favicon.ico` at the root of your server, and
 * there may or may not be a `shortcut icon` referenced in your HTML.
 *
 * This plugin increases the size of the HTML, but prevents a round trip to
 * the server by inserting an empty favicon.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypePreventFaviconRequest() {
  return (tree) => {
    /** @type {Element|undefined} */
    let head
    /** @type {Element|undefined} */
    let ico

    visit(tree, 'element', (node) => {
      if (node.tagName === 'head') {
        head = node
      }

      if (node.tagName === 'link' && node.properties) {
        const rel = node.properties.rel

        if (
          Array.isArray(rel) &&
          rel.includes('shortcut') &&
          rel.includes('icon')
        ) {
          ico = node
          return false
        }
      }

      // Stop visiting in body.
      if (node.tagName === 'body') {
        return false
      }
    })

    if (head && !ico) {
      head.children.push({
        type: 'element',
        tagName: 'link',
        properties: {
          rel: ['shortcut', 'icon'],
          type: 'image/x-icon',
          href: 'data:image/x-icon;,'
        },
        children: []
      })
    }
  }
}
