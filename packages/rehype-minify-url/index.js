/**
 * @fileoverview
 *   Minify URLs.  Uses [`relateurl`](https://www.npmjs.com/package/relateurl).
 *   `from` in options is required (which must be an absolute url to
 *   where the file is hosted.  All other [options](https://www.npmjs.com/package/relateurl#options)
 *   are passed through.
 *
 * @example
 *   {"plugin": {"from": "https://example.com"}}
 *   <a href="/foo/../bar.html"></a>
 */

'use strict'

var Relate = require('relateurl')
var array = require('x-is-array')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')
var is = require('hast-util-is-element')
var attributes = require('html-url-attributes')

module.exports = url

var own = {}.hasOwnProperty

function url(options) {
  var settings = options || {}
  var relate = new Relate(settings.from, settings)

  try {
    relate.relate('/')
  } catch (err) {
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
          own.call(attributes, prop) &&
          is(node, attributes[prop])
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
  } catch (err) {}

  return value
}
