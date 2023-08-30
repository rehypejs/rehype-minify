/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('relateurl')} RelateUrl
 * @typedef {import('relateurl').Options} RelateOptions
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef ExtraFields
 *   Extra fields.
 * @property {string | null | undefined} [from]
 *   Base URL of page (optional).
 *
 * @typedef {Extract<PropertyValue, Array<any>>} Objects
 * @typedef {Exclude<PropertyValue, Array<any>>} Primitives
 *
 * @typedef {RelateOptions & ExtraFields} Options
 *
 * @typedef {Properties[keyof Properties]} PropertyValue
 */

import {urlAttributes} from 'html-url-attributes'
import {isElement} from 'hast-util-is-element'
import Relate from 'relateurl'
import {visit} from 'unist-util-visit'

/** @type {Options} */
const emptyOptions = {}

/**
 * Minify URLs.
 *
 * Uses [`relateurl`](https://www.npmjs.com/package/relateurl).
 * `from` in options is required (which must be an absolute url to where the
 * file is hosted.
 * All other [options](https://www.npmjs.com/package/relateurl#options) are
 * passed through.
 *
 * You cal define `options.from` by setting it on `vfile.data.meta`, as
 * `origin` and `pathname`.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeMinifyUrl(options) {
  const {from, ...rest} = options || emptyOptions

  /**
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    const meta = /** @type {Record<string, unknown> | undefined} */ (
      file.data.meta
    )

    const href =
      from ||
      (meta &&
      typeof meta.origin === 'string' &&
      typeof meta.pathname === 'string'
        ? new URL(meta.pathname, meta.origin).href
        : undefined)

    // @ts-expect-error: checked next.
    const relate = new Relate(href, rest)

    try {
      relate.relate('/')
    } catch {
      throw new Error('Missing absolute `from` in options')
    }

    visit(tree, 'element', function (node) {
      /** @type {string} */
      let prop

      for (prop in node.properties) {
        if (
          node.properties[prop] &&
          Object.hasOwn(urlAttributes, prop) &&
          isElement(node, urlAttributes[prop]) &&
          !(
            node.tagName === 'link' &&
            prop === 'href' &&
            Array.isArray(node.properties.rel) &&
            node.properties.rel.includes('canonical')
          )
        ) {
          node.properties[prop] = minify(node.properties[prop], relate)
        }
      }
    })
  }
}

/**
 * @param {PropertyValue} value
 *   Value.
 * @param {RelateUrl} relate
 *   Relate instance.
 * @returns {PropertyValue}
 *   Value.
 */
function minify(value, relate) {
  return Array.isArray(value) ? all(value, relate) : one(value, relate)
}

/**
 * @param {Objects} value
 *   Value.
 * @param {RelateUrl} relate
 *   Relate instance.
 * @returns {Objects}
 *   Value.
 */
function all(value, relate) {
  let index = -1
  /** @type {Objects} */
  const result = []

  while (++index < value.length) {
    // @ts-expect-error: kind in -> kind out.
    result[index] = one(value[index], relate)
  }

  return result
}

/**
 * @param {Primitives} value
 *   Value.
 * @param {RelateUrl} relate
 *   Relate instance.
 * @returns {Primitives}
 *   Value.
 */
function one(value, relate) {
  try {
    // @ts-expect-error: let `relate` handle non-strings.
    return relate.relate(value)
  } catch {}

  return value
}
