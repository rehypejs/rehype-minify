/**
 * rehype plugin to minify media attributes.
 *
 * ## What is this?
 *
 * This package is a plugin that can minify the contents of media attributes on
 * `<link>`, `<source>`, and `<style>` elements.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyMediaAttribute)`
 *
 * Minify media attributes.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <link rel="stylesheet" media="only screen and (min-width: 320px)" href="index.css">
 *   <link rel="stylesheet" media="all" href="index.css">
 */

export {default} from './lib/index.js'
