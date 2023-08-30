/**
 * rehype plugin to move JavaScript `<script>`s to the end of the body.
 *
 * ## What is this?
 *
 * This package is a plugin that can improve performance by *decreasing* the
 * time to
 * [first render](https://developer.yahoo.com/performance/rules.html#js_bottom).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the speed of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeJavaScriptToBottom[, options])`
 *
 * Move JavaScript `<script>`s to the end of `<body>`.
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
 * ### `Filter`
 *
 * Filter scripts that would be moved (TypeScript type).
 *
 * ###### Parameters
 *
 * *   `node` (`Element`)
 *     — script element
 *
 * ###### Returns
 *
 * Whether to move the script (`true`) or not (`boolean`, optional).
 *
 * ### `Options`
 *
 * Configuration (TypeScript type).
 *
 * ###### Fields
 *
 * *   `filter` (`Filter`, optional)
 *     — filter scripts that would otherwise be moved
 *
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html><html><head><script src="index.js"></script></head><body></body></html>
 */

/**
 * @typedef {import('./lib/index.js').Filter} Filter
 * @typedef {import('./lib/index.js').Options} Options
 */

export {default} from './lib/index.js'
