'use strict';

module.exports = preset;

function preset(current, options) {
  return {
    settings: require('./config'),
    plugins: {
      'minify-attribute-whitespace': null,
      'minify-css-style': null,
      'minify-enumerated-attribute': null,
      'minify-event-handler': null,
      'minify-javascript-script': null,
      'minify-javascript-url': null,
      'minify-json-script': null,
      'minify-media-attribute': null,
      'minify-meta-color': null,
      'minify-meta-content': null,
      'minify-style-attribute': null,
      'minify-whitespace': null,
      'normalize-attribute-value-case': null,
      'remove-comments': options,
      'remove-duplicate-attribute-values': null,
      'remove-empty-attribute': null,
      'remove-external-script-content': null,
      'remove-meta-http-equiv': null,
      'remove-script-type-javascript': null,
      'remove-style-type-css': null,
      'sort-attribute-values': null,
      'sort-attributes': null
    }
  };
}
