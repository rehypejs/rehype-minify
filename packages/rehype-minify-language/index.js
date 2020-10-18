/**
 * @fileoverview
 *   Minify language attributes.
 * @example
 *   <span lang="en-US">Color</span>
 *   <a href="https://nl.wikipedia.org/wiki/HyperText_Markup_Language" hreflang="nld-NL">HTML</a>
 *   <span xml:lang="pt-BR">ótimo</span>
 *   <track src="colour.vtt" srclang="en-GB" label="English (UK)">
 */

'use strict'

var normalize = require('bcp-47-normalize')
var visit = require('unist-util-visit')
var has = require('hast-util-has-property')

module.exports = language

var fields = ['hrefLang', 'lang', 'srcLang', 'xmlLang']

function language() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties
  var index = -1
  var prop

  while (++index < fields.length) {
    prop = fields[index]

    if (has(node, prop) && typeof props[prop] === 'string') {
      // BCP 47 tags are case-insensitive, but in this project we prefer
      // lowercase which *should* help GZIP.
      props[prop] = (normalize(props[prop]) || props[prop]).toLowerCase()
    }
  }
}
