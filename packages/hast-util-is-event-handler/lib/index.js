/**
 * Check if a property is an event handler.
 *
 * @param {string} name
 *   Property name to check.
 * @returns {boolean}
 *   Whether `name` is an event handler.
 */
export function isEventHandler(name) {
  return Boolean(
    name &&
      name.slice &&
      name.slice(0, 2).toLowerCase() === 'on' &&
      name.length >= 5
  )
}
