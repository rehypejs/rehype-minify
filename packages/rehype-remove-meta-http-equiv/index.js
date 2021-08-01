/**
 * @fileoverview
 *   Remove `meta[http-equiv=content-language]` and
 *   `meta[http-equiv=content-type]` elements for shorter output.
 *
 *   Note: The missing whitespace in the output is due to
 *   [inikulin/parse5#150](https://github.com/inikulin/parse5/issues/150).
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html>
 *   <html lang="en-GB">
 *     <head>
 *       <meta charset="utf8">
 *       <meta http-equiv="content-type" content="text/html; charset=chinese">
 *       <meta http-equiv="content-language" content="en-US">
 *     </head>
 *     <body></body>
 *   </html>
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Parent} Parent
 */

import {visit} from 'unist-util-visit'
import {stringify} from 'space-separated-tokens'
import {hasProperty} from 'hast-util-has-property'

/**
 * Remove `meta[http-equiv=content-language]` and
 * `meta[http-equiv=content-type]` elements for shorter output.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeRemoveMetaHttpEquiv() {
  return (tree) => {
    /** @type {Element|undefined} */
    let html
    /** @type {Element|undefined} */
    let head
    /** @type {Element|undefined} */
    let charSet
    /** @type {Element|undefined} */
    let contentType
    /** @type {Element|undefined} */
    let contentLanguage
    /** @type {Parent|null|undefined} */
    let contentTypeParent
    /** @type {Parent|null|undefined} */
    let contentLanguageParent

    visit(tree, 'element', (node, _, parent) => {
      // Stop walking as we only need the `head`.
      if (node.tagName === 'body') {
        return false
      }

      if (node.tagName === 'html') {
        html = node
      } else if (node.tagName === 'head') {
        head = node
      } else if (node.tagName === 'meta' && node.properties) {
        if (hasProperty(node, 'charSet')) {
          charSet = node
        } else if (
          hasProperty(node, 'httpEquiv') &&
          Array.isArray(node.properties.httpEquiv)
        ) {
          const value = stringify(node.properties.httpEquiv).toLowerCase()

          if (value === 'content-language') {
            contentLanguage = node
            // @ts-expect-error: fine parent.
            contentLanguageParent = parent
          } else if (value === 'content-type') {
            contentType = node
            // @ts-expect-error: fine parent.
            contentTypeParent = parent
          }
        }
      }
    })

    // `meta` has precedence over `html[lang]`:
    // <https://html.spec.whatwg.org/#the-lang-and-xml:lang-attributes:pragma-set-default-language>
    if (
      html &&
      html.properties &&
      contentLanguage &&
      contentLanguage.properties &&
      contentLanguageParent
    ) {
      html.properties.lang = contentLanguage.properties.content
      contentLanguageParent.children.splice(
        contentLanguageParent.children.indexOf(contentLanguage),
        1
      )
    }

    // `meta` has precedence over `meta[charset]`.
    if (contentTypeParent && contentType && contentType.properties) {
      const value = String(contentType.properties.content).replace(
        /^.+charset=/i,
        ''
      )

      if (charSet && charSet.properties) {
        charSet.properties.charSet = value
        contentTypeParent.children.splice(
          contentTypeParent.children.indexOf(contentType),
          1
        )
      } else if (head) {
        head.children.unshift({
          type: 'element',
          tagName: 'meta',
          properties: {charSet: value},
          children: []
        })

        contentTypeParent.children.splice(
          contentTypeParent.children.indexOf(contentType),
          1
        )
      }
    }
  }
}
