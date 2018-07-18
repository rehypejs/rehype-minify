'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('.');

test('rehype-minify-css-style', function (t) {
  t.deepEqual(
    rehype().use(min).runSync(
      h('style', '* { color: #ff0000; }')
    ),
    h('style', '*{color:red}')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('style', {type: 'foostyle'}, '* { color: #ff0000; }')
    ),
    h('style', {type: 'foostyle'}, '* { color: #ff0000; }')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('style', '* { color }')
    ),
    h('style', '* { color }')
  );

  t.deepEqual(
    rehype().use(min).runSync(
      h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')
    ),
    h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')
  );

  t.end();
});
