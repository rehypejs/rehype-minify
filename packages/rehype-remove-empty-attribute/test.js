'use strict'

/* eslint-disable import/no-extraneous-dependencies */
var test = require('tape')
var rehype = require('rehype')
var h = require('hastscript')
/* eslint-enable import/no-extraneous-dependencies */

var min = require('.')

test('rehype-remove-duplicate-attribute-values', function(t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('label', {htmlFor: '', id: '', allowTransparency: ''})),
    {
      type: 'element',
      tagName: 'label',
      properties: {
        allowTransparency: '',
        htmlFor: null,
        id: null
      },
      children: []
    }
  )

  t.end()
})
