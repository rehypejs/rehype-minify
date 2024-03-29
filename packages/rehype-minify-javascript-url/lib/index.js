/**
 * @typedef {import('hast').Root} Root
 */

import {isElement} from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'
import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'

/* eslint-disable no-script-url */
const protocol = 'javascript:'
/* eslint-enable no-script-url */

const prefix = 'function a(){'
const suffix = '}a();'

/**
 * Minify `javascript:` URLs.
 *
 * @returns
 *   Transform.
 */
export default function rehypeMinifyJavaScriptUrl() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node) {
      /** @type {string} */
      let prop

      for (prop in node.properties) {
        if (
          node.properties[prop] &&
          Object.hasOwn(urlAttributes, prop) &&
          isElement(node, urlAttributes[prop])
        ) {
          const value = node.properties[prop]
          let result = value

          if (
            typeof result === 'string' &&
            result.slice(0, protocol.length).toLowerCase() === protocol
          ) {
            result = result.slice(protocol.length)

            try {
              const output = Uglify.minify(prefix + result + suffix)
              result = output.code.slice(prefix.length, -suffix.length)
            } catch {}

            result = protocol + result.trim()
          }

          node.properties[prop] = result
        }
      }
    })
  }
}
