/**
 * hast utility to check if an element is a CSS `<style>` element.
 *
 * ## What is this?
 *
 * This package is a utility to check whether a hast node is a `<style>` that
 * contains CSS.
 *
 * ## When should I use this?
 *
 * You can use this package to check whether `<style>` elements contain CSS or
 * something else.
 *
 * ## Use
 *
 * ```js
 * import {h} from 'hastscript'
 * import {isCssStyle} from 'hast-util-is-css-style'
 *
 * isCssStyle(h('style')) //=> true
 * isCssStyle(h('style', {type: ' TEXT/CSS '})) //=> true
 * isCssStyle(h('style', {type: 'text/foo'})) //=> false
 * ```
 *
 * ## API
 *
 * ### `isCssStyle(node)`
 *
 * Check whether a hast node is a `<style>` that contains CSS.
 *
 * Returns `true` if `node` is a `<style>` element that has no `type`, an empty
 * `type`, or `'text/css'` as its `type`.
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — node to check
 *
 * ###### Returns
 *
 * Whether `node` is a CSS style element (`boolean`).
 */

export {isCssStyle} from './lib/index.js'
