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
 * ###### Parameters
 *
 * *   `options` (`Options`, optional)
 *     — configuration
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * * `removeConditional` (`boolean`, default: `false`)
 *   — remove conditional comments (default: `false`); the default is to
 *   leave them
 * * `test` (`Test`, optional)
 *   — choose which comments to keep (optional)
 *
 * ### `Test`
 *
 * Test a comment (TypeScript type).
 *
 * ###### Parameters
 *
 * * `value` (`string`)
 *   — comment value
 *
 * ###### Returns
 *
 * Whether to keep the comment (`boolean`, optional).
 *
 * @example
 *   {}
 *   <!--Hello-->
 *   <!--[if IE 6]>OK<![endif]-->
 */

/**
 * @typedef {import('./lib/index.js').Options} Options
 * @typedef {import('./lib/index.js').Test} Test
 */

export {default} from './lib/index.js'
