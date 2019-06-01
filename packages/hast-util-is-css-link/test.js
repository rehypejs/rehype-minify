'use strict'

/* eslint-disable import/no-extraneous-dependencies */
var test = require('tape')
var u = require('unist-builder')
var h = require('hastscript')
/* eslint-enable import/no-extraneous-dependencies */

var ok = require('.')

test('hast-util-is-css-link', function(t) {
  t.equal(
    ok(h('link', {rel: ['stylesheet']})),
    true,
    'yes - for `link` with `[rel=stylesheet]` and no `[type]`'
  )

  t.equal(
    ok(h('link', {rel: ['stylesheet', 'author']})),
    true,
    'yes - for `link` with multiple `rel`’s, including `stylesheet`, and no `[type]`'
  )

  t.equal(
    ok(h('link', {rel: ['stylesheet'], type: 'text/css'})),
    true,
    'yes - for `link` with `[rel=stylesheet]` and `[type=text/css]`'
  )

  t.equal(
    ok(h('link', {rel: ['stylesheet', 'author'], type: 'text/css'})),
    true,
    'yes - for `link` with multiple `rel`’s, including `stylesheet`, and `[type=text/css]`'
  )

  t.equal(
    ok(h('link', {rel: ['stylesheet'], type: 'text/foo'})),
    false,
    'no - for `link` with `[rel=stylesheet]`, but a type other than `text/css`'
  )

  t.equal(
    ok(h('link', {rel: ['author']})),
    false,
    'no - for `link`s with other rel’s'
  )

  t.equal(
    ok(h('link', {rel: ['author'], type: 'text/css'})),
    false,
    'no - for `link`s with other rel’s (2)'
  )

  t.equal(ok(h('link')), false, 'no - for `link`s without `rel`')

  t.equal(ok(h('link'), {rel: null}), false, 'no - for `link`s without `rel`')

  t.equal(
    ok(u('element', {tagName: 'link'})),
    false,
    'no - for `link`s without `rel`'
  )

  t.equal(ok(h('p')), false, 'no - for non-links')

  t.equal(ok(u('text', 'foo')), false, 'no - for non-elements')
  t.end()
})
