/**
 * @fileoverview
 *   Remove `meta[http-equiv=content-language]` and
 *   `meta[http-equiv=content-type]` elements for shorter output.
 *
 *   Note: The missing whitespace in the output is due to
 *   [inikulin/parse5#150](https://github.com/inikulin/parse5/issues/150).
 * @example {"processor": {"fragment": false}}
 *
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

import {visit} from 'unist-util-visit'
import {stringify} from 'space-separated-tokens'
import {hasProperty} from 'hast-util-has-property'
import {isElement} from 'hast-util-is-element'

export default function rehypeRemoveMetaHttpEquiv() {
  return transform
}

function transform(tree) {
  let html
  let head
  let charSet
  let contentType
  let contentLanguage
  let contentTypeParent
  let contentLanguageParent

  visit(tree, 'element', visitor)

  // `meta` has precedence over `html[lang]`:
  // <https://html.spec.whatwg.org/#the-lang-and-xml:lang-attributes:pragma-set-default-language>
  if (html && contentLanguage) {
    html.properties.lang = contentLanguage.properties.content
    remove(contentLanguageParent, contentLanguage)
  }

  // `meta` has precedence over `meta[charset]`.
  if (contentType) {
    const value = contentType.properties.content.replace(/^.+charset=/i, '')

    if (charSet) {
      charSet.properties.charSet = value
      remove(contentTypeParent, contentType)
    } else if (head) {
      head.children.unshift({
        type: 'element',
        tagName: 'meta',
        properties: {charSet: value},
        children: []
      })

      remove(contentTypeParent, contentType)
    }
  }

  function visitor(node, index, parent) {
    // Stop walking as we only need the `head`.
    if (isElement(node, 'body')) {
      return false
    }

    if (isElement(node, 'html')) {
      html = node
    } else if (isElement(node, 'head')) {
      head = node
    } else if (isElement(node, 'meta')) {
      if (hasProperty(node, 'charSet')) {
        charSet = node
      } else if (hasProperty(node, 'httpEquiv')) {
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
  }

  function remove(parent, child) {
    const siblings = parent.children
    siblings.splice(siblings.indexOf(child), 1)
  }
}
