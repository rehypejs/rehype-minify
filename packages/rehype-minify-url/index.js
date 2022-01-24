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
 *
 * @typedef {import('hast').Root} Root
 * @typedef {import('relateurl')} RelateUrl
 * @typedef {import('relateurl').Options} RelateOptions
 * @typedef MinifyOptions
 * @property {string} from
 *   Base URL of page.
 * @typedef {RelateOptions & MinifyOptions} Options
 */

import Relate from 'relateurl'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'
import {urlAttributes} from 'html-url-attributes'

const own = {}.hasOwnProperty

/**
 * Minify URLs.
 * Uses [`relateurl`](https://www.npmjs.com/package/relateurl).
 * `from` in options is required (which must be an absolute url to where the
 * file is hosted.
 * All other [options](https://www.npmjs.com/package/relateurl#options) are
 * passed through.
 *
 * @type {import('unified').Plugin<[Options?]|Array<void>, Root>}
 */
export default function rehypeMinifyUrl(options) {
  const {from, ...rest} = options || {}

  return (tree, file) => {
    const meta = /** @type {Record<string, unknown>} */ (file.data.meta || {})

    /** @type {string|undefined} */
    const href =
      from ||
      (meta.origin && meta.pathname
        ? // @ts-expect-error: `URL` exists.
          new URL(meta.pathname, meta.origin).href
        : undefined)

    // @ts-expect-error: checked next.
    const relate = new Relate(href, rest)

    try {
      relate.relate('/')
    } catch {
      throw new Error('Missing absolute `from` in options')
    }

    visit(tree, 'element', (node) => {
      const props = node.properties || {}
      /** @type {string} */
      let prop

      for (prop in props) {
        if (
          hasProperty(node, prop) &&
          own.call(urlAttributes, prop) &&
          isElement(node, urlAttributes[prop]) &&
          !(
            node.tagName === 'link' &&
            prop === 'href' &&
            Array.isArray(props.rel) &&
            props.rel.includes('canonical')
          )
        ) {
          props[prop] = minify(props[prop], relate)
        }
      }
    })
  }
}

/**
 * @param {null|undefined|string|number|boolean|Array<string|number>} value
 * @param {RelateUrl} relate
 */
function minify(value, relate) {
  return Array.isArray(value) ? all(value, relate) : one(value, relate)
}

/**
 * @param {Array<string|number>} value
 * @param {RelateUrl} relate
 * @returns {Array<string|number>}
 */
function all(value, relate) {
  let index = -1
  /** @type {Array<string|number>} */
  const result = []

  while (++index < value.length) {
    result[index] = one(value[index], relate)
  }

  return result
}

/**
 * @template {null|undefined|string|number|boolean} Thing
 * @param {Thing} value
 * @param {RelateUrl} relate
 * @returns {Thing}
 */
function one(value, relate) {
  try {
    // @ts-expect-error: let `relate` handle non-strings.
    return relate.relate(value)
    // Coverage bug on Erbium.
    /* c8 ignore next */
  } catch {}

  return value
}
