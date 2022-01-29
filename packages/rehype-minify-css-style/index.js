/**
 * rehype plugin to minify CSS `<style>` elements.
 *
 * ## What is this?
 *
 * This package is a plugin that minifies the CSS inside `<style>` elements.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyCssStyle)`
 *
 * Minify CSS `<style>` elements.
 * There are no options.
 *
 * @example
 *   <style>
 *     * { color: #ff0000 }
 *   </style>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import CleanCSS from 'clean-css'
import {visit} from 'unist-util-visit'
import {fromString} from 'hast-util-from-string'
import {toString} from 'hast-util-to-string'
import {isCssStyle} from 'hast-util-is-css-style'

const clean = new CleanCSS()

/**
 * Minify CSS `<style>` elements.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeMinifyCssStyle() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (isCssStyle(node)) {
        try {
          const value = toString(node)
          fromString(node, clean.minify(value).styles || value)
          // Potential third party errors?
          /* c8 ignore next */
        } catch {}
      }
    })
  }
}
