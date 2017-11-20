'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var u = require('unist-builder');
var h = require('hastscript');
var min = require('./');

test('rehype-javascript-to-bottom', function (t) {
  t.deepEqual(
    rehype().use(min).runSync(u('root', [
      h('head', [
        h('script', {src: 'index.js'}),
        h('script', 'alert(1);'),
        h('script', {type: 'fooscript', src: 'index.js'})
      ]),
      h('body', [])
    ])),
    u('root', [
      h('head', [
        h('script', {type: 'fooscript', src: 'index.js'})
      ]),
      h('body', [
        h('script', {src: 'index.js'}),
        h('script', 'alert(1);')
      ])
    ])
  );

  t.deepEqual(
    rehype().use(min).runSync(u('root', [
      h('head'),
      h('body', h('link', {rel: ['stylesheet'], type: 'text/foostyle', href: 'index.css'}))
    ])),
    u('root', [
      h('head'),
      h('body', h('link', {rel: ['stylesheet'], type: 'text/foostyle', href: 'index.css'}))
    ])
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
    ),
    h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
  );

  function ignoreFoo(node) {
    return !/foo.js/.test(node.properties.src);
  }

  t.deepEqual(
    rehype().use(min, {filter: ignoreFoo}).runSync(u('root', [
      h('head', [
        h('script', {src: 'index.js'}),
        h('script', {src: 'foo.js'})
      ]),
      h('body', [])
    ])),
    u('root', [
      h('head', [
        h('script', {src: 'foo.js'})
      ]),
      h('body', [
        h('script', {src: 'index.js'})
      ])
    ])
  );

  t.end();
});
