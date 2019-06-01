/**
 * @fileoverview
 *   Check if a property is an event handler.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   var ok = require('hast-util-is-event-handler')
 *
 *   ok('oncut') //=> true
 *   ok('onpushsubscriptionchange') //=> true
 *   ok('ones') //=> false
 *   ok('class') //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isEventHandler(prop)`
 *
 *   Check if `prop` is a `string` starting with `'on'` and its `length` is 5 or
 *   more.
 */

'use strict'

module.exports = ev

function ev(name) {
  return (
    name &&
    name.slice &&
    name.slice(0, 2).toLowerCase() === 'on' &&
    name.length >= 5
  )
}
