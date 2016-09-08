'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('./');

test('rehype-minify-whitespace', function (t) {
  t.deepEqual(
    rehype().use(min).run(h('main', [
      '  ',
      h('p', [
        '  ',
        h('strong', 'foo'),
        '  ',
        h('em', 'bar'),
        '  ',
        h('meta', {itemProp: true}),
        '  '
      ]),
      '  ',
      h('p', [
        h('a', {href: 'example.com'}, ' baz'),
        '  ',
        h('em', ' qux')
      ]),
      '  '
    ])),
    h('main', [
      h('p', [
        h('strong', 'foo'),
        ' ',
        h('em', 'bar'),
        ' ',
        h('meta', {itemProp: true})
      ]),
      h('p', [
        h('a', {href: 'example.com'}, 'baz'),
        ' ',
        h('em', 'qux')
      ])
    ])
  );

  t.deepEqual(
    rehype().use(min).run(h('head', [
      '  ',
      h('meta', {itemProp: true}),
      '  ',
      h('noscript', [
        '  ',
        h('link', {rel: ['stylesheet'], href: 'index.css'}),
        '  '
      ])
    ])),
    h('head', [
      h('meta', {itemProp: true}),
      h('noscript', [
        h('link', {rel: ['stylesheet'], href: 'index.css'})
      ])
    ])
  );

  t.end();
});
