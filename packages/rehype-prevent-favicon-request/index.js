/**
 * @fileoverview
 *   Prevent a `favicon.ico` request.
 *
 *   Use this plugin if there’s no `favicon.ico` at the root
 *   of your server, and there may or may not be a `shortcut icon`
 *   referenced in your HTML.
 *
 *   This plugin increases the size of the HTML, but prevents
 *   a round trip to the server by inserting an empty favicon.
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html><html><head></head><body></body></html>
 */

'use strict'

var array = require('x-is-array')
var visit = require('unist-util-visit')

module.exports = doctype

function doctype() {
  return transform
}

function transform(tree) {
  var head
  var ico

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
    var rel

    if (node.tagName === 'head') {
      head = node
    }

    if (node.tagName === 'link') {
      rel = node.properties.rel

      if (
        array(rel) &&
        rel.indexOf('shortcut') !== -1 &&
        rel.indexOf('icon') !== -1
      ) {
        ico = node
        return false
      }
    }

    /* Stop visiting in body. */
    if (node.tagName === 'body') {
      return false
    }
  }
}
