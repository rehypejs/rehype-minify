/**
 * @fileoverview
 *   Minify language attributes.
 * @example
 *   <span lang="en-US">Color</span>
 *   <a href="https://nl.wikipedia.org/wiki/HyperText_Markup_Language" hreflang="nld-NL">HTML</a>
 *   <span xml:lang="pt-BR">ótimo</span>
 *   <track src="colour.vtt" srclang="en-GB" label="English (UK)">
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {bcp47Normalize} from 'bcp-47-normalize'
import {visit} from 'unist-util-visit'
import {hasProperty} from 'hast-util-has-property'

const fields = ['hrefLang', 'lang', 'srcLang', 'xmlLang']

/**
 * Minify language attributes.
 *
 * @type {import('unified').Plugin<[], Root>}
 */
export default function rehypeMinifyLanguage() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties
      let index = -1

      while (++index < fields.length) {
        const prop = fields[index]

        if (
          props &&
          hasProperty(node, prop) &&
          typeof props[prop] === 'string'
        ) {
          // BCP 47 tags are case-insensitive, but in this project we prefer
          // lowercase which *should* help GZIP.
          props[prop] = String(
            bcp47Normalize(String(props[prop])) || props[prop]
          ).toLowerCase()
        }
      }
    })
  }
}
