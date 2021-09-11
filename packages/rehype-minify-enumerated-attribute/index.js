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
import {stringify} from 'space-separated-tokens'
import {schema} from './schema.js'

const own = {}.hasOwnProperty

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('./schema.js').Info} Info
 */

/**
 * Minify enumerated attributes.
 *
 * Sometimes attributes or their values can be dropped entirely, or a shorter
 * value can be used.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyEnumeratedAttribute() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (own.call(schema, prop) && hasProperty(node, prop)) {
          let value = props[prop]

          // Note: we don’t really handle enumerated as lists, so instead
          // we cast them to a string (assuming they are space-separated).
          if (Array.isArray(value)) {
            value = stringify(value)
          }

          if (typeof value === 'string') {
            const info = schema[prop]
            const definitions = Array.isArray(info) ? info : [info]
            let index = -1

            while (++index < definitions.length) {
              // eslint-disable-next-line max-depth
              if (isElement(node, definitions[index].tagNames)) {
                props[prop] = minify(value, definitions[index])
              }
            }
          }
        }
      }
    })
  }
}

/**
 * @param {string} value
 * @param {Info} info
 * @returns {string|null}
 */
function minify(value, info) {
  const insensitive = info.caseSensitive ? value : value.toLowerCase()
  const states = info.states
  let index = -1
  let known = false
  /** @type {string|null} */
  let result = null
  /** @type {string|string[]|null} */
  let state = null

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
