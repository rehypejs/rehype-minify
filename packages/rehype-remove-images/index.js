/**
 * rehype plugin to remove images.
 *
 * ## What is this?
 *
 * This package is a plugin that removes images.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveImages[, options])`
 *
 * Remove comments.
 *
 * @example
 *   <img src="/something.png" />
 */

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('unist').Node} Node
 * @typedef {Root|Root['children'][number]} HastNode
 */

import { remove } from "unist-util-remove"
import { isElement } from "hast-util-is-element"

/**
 * Remove images from HTML
 *
 * @type {import('unified').Plugin<[Options?] | Array<void>, Root>}
 */
export default function rehypeRemoveImages() {
  return (tree) =>
    remove(tree, { cascade: true }, (node) => {
      // note that `type` is not the same as `tagName`!
      return isElement(node, "img")
    }) || undefined
}
