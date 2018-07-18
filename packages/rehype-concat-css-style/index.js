/**
 * @fileoverview
 *   Concatenate CSS `<style>` elements together.
 *
 *   This plugin can be dangerous if CSS is invalid.
 *   Additionally, this plugin does not handle `scoped`
 *   styles.  Those are [deprecated](https://github.com/whatwg/html/issues/552)
 *   anyway.
 * @example
 *   <style>b{color:red}</style>
 *   <style>i{color:blue}</style>
 */

'use strict'

var visit = require('unist-util-visit')
var css = require('hast-util-is-css-style')
var fromString = require('hast-util-from-string')
var toString = require('hast-util-to-string')

module.exports = concatCSSStyle

function concatCSSStyle() {
  return transform
}

function transform(tree) {
  var matches = []

  visit(tree, 'element', visitor)

  if (matches.length > 1) {
    concat()
  }

  function visitor(node, index, parent) {
    if (css(node)) {
      matches.push([parent, node])
    }
  }

  function concat() {
    var length = matches.length
    var index = -1
    var contents = []
    var match
    var siblings

    while (++index < length) {
      match = matches[index]

      if (index) {
        siblings = match[0].children
        siblings.splice(siblings.indexOf(match[1]), 1)
      }

      contents[index] = toString(match[1])
    }

    fromString(matches[0][1], contents.join(''))
  }
}
