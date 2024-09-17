/**
 * @import {Root} from 'hast'
 * @import {Definition} from 'html-enumerated-attributes'
 */

import {matches} from 'hast-util-select'
import {enumeratedAttributes} from 'html-enumerated-attributes'
import {html, find} from 'property-information'
import {stringify} from 'space-separated-tokens'
import {visit} from 'unist-util-visit'

/**
 * Minify enumerated attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyEnumeratedAttribute() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      /** @type {string} */
      let property

      for (property in node.properties) {
        if (Object.hasOwn(node.properties, property)) {
          const attribute = find(html, property).attribute

          if (Object.hasOwn(enumeratedAttributes, attribute)) {
            let value = node.properties[property]

            // Note: we don’t really handle enumerated as lists, so instead
            // we cast them to a string (assuming they are space-separated).
            if (Array.isArray(value)) {
              value = stringify(value)
            }

            if (typeof value === 'string') {
              const definition = enumeratedAttributes[attribute]
              const definitions = Array.isArray(definition)
                ? definition
                : [definition]
              let index = -1

              // eslint-disable-next-line max-depth
              while (++index < definitions.length) {
                const definition = definitions[index]

                // eslint-disable-next-line max-depth
                if (
                  !definition.selector ||
                  matches(definition.selector, node)
                ) {
                  node.properties[property] = minify(value, definition)
                }
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
 *   Value.
 * @param {Definition} info
 *   Info.
 * @returns {string | undefined}
 *   Result.
 */
function minify(value, info) {
  const insensitive = info.caseSensitive ? value : value.toLowerCase()
  const states = info.states
  let index = -1
  let known = false
  /** @type {string | null} */
  let result = null
  /** @type {Array<string> | string | null} */
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
    return
  }

  if (result === info.invalid) {
    // If the invalid state is longer that one character, we explicitly set a
    // short keyword, namely “a” (never used as a keyword so always invalid).
    // Otherwise, we keep the result (it’s often an empty string)
    result = result.length > 1 ? 'a' : result
  }

  return result
}
