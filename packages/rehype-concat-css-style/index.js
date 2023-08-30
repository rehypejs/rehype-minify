/**
 * rehype plugin to concatenate `<style>`s together.
 *
 * ## What is this?
 *
 * This package is a plugin that can improve performance by merging multiple
 * CSS `<style>` elements together.
 * This plugin can be dangerous if CSS is invalid.
 * Additionally, this plugin does not handle `scoped` styles.
 * Those are [deprecated](https://github.com/whatwg/html/issues/552) anyway.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you are certain that your CSS is valid and you
 * want to improve the size of HTML.
 *
 * ## API
 *
 * ### `unified().use(rehypeConcatCssStyle)`
 *
 * Concatenate `<style>` elements together.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <style>b{color:red}</style>
 *   <style>i{color:blue}</style>
 */

export {default} from './lib/index.js'
