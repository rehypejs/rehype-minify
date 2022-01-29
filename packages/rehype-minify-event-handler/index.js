/**
 * rehype plugin to minify event handlers.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the JavaScript used as the values of
 * event handler attributes.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyEventHandler)`
 *
 * Minify whitespace in attributes.
 * There are no options.
 *
 * @example
 *   <h1 onclick="javascript:alert(false)">Hello</h1>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isEventHandler} from 'hast-util-is-event-handler'

const prefix = 'function a(){'
const suffix = '}a();'

/**
 * Minify event handler attributes.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeMinifyEventHandler() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let name

      for (name in props) {
        if (hasProperty(node, name) && isEventHandler(name)) {
          props[name] = minify(props[name])
        }
      }
    })
  }
}

/**
 * @param {null|undefined|string|number|boolean|Array<string|number>} value
 * @returns {null|undefined|string|number|boolean|Array<string|number>}
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
