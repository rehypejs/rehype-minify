/**
 * @fileoverview
 *   Minify JavaScript URLs.
 * @example
 *   <img src="javascript:alert(true)">
 */

import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'

var own = {}.hasOwnProperty

/* eslint-disable no-script-url */
var protocol = 'javascript:'
/* eslint-enable no-script-url */

var prefix = 'function a(){'
var suffix = '}a();'

export default function rehypeMinifyJavaScriptUrl() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var prop

  for (prop in props) {
    if (
      hasProperty(node, prop) &&
      own.call(urlAttributes, prop) &&
      isElement(node, urlAttributes[prop])
    ) {
      props[prop] = minify(props[prop])
    }
  }
}

function minify(value) {
  var result = value
  var output

  if (
    typeof result === 'string' &&
    result.slice(0, protocol.length).toLowerCase() === protocol
  ) {
    result = result.slice(protocol.length)

    try {
      output = Uglify.minify(prefix + result + suffix)
      result = output.code.slice(prefix.length, -suffix.length)
    } catch (_) {}

    result = protocol + result.trim()
  }

  return result
}
