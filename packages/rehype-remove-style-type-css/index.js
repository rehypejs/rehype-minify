/**
 * rehype plugin to remove `type` attributes on CSS `<style>`s and `<link>`s.
 *
 * ## What is this?
 *
 * This package is a plugin that removes `type` attributes on CSS `<style>`s
 * and `<link>`s, as they are unneeded.
 * This plugin does not touch other `<style>`s and `<link>`s (such as non-CSS
 * styles).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveStyleTypeCss)`
 *
 * Remove `type` attributes on CSS `<style>`s and `<link>`s.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <link rel="stylesheet alternate" type="text/css" href="index.css">
 *   <style type="text/css"></style>
 */

export {default} from './lib/index.js'
