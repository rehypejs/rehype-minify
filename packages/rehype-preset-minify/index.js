/**
 * rehype preset to minify HTML.
 *
 * ## What is this?
 *
 * This package is a [unified](https://github.com/unifiedjs/unified)
 * ([rehype](https://github.com/rehypejs/rehype)) preset to minify HTML.
 *
 * ## When should I use this?
 *
 * You can use this preset when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypePresetMinify)`
 *
 * Preset to minify HTML
 * ([`Preset`](https://github.com/unifiedjs/unified#preset)).
 *
 * You can reconfigure plugins in presets by using them afterwards with different
 * options.
 *
 * @example
 *   {"processor": {"fragment": false}}
 *   <!doctype html>
 *   <html lang="en-GB">
 *     <head>
 *       <meta charset="utf-8">
 *       <meta http-equiv="content-language" content="en-US">
 *       <script src="index.js" type="text/javascript" language="javascript">
 *         alert(true);
 *       </script>
 *       <link rel="stylesheet" href="index.css" type="text/css">
 *       <title>Foo  &amp;  bar</title>
 *     </head>
 *     <body>
 *       <h1 class="foo foo">bar  bar</h1>
 *       <p id="alfred" id="alfred">  <strong>foo</strong> <em>bar</em> </p>
 *       <button type="BUTTON" onclick="javascript:return false">Alpha</button>
 *     </body>
 *   </html>
 */

/**
 * @import {Preset} from 'unified'
 */

import rehypeMinifyAttributeWhitespace from 'rehype-minify-attribute-whitespace'
import rehypeMinifyCssStyle from 'rehype-minify-css-style'
import rehypeMinifyEnumeratedAttribute from 'rehype-minify-enumerated-attribute'
import rehypeMinifyEventHandler from 'rehype-minify-event-handler'
import rehypeMinifyJavaScriptScript from 'rehype-minify-javascript-script'
import rehypeMinifyJavaScriptUrl from 'rehype-minify-javascript-url'
import rehypeMinifyJsonScript from 'rehype-minify-json-script'
import rehypeMinifyLanguage from 'rehype-minify-language'
import rehypeMinifyMediaAttribute from 'rehype-minify-media-attribute'
import rehypeMinifyMetaColor from 'rehype-minify-meta-color'
import rehypeMinifyMetaContent from 'rehype-minify-meta-content'
import rehypeMinifyStyleAttribute from 'rehype-minify-style-attribute'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import rehypeNormalizeAttributeValueCase from 'rehype-normalize-attribute-value-case'
import rehypeRemoveComments from 'rehype-remove-comments'
import rehypeRemoveDuplicateAttributeValues from 'rehype-remove-duplicate-attribute-values'
import rehypeRemoveEmptyAttribute from 'rehype-remove-empty-attribute'
import rehypeRemoveExternalScriptContent from 'rehype-remove-external-script-content'
import rehypeRemoveMetaHttpEquiv from 'rehype-remove-meta-http-equiv'
import rehypeRemoveScriptTypeJavaScript from 'rehype-remove-script-type-javascript'
import rehypeRemoveStyleTypeCss from 'rehype-remove-style-type-css'
import rehypeSortAttributeValues from 'rehype-sort-attribute-values'
import rehypeSortAttributes from 'rehype-sort-attributes'

const settings = {
  allowParseErrors: true,
  bogusComments: true,
  characterReferences: {
    omitOptionalSemicolons: true,
    useShortestReferences: true
  },
  closeEmptyElements: true,
  collapseEmptyAttributes: true,
  omitOptionalTags: true,
  preferUnquoted: true,
  quoteSmart: true,
  tightAttributes: true,
  tightCommaSeparatedLists: true,
  tightDoctype: true,
  tightSelfClosing: true
}

const plugins = [
  rehypeMinifyAttributeWhitespace,
  rehypeMinifyCssStyle,
  // Note: `rehypeRemoveMetaHttpEquiv` goes before
  // `rehypeMinifyEnumeratedAttribute`, as the latter might minify things further.
  rehypeRemoveMetaHttpEquiv,
  rehypeMinifyEnumeratedAttribute,
  rehypeMinifyEventHandler,
  rehypeMinifyJavaScriptScript,
  rehypeMinifyJavaScriptUrl,
  rehypeMinifyJsonScript,
  rehypeMinifyLanguage,
  rehypeMinifyMediaAttribute,
  rehypeMinifyMetaColor,
  rehypeMinifyMetaContent,
  rehypeMinifyStyleAttribute,
  rehypeMinifyWhitespace,
  rehypeNormalizeAttributeValueCase,
  rehypeRemoveComments,
  rehypeRemoveDuplicateAttributeValues,
  rehypeRemoveEmptyAttribute,
  rehypeRemoveExternalScriptContent,
  rehypeRemoveScriptTypeJavaScript,
  rehypeRemoveStyleTypeCss,
  rehypeSortAttributeValues,
  rehypeSortAttributes
]

/**
 * Preset to minify HTML.
 *
 * @type {Preset}
 */
const rehypePresetMinify = {plugins, settings}

export default rehypePresetMinify
