/**
 * rehype plugin to move CSS `<link>`s to the head.
 *
 * ## What is this?
 *
 * This package is a plugin that can improve performance by *decreasing* the
 * time to
 * [first render](https://developer.yahoo.com/performance/rules.html#css_top).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the speed of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeCssToTop)`
 *
 * Move CSS `<link>`s to the head.
 * There are no options.
 *
 * @example
 *   {"processor": {"fragment": false}}
 *
 *   <!doctype html><html><head></head><body><link rel="stylesheet" href="index.css"></body></html>
 */

export {default} from './lib/index.js'
