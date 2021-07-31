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
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'

const own = {}.hasOwnProperty

export default function rehypeMinifyUrl(options = {}) {
  const relate = new Relate(options.from, options)

  try {
    relate.relate('/')
  } catch {
    throw new Error('Missing absolute `from` in options')
  }

  return transform

  function transform(tree) {
    visit(tree, 'element', visitor)

    function visitor(node) {
      const props = node.properties
      let prop

      for (prop in props) {
        if (
          hasProperty(node, prop) &&
          own.call(urlAttributes, prop) &&
          isElement(node, urlAttributes[prop])
        ) {
          props[prop] = minify(props[prop], relate)
        }
      }
    }
  }
}

function minify(value, relate) {
  return (Array.isArray(value) ? all : one)(value, relate)
}

function all(value, relate) {
  let index = -1
  const result = []

  while (++index < value.length) {
    result[index] = one(value[index], relate)
  }

  return result
}

function one(value, relate) {
  try {
    return relate.relate(value)
    // Coverage bug on Erbium.
    /* c8 ignore next */
  } catch {}

  return value
}
