/**
 * rehype plugin to remove `type` and `language` attributes on
 * JavaScript scripts.
 *
 * ## What is this?
 *
 * This package is a plugin that removes `type` and/or `language` attributes
 * on JavaScript scripts, as they are unneeded.
 * This plugin does not touch other `<script>` elements (such as JavaScript
 * modules or non-JavaScript scripts).
 *
 * ## When should I use this?
 *
 * You can use this plugin when you want to improve the transfer size of HTML
 * documents.
 *
 * ## API
 *
 * ### `unified().use(rehypeRemoveScriptTypeJavaScript)`
 *
 * Remove `type` and `language` attributes on JavaScript scripts.
 *
 * ###### Returns
 *
 * Transform ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).
 *
 * @example
 *   {}
 *   <script type="text/javascript"></script>
 *   <script language="javascript1.5"></script>
 *   <script type="module"></script>
 */

export {default} from './lib/index.js'
