/**
 * @fileoverview
 *   Concatenate JS `<script>` elements together.
 *
 *   This plugin can be dangerous if a) JS is invalid, or b) values are expected
 *   to be undefined in one script and defined in another.
 * @example
 *   <script>function foo() {}</script>
 *   <script>function bar() {}</script>
 */

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isJavaScript} from 'hast-util-is-javascript'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'

export default function rehypeConcatJavaScript() {
  return transform
}

function transform(tree) {
  const matches = []

  visit(tree, 'element', visitor)

  if (matches.length > 1) {
    concat()
  }

  function visitor(node, index, parent) {
    if (isJavaScript(node) && !hasProperty(node, 'src')) {
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

    fromString(matches[0][1], contents.join(';'))
  }
}
