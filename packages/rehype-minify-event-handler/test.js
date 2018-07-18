'use strict';

/* eslint-disable import/no-extraneous-dependencies, no-script-url */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('.');

test('rehype-minify-event-handler', function (t) {
  t.deepEqual(
    rehype().use(min).runSync(
      h('h1', {onClick: 'javascript:alert(false)'}, 'Hello')
    ),
    h('h1', {onClick: 'alert(!1)'}, 'Hello')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('button', {onClick: 'return false'}, 'Click me')
    ),
    h('button', {onClick: 'return!1'}, 'Click me')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('button', {id: 'foo', onClick: 'alert('}, 'Click me')
    ),
    h('button', {id: 'foo', onClick: 'alert('}, 'Click me')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('button', {onCut: true}, 'Click me')
    ),
    h('button', {onCut: true}, 'Click me')
  );

  t.end();
});
