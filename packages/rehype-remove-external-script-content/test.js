'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('./');

test('rehype-remove-external-script-content', function (t) {
  t.deepEqual(
    rehype().use(min).runSync(h('script', 'alert(true)')),
    h('script', 'alert(true)')
  );

  t.deepEqual(
    rehype().use(min).runSync(h('script', {src: 'index.js'}, 'alert(true)')),
    h('script', {src: 'index.js'})
  );

  t.deepEqual(
    rehype().use(min).runSync(h('script', {type: 'fooscript', src: 'index.js'}, 'alert(true)')),
    h('script', {type: 'fooscript', src: 'index.js'}, 'alert(true)')
  );

  t.end();
});
