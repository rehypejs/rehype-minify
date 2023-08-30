/**
 * rehype plugin to minify URLs.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify URL values of certain attributes
 * using [`relateurl`](https://github.com/stevenvachon/relateurl).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyUrl[, options])`
 *
 * Minify URLs.
 *
 * ##### `options`
 *
 * Configuration (required).
 *
 * All options except for what’s listed here are passed through to
 * [`relateurl`](https://github.com/stevenvachon/relateurl).
 *
 * ##### `options.from`
 *
 * Absolute URL to where the document will be hosted (`string`).
 * Can also be set with an `origin` and `pathname` in `file.data.meta`
 * (as supported by [`rehype-meta`](https://github.com/rehypejs/rehype-meta)).
 *
 * @example
 *   {"plugin": {"from": "https://example.com"}}
 *   <a href="/foo/../bar.html"></a>
 */

/**
 * @typedef {import('./lib/index.js').Options} Options
 */

export {default} from './lib/index.js'
