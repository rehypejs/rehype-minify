/**
 * Utility with info on enumerated attributes.
 *
 * ## What is this?
 *
 * This package contains info on enumerated attributes (attributes that have
 * a limited list of acceptable values).
 *
 * ## When should I use this?
 *
 * You can use this package for linting and minification purposes.
 *
 * ## Use
 *
 * ```js
 * import {enumeratedAttributes} from 'html-enumerated-attributes'
 *
 * console.log(enumeratedAttributes.loading)
 * //=> {selector: 'iframe, img', invalid: 'eager', missing: 'eager', states: ['eager', 'lazy']}
 * ```
 *
 * ## API
 *
 * ### `enumeratedAttributes`
 *
 * Enumerated HTML attributes (`Record<string, Array<Definition> | Definition>`).
 *
 * ### `Definition`
 *
 * Info (TypeScript type).
 *
 * ###### Fields
 *
 * *   `allowUnknown` (`boolean`, default: `false`)
 *     — whether arbitrary values are allowed
 * *   `caseSensitive` (`boolean`, default: `false`)
 *     — enumerated values are often treated case-insensitive, except when
 *     this field is on
 * *   `invalid` (`string`, `null`, optional)
 *     — invalid value default; `null` means a particular unnamed state
 * *   `missing` (`string`, `null`, optional)
 *     — missing value default; `null` means a particular unnamed state
 * *   `selector` (`string`, optional, example: `'meta, script'`)
 *     — simple CSS selector; can contain commas; missing means it applies to
 *     all elements
 * *   `states` (`Array<Array<string> | string | null>`)
 *     — possible states
 */

/**
 * @typedef {import('./lib/index.js').Definition} Definition
 */

export {enumeratedAttributes} from './lib/index.js'
