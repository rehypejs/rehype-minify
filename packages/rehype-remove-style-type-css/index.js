/**
 * rehype plugin to remove `type` attributes on CSS `<style>`s and `<link>`s.
 *
 * ## What is this?
 *
 * This package is a plugin that removes `type` attributes on CSS `<style>`s
 * and `<link>`s, as they are unneeded.
 * This plugin does not touch other `<style>`s and `<link>`s (such as non-CSS
 * styles).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveStyleTypeCss)`
 *
 * Remove `type` attributes on CSS `<style>`s and `<link>`s.
 * There are no options.
 *
 * @example
 *   <link rel="stylesheet alternate" type="text/css" href="index.css">
 *   <style type="text/css"></style>
 */

/**
 * @typedef {import('hast').Root} Root
 */

import {visit} from 'unist-util-visit'
import {isCssLink} from 'hast-util-is-css-link'
import {isCssStyle} from 'hast-util-is-css-style'

/**
 * Remove `type` attributes on CSS `<style>`s and `<link>`s.
 *
 * @type {import('unified').Plugin<Array<void>, Root>}
 */
export default function rehypeRemoveStyleTypeCss() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (
        node.properties &&
        'type' in node.properties &&
        (isCssLink(node) || isCssStyle(node))
      ) {
        node.properties.type = null
      }
    })
  }
}
