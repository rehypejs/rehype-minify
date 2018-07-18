'use strict';

/* eslint-disable import/no-extraneous-dependencies, no-script-url */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('.');

test('rehype-minify-javascript-url', function (t) {
  t.deepEqual(
    rehype().use(min).runSync(
      h('a', {id: 'foo', href: 'javascript:alert(false)'}, 'Hello')
    ),
    h('a', {id: 'foo', href: 'javascript:alert(!1)'}, 'Hello')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('a', {href: 'javascript:alert(false'}, 'Hello')
    ),
    h('a', {href: 'javascript:alert(false'}, 'Hello')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('img', {src: 'http://example.com/fav.ico'})
    ),
    h('img', {src: 'http://example.com/fav.ico'})
  );

  t.end();
});
