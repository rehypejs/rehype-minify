/**
 * rehype plugin to remove `meta[http-equiv=content-language]` and
 * `meta[http-equiv=content-type]`.
 *
 * ## What is this?
 *
 * This package is a plugin that removes `<meta>` elements with `http-equiv`
 * attributes.
 * These `<meta>` elements can set the character encoding and natural language
 * of the document, but there are shorter ways to do that.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveMetaHttpEquiv)`
 *
 * Remove `meta[http-equiv=content-language]` and
 * `meta[http-equiv=content-type]`.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {"processor": {"fragment": false}, "format": true}
 *   <!doctype html>
 *   <html lang="en-GB">
 *     <head>
 *       <meta charset="utf8">
 *       <meta http-equiv="content-type" content="text/html; charset=chinese">
 *       <meta http-equiv="content-language" content="en-US">
 *     </head>
 *     <body></body>
 *   </html>
 */

export {default} from './lib/index.js'
