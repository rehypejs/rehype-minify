/**
 * @fileoverview
 *   Prevent a `favicon.ico` request.
 *
 *   Use this plugin if there’s no `favicon.ico` at the root of your server, and
 *   there may or may not be a `shortcut icon` referenced in your HTML.
 *
 *   This plugin increases the size of the HTML, but prevents a round trip to
 *   the server by inserting an empty favicon.
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html><html><head></head><body></body></html>
 */

import {visit} from 'unist-util-visit'

export default function rehypePreventFaviconRequest() {
  return transform
}

function transform(tree) {
  let head
  let ico

  visit(tree, 'element', visitor)

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

  function visitor(node) {
    if (node.tagName === 'head') {
      head = node
    }

    if (node.tagName === 'link') {
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
  }
}
