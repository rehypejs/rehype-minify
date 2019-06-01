/**
 * @fileoverview
 *   Minify enumerated attributes.
 *
 *   Sometimes attributes or their values can be dropped entirely, or a shorter
 *   value can be used.
 * @example
 *   <meta charset="utf-8">
 *   <video preload="auto">
 *     <track kind="subtitles" src="abc.xyz">
 *   </video>
 */

'use strict'

var visit = require('unist-util-visit')
var has = require('hast-util-has-property')
var is = require('hast-util-is-element')
var schema = require('./schema')

module.exports = enums

var own = {}.hasOwnProperty

function enums() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var definitions
  var length
  var index
  var prop

  for (prop in props) {
    if (
      has(node, prop) &&
      own.call(schema, prop) &&
      typeof props[prop] === 'string'
    ) {
      definitions = schema[prop]
      definitions = 'length' in definitions ? definitions : [definitions]
      length = definitions.length
      index = -1

      while (++index < length) {
        if (is(node, definitions[index].tagNames)) {
          props[prop] = minify(props[prop], definitions[index])
        }
      }
    }
  }
}

function minify(value, info) {
  var insensitive = value.toLowerCase()
  var states = info.states
  var length = states.length
  var index = -1
  var known = false
  var state
  var result

  while (++index < length) {
    state = states[index]

    if (state === null) {
      continue
    } else if (typeof state === 'string') {
      state = [state]
    }

    if (state.indexOf(insensitive) !== -1) {
      known = true
      break
    }
  }

  // So, this is a valid enumerated attribute.
  // Lets’s optimize it.
  if (known && state) {
    result = state[0]
  } else if (typeof info.invalid === 'string') {
    result = info.invalid
  } else if (typeof info.missing === 'string') {
    result = info.missing
  } else {
    return value
  }

  // Should be a setting.
  // There’s a missing value defined, so we can just as well remove the property
  // all-together if they’re the same.
  if (result === info.missing) {
    result = null
  } else if (result === info.invalid) {
    // If the invalid state is longer that one character, we explicitly set a
    // short keyword, namely “a” (never used as a keyword so always invalid).
    // Otherwise, we keep the result (it’s often an empty string)
    result = result.length > 1 ? 'a' : result
  }

  return result
}
