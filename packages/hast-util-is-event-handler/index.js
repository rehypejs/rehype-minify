/**
 * @fileoverview
 *   Check if a property is an event handler
 */

'use strict';

module.exports = ev;

function ev(name) {
  return name && name.slice && name.slice(0, 2).toLowerCase() === 'on' && name.length >= 5;
}
