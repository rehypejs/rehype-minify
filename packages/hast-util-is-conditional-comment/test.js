'use strict'

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape')
var u = require('unist-builder')
var h = require('hastscript')
var ok = require('.')

test('hast-util-is-conditional-comment', function(t) {
  ;[
    '[if IE]>...<![endif]',
    '[if IE 6]>...<![endif]',
    '[if IE 7]>...<![endif]',
    '[if IE 8]>...<![endif]',
    '[if IE 9]>...<![endif]',
    '[if gte IE 8]>...<![endif]',
    '[if lt IE 9]>...<![endif]',
    '[if lte IE 7]>...<![endif]',
    '[if gt IE 6]>...<![endif]',
    '[if !IE]>',
    '<![endif]'
  ].forEach(function(val) {
    t.equal(ok(u('comment', val)), true, 'yes - <!--' + val + '-->')
  })

  t.equal(ok(u('comments', 'foo')), false, 'no - for other comments')
  t.equal(ok(h('div')), false, 'no - for elements')
  t.equal(ok(u('text', 'foo')), false, 'no - for texts')

  t.end()
})
