/**
 * rehype plugin to minify language attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the contents of language tags:
 * [BCP 47 tags](https://github.com/wooorm/bcp-47).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyLanguage)`
 *
 * Minify language attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <span lang="en-US">Color</span>
 *   <a href="https://nl.wikipedia.org/wiki/HyperText_Markup_Language" hreflang="nld-NL">HTML</a>
 *   <span xml:lang="pt-BR">ótimo</span>
 *   <track src="colour.vtt" srclang="en-GB" label="English (UK)">
 */

export {default} from './lib/index.js'
