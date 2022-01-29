/**
 * Utility with info on whitespace sensitive elements.
 *
 * ## What is this?
 *
 * This package contains info on which HTML elements are whitespace sensitive.
 *
 * ## When should I use this?
 *
 * This is only really needed when minifying HTML.
 *
 * ## Use
 *
 * ```js
 * import {whitespaceSensitiveTagNames} from 'html-whitespace-sensitive-tag-names'
 *
 * whitespaceSensitiveTagNames
 * //=> ['pre', 'script', 'style', 'textarea']
 * ```
 *
 * ## API
 *
 * ### `whitespaceSensitiveTagNames`
 *
 * List of whitespace sensitive HTML tag names (`Array<string>`).
 */

export const whitespaceSensitiveTagNames = [
  'pre',
  'script',
  'style',
  'textarea'
]
