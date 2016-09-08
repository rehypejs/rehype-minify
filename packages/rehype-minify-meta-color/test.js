'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('./');

test('rehype-minify-meta-color', function (t) {
  t.deepEqual(
    rehype().use(min).run(
      h('meta', {name: 'theme-color', content: '#ff0000'})
    ),
    h('meta', {name: 'theme-color', content: 'red'})
  );

  t.deepEqual(
    rehype().use(min).run(
      h('meta', {name: 'msapplication-TileColor', content: '#00ff00'})
    ),
    h('meta', {name: 'msapplication-TileColor', content: '#0f0'})
  );

  t.deepEqual(
    rehype().use(min).run(
      h('meta', {name: 'theme-color', content: true})
    ),
    h('meta', {name: 'theme-color', content: true})
  );

  t.deepEqual(
    rehype().use(min).run(
      h('meta', {name: 'theme-color'})
    ),
    h('meta', {name: 'theme-color'})
  );

  t.deepEqual(
    rehype().use(min).run(
      h('meta', {name: 'theme-color', content: ''})
    ),
    h('meta', {name: 'theme-color', content: ''})
  );

  t.deepEqual(
    rehype().use(min).run(
      h('meta', {name: 'theme-color', content: '#f'})
    ),
    h('meta', {name: 'theme-color', content: '#f'})
  );

  t.deepEqual(
    rehype().use(min).run(
      h('meta', {name: 'theme-color', content: 'unknown'})
    ),
    h('meta', {name: 'theme-color', content: 'unknown'})
  );

  t.end();
});
