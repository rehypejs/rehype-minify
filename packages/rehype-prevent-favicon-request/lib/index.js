/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'

/**
 * Prevent a network request to the favicon when there is none.
 *
 * @returns
 *   Transform.
 */
export default function rehypePreventFaviconRequest() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    /** @type {Element | undefined} */
    let head
    /** @type {Element | undefined} */
    let ico

    visit(tree, 'element', function (node) {
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
          href: 'data:image/x-icon;,',
          rel: ['shortcut', 'icon'],
          type: 'image/x-icon'
        },
        children: []
      })
    }
  }
}
