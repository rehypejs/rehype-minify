'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('.');

test('rehype-remove-duplicate-attribute-values', function (t) {
  t.deepEqual(
    rehype().use(min).runSync(h('i', {className: ['foo', 'foo'], autoComplete: ['on', 'on']})),
    h('i', {className: ['foo'], autoComplete: ['on', 'on']})
  );

  t.end();
});
