/**
 * rehype plugin to concatenate `<script>`s together.
 *
 * ## What is this?
 *
 * This package is a plugin that can improve performance by merging multiple
 * JS `<script>` elements together.
 * This plugin can be dangerous if JavaScript is invalid or values are expected
 * to be `undefined` in one script but not in another.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you are certain that your JavaScript is
 * and you want to improve the size of HTML.
 *
 * ## API
 *
 * ### `unified().use(rehypeConcatJavaScript)`
 *
 * Concatenate `<script>` elements together.
 * There are no options.
 *
 * @example
 *   <script>function foo() {}</script>
 *   <script>function bar() {}</script>
 */

export {default} from './lib/index.js'
