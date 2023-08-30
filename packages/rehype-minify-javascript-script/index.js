/**
 * rehype plugin to minify JavaScript `<script>`s.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the contents of JavaScript
 * `<script>`s.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyJavaScriptScript)`
 *
 * Minify JavaScript `<script>`s.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <script>
 *     var name = "World";
 *     console.log("Hello, " + name + "!");
 *   </script>
 */

export {default} from './lib/index.js'
