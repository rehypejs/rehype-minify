'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var u = require('unist-builder');
var h = require('hastscript');
var ok = require('./');

test('hast-util-is-body-ok-link', function (t) {
  t.equal(
    ok(h('link', {itemProp: 'foo'})),
    true,
    'yes - for `link`s with `itemProp`'
  );

  t.equal(
    ok(h('link', {rel: ['prefetch'], href: '//example.com'})),
    true,
    'yes - for `link`s with `rel[prefetch]`'
  );

  t.equal(
    ok(h('link', {rel: ['stylesheet'], href: 'index.css'})),
    true,
    'yes - for `link`s with `rel[stylesheet]`'
  );

  t.equal(
    ok(h('link', {rel: ['pingback'], href: '//example.com'})),
    true,
    'yes - for `link`s with `rel[pingback]`'
  );

  t.equal(
    ok(h('link', {rel: ['author'], href: 'index.css'})),
    false,
    'no - for `link`s with other rel’s'
  );

  t.equal(
    ok(h('link', {rel: ['stylesheet', 'author'], href: 'index.css'})),
    false,
    'no - for `link`s with combined rel’s'
  );

  t.equal(
    ok(h('link')),
    false,
    'no - for `link`s without `rel` or `itemProp`'
  );

  t.equal(
    ok(u('element', {tagName: 'link'})),
    false,
    'no - for `link`s without `rel` or `itemProp` (2)'
  );

  t.equal(
    ok(h('p')),
    false,
    'no - for non-links'
  );

  t.equal(
    ok(u('text', 'foo')),
    false,
    'no - for non-elements'
  );
  t.end();
});
