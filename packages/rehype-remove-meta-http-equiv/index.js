/**
 * rehype plugin to remove `meta[http-equiv=content-language]` and
 * `meta[http-equiv=content-type]`.
 *
 * ## What is this?
 *
 * This package is a plugin that removes `<meta>` elements with `http-equiv`
 * attributes.
 * These `<meta>` elements can set the character encoding and natural language
 * of the document, but there are shorter ways to do that.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveMetaHttpEquiv)`
 *
 * Remove `meta[http-equiv=content-language]` and
 * `meta[http-equiv=content-type]`.
 * There are no options.
 *
 * @example
 *   {"processor": {"fragment": false}, "format": true}
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
 * @type {import('unified').Plugin<Array<void>, Root>}
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
            contentLanguageParent = parent
          } else if (value === 'content-type') {
            contentType = node
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
