/**
 * @import {Element, Parents, Root} from 'hast'
 */

import {visit} from 'unist-util-visit'
import {stringify} from 'space-separated-tokens'

/**
 * Remove `meta[http-equiv=content-language]` and
 * `meta[http-equiv=content-type]`.
 *
 * @returns
 *   Transform.
 */
export default function rehypeRemoveMetaHttpEquiv() {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    /** @type {Element | undefined} */
    let html
    /** @type {Element | undefined} */
    let head
    /** @type {Element | undefined} */
    let charSet
    /** @type {Element | undefined} */
    let contentType
    /** @type {Element | undefined} */
    let contentLanguage
    /** @type {Parents | undefined} */
    let contentTypeParent
    /** @type {Parents | undefined} */
    let contentLanguageParent

    visit(tree, 'element', function (node, _, parent) {
      // Stop walking as we only need the `head`.
      if (node.tagName === 'body') {
        return false
      }

      switch (node.tagName) {
        case 'html': {
          html = node
          break
        }

        case 'head': {
          head = node
          break
        }

        case 'meta': {
          if (node.properties.charSet) {
            charSet = node
          } else if (
            node.properties.httpEquiv &&
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

          break
        }
        // No default
      }
    })

    // `meta` has precedence over `html[lang]`:
    // <https://html.spec.whatwg.org/#the-lang-and-xml:lang-attributes:pragma-set-default-language>
    if (html && contentLanguage && contentLanguageParent) {
      html.properties.lang = contentLanguage.properties.content
      contentLanguageParent.children.splice(
        contentLanguageParent.children.indexOf(contentLanguage),
        1
      )
    }

    // `meta` has precedence over `meta[charset]`.
    if (contentTypeParent && contentType) {
      const value = String(contentType.properties.content).replace(
        /^.+charset=/i,
        ''
      )

      if (charSet) {
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
