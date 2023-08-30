/**
 * rehype plugin to minify `javascript:` URLs.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify `javascript:` URL attributes.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyJavaScriptUrl)`
 *
 * Minify `javascript:` URLs.
 * There are no options.
 *
 * @example
 *   <img src="javascript:alert(true)">
 */

export {default} from './lib/index.js'
