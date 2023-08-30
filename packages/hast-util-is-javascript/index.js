/**
 * hast utility to check if an element is a JavaScript script.
 *
 * ## What is this?
 *
 * This package is a utility to check whether a hast node is a `<script>` that
 * contains or references JavaScript.
 *
 * ## When should I use this?
 *
 * You can use this package to check whether `<script>` elements contain or
 * reference JavaScript or something else.
 *
 * ## Use
 *
 * ```js
 * import {h} from 'hastscript'
 * import {isJavaScript} from 'hast-util-is-javascript'
 *
 * isJavaScript(h('script')) //=> true
 * isJavaScript(h('script', {type: 'text/ecmascript'})) //=> true
 * isJavaScript(h('script', {language: 'ecmascript'})) //=> true
 * isJavaScript(h('script', {type: 'text/fooscript'})) //=> false
 * isJavaScript(h('script', {language: 'fooscript'})) //=> false
 * ```
 *
 * ## API
 *
 * ### `isJavaScript(node)`
 *
 * Check if a node is a `<script>` that contains or references JavaScript.
 *
 * Returns `true` if `node` is a `<script>` element that has a valid JavaScript
 * `type`, has no `type` and a valid JavaScript `language`, or has neither.
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — node to check
 *
 * ###### Returns
 *
 * Whether a node is a `<script>` that contains or references JavaScript
 * (`boolean`).
 */

export {isJavaScript} from './lib/index.js'
