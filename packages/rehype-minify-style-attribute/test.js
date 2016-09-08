'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('./');

test('rehype-minify-style-attribute', function (t) {
  t.deepEqual(
    rehype().use(min).run(
      h('i', {style: 'color: #ff0000;'})
    ),
    h('i', {style: 'color:red'})
  );

  t.deepEqual(
    rehype().use(min).run({
      type: 'element',
      tagName: 'i',
      properties: {style: true},
      children: []
    }),
    {
      type: 'element',
      tagName: 'i',
      properties: {style: true},
      children: []
    }
  );

  t.deepEqual(
    rehype().use(min).run({
      type: 'element',
      tagName: 'i',
      properties: {style: 2},
      children: []
    }),
    {
      type: 'element',
      tagName: 'i',
      properties: {style: 2},
      children: []
    }
  );

  t.deepEqual(
    rehype().use(min).run(h('i', {style: ''})),
    {
      type: 'element',
      tagName: 'i',
      properties: {style: null},
      children: []
    }
  );

  t.deepEqual(
    rehype().use(min).run(h('i', {style: '!important'})),
    h('i', {style: '!important'})
  );

  t.deepEqual(
    rehype().use(min).run(h('i')),
    h('i')
  );

  t.end();
});
