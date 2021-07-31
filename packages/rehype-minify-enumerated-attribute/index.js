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

import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

export default function rehypeMinifyEnumeratedAttribute() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  const props = node.properties
  let prop

  for (prop in props) {
    if (
      hasProperty(node, prop) &&
      own.call(schema, prop) &&
      typeof props[prop] === 'string'
    ) {
      const definitions = Array.isArray(schema[prop])
        ? schema[prop]
        : [schema[prop]]
      let index = -1

      while (++index < definitions.length) {
        if (isElement(node, definitions[index].tagNames)) {
          props[prop] = minify(props[prop], definitions[index])
        }
      }
    }
  }
}

function minify(value, info) {
  const insensitive = value.toLowerCase()
  const states = info.states
  let index = -1
  let known = false
  let result
  let state

  while (++index < states.length) {
    state = states[index]

    if (state === null) {
      continue
    }

    if (typeof state === 'string') {
      state = [state]
    }

    if (state.includes(insensitive)) {
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
  } else if (typeof info.missing === 'string' && !info.allowUnknown) {
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
