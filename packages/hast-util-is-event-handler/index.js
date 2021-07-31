/**
 * @fileoverview
 *   Check if a property is an event handler.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {isEventHandler} from 'hast-util-is-event-handler'
 *
 *   isEventHandler('oncut') //=> true
 *   isEventHandler('onpushsubscriptionchange') //=> true
 *   isEventHandler('ones') //=> false
 *   isEventHandler('class') //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isEventHandler(prop)`
 *
 *   Check if `prop` is a `string` starting with `'on'` and its `length` is 5 or
 *   more.
 */

export function isEventHandler(name) {
  return (
    name &&
    name.slice &&
    name.slice(0, 2).toLowerCase() === 'on' &&
    name.length >= 5
  )
}
