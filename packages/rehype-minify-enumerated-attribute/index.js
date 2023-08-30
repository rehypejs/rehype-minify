/**
 * rehype plugin to minify enumerated attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can remove certain attributes entirely or
 * replace their values with shorter equivalents.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyEnumeratedAttribute)`
 *
 * Minify enumerated attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <meta charset="utf-8">
 *   <video preload="auto">
 *     <track kind="subtitles" src="abc.xyz">
 *   </video>
 */

export {default} from './lib/index.js'
