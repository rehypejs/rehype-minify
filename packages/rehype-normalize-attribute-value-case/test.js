'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('./');

test('rehype-normalize-attribute-value-case', function (t) {
  t.deepEqual(
    rehype().use(min).run(h('form', {id: 'FOO', method: 'GET'})),
    h('form', {id: 'FOO', method: 'get'})
  );

  t.deepEqual(
    rehype().use(min).run(h('form', {method: true})),
    h('form', {method: true})
  );

  t.deepEqual(
    rehype().use(min).run(h('form', {acceptCharset: ['UTF8', 'UTF-8']})),
    h('form', {acceptCharset: ['utf8', 'utf-8']})
  );

  t.end();
});
