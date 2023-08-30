/**
 * rehype plugin to minify JSON `<script>`s.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the contents of JSON `<script>`s:
 * `<script>` elements with (currently) a type of `application/ld+json`.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyJsonScript)`
 *
 * Minify JSON `<script>`s.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <script type="application/ld+json">
 *   {
 *     "@context": {
 *       "name": "http://xmlns.com/foaf/0.1/name",
 *       "@id": "http://me.example.com",
 *       "@type": "Person",
 *       "name": "John Smith",
 *       "homepage": "http://www.example.com/"
 *     }
 *   }
 *   </script>
 */

export {default} from './lib/index.js'
