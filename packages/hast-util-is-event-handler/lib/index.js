/**
 * Check if a property is an event handler.
 *
 * Returns `true` when starting with `'on'` and its `length` is `5` or more.
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
