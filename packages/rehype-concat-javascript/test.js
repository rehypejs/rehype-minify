'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var u = require('unist-builder');
var h = require('hastscript');
var min = require('./');

test('rehype-concat-javascript', function (t) {
  t.deepEqual(
    rehype().use(min).run(u('root', [
      h('script', 'alert(1)'),
      h('script', 'alert(2)')
    ])),
    u('root', [
      h('script', 'alert(1);alert(2)')
    ])
  );

  t.deepEqual(
    rehype().use(min).run(u('root', [
      h('script', 'alert(1);'),
      h('script', 'alert(2);')
    ])),
    u('root', [
      h('script', 'alert(1);;alert(2);')
    ])
  );

  t.deepEqual(
    rehype().use(min).run(u('root', [
      h('script', 'alert(1)'),
      h('script', {type: 'text/fooscript'}, 'alert(2)')
    ])),
    u('root', [
      h('script', 'alert(1)'),
      h('script', {type: 'text/fooscript'}, 'alert(2)')
    ])
  );

  t.deepEqual(
    rehype().use(min).run(u('root', [
      h('script', 'alert(1)'),
      h('script', {src: 'foo'}),
      h('script', 'alert(2)')
    ])),
    u('root', [
      h('script', 'alert(1);alert(2)'),
      h('script', {src: 'foo'})
    ])
  );

  t.deepEqual(
    rehype().use(min).run(u('root', [
      h('script', 'alert(1)')
    ])),
    u('root', [
      h('script', 'alert(1)')
    ])
  );

  t.end();
});
