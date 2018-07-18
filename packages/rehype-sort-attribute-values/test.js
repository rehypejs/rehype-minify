'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('.');

test('rehype-sort-attribute-values', function (t) {
  t.deepEqual(
    rehype().use(min).runSync(h('i', {className: ['qux', 'quux', 'bar', 'foo', 'baz'], itemProp: true, id: 'foo'})),
    h('i', {className: ['bar', 'baz', 'foo', 'quux', 'qux'], itemProp: true, id: 'foo'})
  );

  t.end();
});
