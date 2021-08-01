/**
 * @fileoverview
 *   Minify JavaScript URLs.
 * @example
 *   <img src="javascript:alert(true)">
 */

import Uglify from 'uglify-js'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'

/**
 * @typedef {import('hast').Root} Root
 */

const own = {}.hasOwnProperty

/* eslint-disable no-script-url */
const protocol = 'javascript:'
/* eslint-enable no-script-url */

const prefix = 'function a(){'
const suffix = '}a();'

/**
 * Minify JavaScript URLs.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyJavaScriptUrl() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (
          hasProperty(node, prop) &&
          own.call(urlAttributes, prop) &&
          isElement(node, urlAttributes[prop])
        ) {
          const value = props[prop]
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

          props[prop] = result
        }
      }
    })
  }
}
