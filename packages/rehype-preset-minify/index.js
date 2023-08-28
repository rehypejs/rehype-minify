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
 * You can use this plugin when you want to improve the size of HTML documents.
 *
 * ## API
 *
 * ### `unified().use(rehypePresetMinify)`
 *
 * Use the preset.
 *
 * Presets don’t have options.
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

import rehypeMinifyAttributeWhitespace from 'rehype-minify-attribute-whitespace'
import rehypeMinifyCssStyle from 'rehype-minify-css-style'
import rehypeRemoveMetaHttpEquiv from 'rehype-remove-meta-http-equiv'
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
import rehypeRemoveScriptTypeJavaScript from 'rehype-remove-script-type-javascript'
import rehypeRemoveStyleTypeCss from 'rehype-remove-style-type-css'
import rehypeSortAttributeValues from 'rehype-sort-attribute-values'
import rehypeSortAttributes from 'rehype-sort-attributes'

const settings = {
  characterReferences: {
    omitOptionalSemicolons: true,
    useShortestReferences: true
  },
  quoteSmart: true,
  preferUnquoted: true,
  omitOptionalTags: true,
  bogusComments: true,
  collapseEmptyAttributes: true,
  closeEmptyElements: true,
  tightSelfClosing: true,
  tightCommaSeparatedLists: true,
  tightAttributes: true,
  tightDoctype: true,
  allowParseErrors: true
}

const plugins = [
  rehypeMinifyAttributeWhitespace,
  rehypeMinifyCssStyle,
  // Do `remove-meta-http-equiv` before `enumerated-attribute`, because the
  // latter might minify things further.
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

const rehypePresetMinify = {settings, plugins}

export default rehypePresetMinify
