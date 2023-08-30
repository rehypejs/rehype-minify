/**
 * rehype plugin to remove comments.
 *
 * ## What is this?
 *
 * This package is a plugin that removes comments.
 * By default it keeps conditional comments, optionally it removes them too.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveComments[, options])`
 *
 * Remove comments.
 *
 * ##### `options`
 *
 * Configuration (optional).
 *
 * ###### `options.removeConditional`
 *
 * Whether to remove conditional comments too (`boolean`, default: `false`).
 * The default behavior is to keep conditional comments.
 * Conditional comments are a legacy feature that was specific to Internet
 * Explorer.
 * They were no longer used in IE 10.
 *
 * @example
 *   <!--Hello-->
 *   <!--[if IE 6]>OK<![endif]-->
 */

/**
 * @typedef {import('./lib/index.js').Options} Options
 */

export {default} from './lib/index.js'
