/**
 * rehype plugin to minify CSS `<style>` elements.
 *
 * ## What is this?
 *
 * This package is a plugin that minifies the CSS inside `<style>` elements.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeMinifyCssStyle)`
 *
 * Minify CSS `<style>` elements.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <style>
 *     * { color: #ff0000 }
 *   </style>
 */

export {default} from './lib/index.js'
