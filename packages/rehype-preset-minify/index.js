'use strict'

exports.settings = {
  entities: {
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

exports.plugins = [
  require('rehype-minify-attribute-whitespace'),
  require('rehype-minify-css-style'),
  // Do `remove-meta-http-equiv` before `enumerated-attribute`, because the
  // latter might minify things further.
  require('rehype-remove-meta-http-equiv'),
  require('rehype-minify-enumerated-attribute'),
  require('rehype-minify-event-handler'),
  require('rehype-minify-javascript-script'),
  require('rehype-minify-javascript-url'),
  require('rehype-minify-json-script'),
  require('rehype-minify-media-attribute'),
  require('rehype-minify-meta-color'),
  require('rehype-minify-meta-content'),
  require('rehype-minify-style-attribute'),
  require('rehype-minify-whitespace'),
  require('rehype-normalize-attribute-value-case'),
  require('rehype-remove-comments'),
  require('rehype-remove-duplicate-attribute-values'),
  require('rehype-remove-empty-attribute'),
  require('rehype-remove-external-script-content'),
  require('rehype-remove-script-type-javascript'),
  require('rehype-remove-style-type-css'),
  require('rehype-sort-attribute-values'),
  require('rehype-sort-attributes')
]
