/**
 * Utility with info on URL attributes.
 *
 * ## What is this?
 *
 * This package contains info on attributes that have URLs as values.
 *
 * ## When should I use this?
 *
 * You can use this package any time you’re rewriting URLs.
 *
 * ## Use
 *
 * ```js
 * import {urlAttributes} from 'html-url-attributes'
 *
 * console.log(urlAttributes.formAction)
 * //=> ['button', 'input']
 * console.log(urlAttributes.href)
 * //=> ['a', 'area', 'base', 'link']
 * ```
 *
 * ## API
 *
 * ### `urlAttributes`
 *
 * Map of URL attributes in HTML (`Record<string, Array<string>>`).
 */

/**
 * @type {Record<string, Array<string>|null>}
 */
export const urlAttributes = {
  action: ['form'],
  cite: ['blockquote', 'del', 'ins', 'q'],
  data: ['object'],
  formAction: ['button', 'input'],
  href: ['a', 'area', 'base', 'link'],
  icon: ['menuitem'],
  itemId: null,
  manifest: ['html'],
  ping: ['a', 'area'],
  poster: ['video'],
  src: [
    'audio',
    'embed',
    'iframe',
    'img',
    'input',
    'script',
    'source',
    'track',
    'video'
  ]
}
