/**
 * rehype plugin to prevent a network request to the favicon when there
 * is none.
 *
 * ## What is this?
 *
 * This package is a plugin that inserts an empty favicon image, when there is
 * none referenced, to prevent a network request.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you don’t have a `favicon.ico` at the root of
 * your server, and want to prevent browsers sending out a network request to
 * find it.
 *
 * This plugin increases the size of the HTML, but prevents a round trip to
 * the server by inserting an empty favicon.
 *
 * ## API
 *
 * ### `unified().use(rehypePreventFaviconRequest)`
 *
 * Prevent a network request to the favicon when there is none.
 * There are no options.
 *
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html><html><head></head><body></body></html>
 */

export {default} from './lib/index.js'
