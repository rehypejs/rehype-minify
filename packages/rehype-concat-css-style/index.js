/**
 * @fileoverview
 *   Concatenate CSS `<style>` elements together.
 *
 *   This plugin can be dangerous if CSS is invalid.
 *   Additionally, this plugin does not handle `scoped` styles.
 *   Those are [deprecated](https://github.com/whatwg/html/issues/552) anyway.
 * @example
 *   <style>b{color:red}</style>
 *   <style>i{color:blue}</style>
 */

import {visit} from 'unist-util-visit'
import {isCssStyle} from 'hast-util-is-css-style'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'

export default function rehypeConcatCssStyle() {
  return transform
}

function transform(tree) {
  const matches = []

  visit(tree, 'element', visitor)

  if (matches.length > 1) {
    concat()
  }

  function visitor(node, index, parent) {
    if (isCssStyle(node)) {
      matches.push([parent, node])
    }
  }

  function concat() {
    let index = -1
    const contents = []

    while (++index < matches.length) {
      const match = matches[index]

      if (index) {
        const siblings = match[0].children
        siblings.splice(siblings.indexOf(match[1]), 1)
      }

      contents[index] = toString(match[1])
    }

    fromString(matches[0][1], contents.join(''))
  }
}
