/**
 * rehype plugin to remove the contents of external JavaScript `<script>`s.
 *
 * ## What is this?
 *
 * This package is a plugin that removes the contents of JavaScript `<script>`s
 * that also have an `src` attribute.
 * Scripts are supposed to be either external (with `src`) or internal (with
 * code in them), and both is nonsensical.
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveExternalScriptContent)`
 *
 * Remove the contents of external JavaScript `<script>`s.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <script src="index.js">console.log(1);</script>
 */

export {default} from './lib/index.js'
