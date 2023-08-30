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
 * Map of URL properties in HTML (`Record<string, Array<string> | null>`).
 *
 * `null` means the property name applies to all elements.
 */

export {urlAttributes} from './lib/index.js'
