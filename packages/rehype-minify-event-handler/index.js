/**
 * @fileoverview
 *   Minify event handler attributes.
 * @example
 *   <h1 onclick="javascript:alert(false)">Hello</h1>
 */

import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isEventHandler} from 'hast-util-is-event-handler'

var prefix = 'function a(){'
var suffix = '}a();'

export default function rehypeMinifyEventHandler() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var name

  for (name in props) {
    if (hasProperty(node, name) && isEventHandler(name)) {
      props[name] = minify(props[name])
    }
  }
}

function minify(value) {
  var result = value
  var output

  if (typeof result !== 'string') {
    return result
  }

  try {
    output = Uglify.minify(prefix + result + suffix)
    result = output.code.slice(prefix.length, -suffix.length)
  } catch (_) {}

  return result.trim()
}
