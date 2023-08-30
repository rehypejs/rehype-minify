/**
 * rehype plugin to minify the doctype.
 *
 * ## What is this?
 *
 * This package is a plugin that turns the doctype, when found, into an HTML 5
 * doctype (`<!doctype html>`).
 * This plugin is no longer needed, because hast no longer supports other
 * doctypes.
 *
 * ## When should I use this?
 *
 * You should not use this plugin anymore.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyDoctype)`
 *
 * Minify the doctype.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {"processor": {"fragment": false}}
 *   <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head></head><body></body></html>
 */

export {default} from './lib/index.js'
