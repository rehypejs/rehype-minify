/**
 * @fileoverview
 *   Minify URLs.
 *   Uses [`relateurl`](https://www.npmjs.com/package/relateurl).
 *   `from` in options is required (which must be an absolute url to where the
 *   file is hosted.
 *   All other [options](https://www.npmjs.com/package/relateurl#options) are
 *   passed through.
 *
 * @example
 *   {"plugin": {"from": "https://example.com"}}
 *   <a href="/foo/../bar.html"></a>
 */

import Relate from 'relateurl'
import array from 'x-is-array'
import visit from 'unist-util-visit'
import has from 'hast-util-has-property'
import is from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'

var own = {}.hasOwnProperty

export default function rehypeMinifyUrl(options) {
  var settings = options || {}
  var relate = new Relate(settings.from, settings)

  try {
    relate.relate('/')
  } catch (_) {
    throw new Error('Missing absolute `from` in options')
  }

  return transform

  function transform(tree) {
    visit(tree, 'element', visitor)

    function visitor(node) {
      var props = node.properties
      var prop

      for (prop in props) {
        if (
          has(node, prop) &&
          own.call(urlAttributes, prop) &&
          is(node, urlAttributes[prop])
        ) {
          props[prop] = minify(props[prop], relate)
        }
      }
    }
  }
}

function minify(value, relate) {
  return (array(value) ? all : one)(value, relate)
}

function all(value, relate) {
  var length = value.length
  var index = -1
  var result = []

  while (++index < length) {
    result[index] = one(value[index], relate)
  }

  return result
}

function one(value, relate) {
  try {
    return relate.relate(value)
  } catch (_) {}

  return value
}
