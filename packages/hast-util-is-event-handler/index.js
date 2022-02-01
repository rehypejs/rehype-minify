/**
 * hast utility to check if an attribute name is an event handler.
 *
 * ## What is this?
 *
 * This package is a utility to check if an attribute name or DOM property is an
 * event handler.
 * It does not check whether the supposed event handler is valid or known
 * (`onmadeupevent` will also yield `true`).
 *
 * ## When should I use this?
 *
 * You can use this package to check whether an attribute value likely contains
 * JavaScript or something else.
 *
 * ## Use
 *
 * ```js
 * import {isEventHandler} from 'hast-util-is-event-handler'
 *
 * isEventHandler('oncut') //=> true
 * isEventHandler('onpushsubscriptionchange') //=> true
 * isEventHandler('ones') //=> false
 * isEventHandler('class') //=> false
 * ```
 *
 * ## API
 *
 * ### `isEventHandler(prop)`
 *
 * Check if an attribute name or DOM property is an event handler.
 *
 * Returns `true` when starting with `'on'` and its `length` is `5` or more.
 *
 * ###### Parameters
 *
 * *   `prop` (`string`) — attribute name
 *
 * ###### Returns
 *
 * Whether `prop` is an event handler (`boolean`).
 */

/**
 * Check if a property is an event handler.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isEventHandler(name) {
  return Boolean(
    name &&
      name.slice &&
      name.slice(0, 2).toLowerCase() === 'on' &&
      name.length >= 5
  )
}
