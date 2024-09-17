/**
 * @import {Properties, Root} from 'hast'
 */

/**
 * @typedef {Properties[keyof Properties]} PropertyValue
 */

import {isEventHandler} from 'hast-util-is-event-handler'
import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'

const prefix = 'function a(){'
const suffix = '}a();'

/**
 * Minify event handler attributes.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyEventHandler() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      /** @type {string} */
      let name

      for (name in node.properties) {
        if (Object.hasOwn(node.properties, name) && isEventHandler(name)) {
          node.properties[name] = minify(node.properties[name])
        }
      }
    })
  }
}

/**
 * @param {PropertyValue} value
 * @returns {PropertyValue}
 */
function minify(value) {
  let result = value

  if (typeof result !== 'string') {
    return result
  }

  try {
    const output = Uglify.minify(prefix + result + suffix)
    result = output.code.slice(prefix.length, -suffix.length)
  } catch {}

  return result.trim()
}
