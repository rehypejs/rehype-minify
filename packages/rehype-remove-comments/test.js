'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('./');

test('rehype-remove-comments', function (t) {
  t.deepEqual(
    rehype().use(min).run(h('div', [{type: 'comment', value: 'foo'}])),
    h('div')
  );

  t.deepEqual(
    rehype().use(min).run(h('div', [{type: 'comment', value: '[if IE]>...<![endif]'}])),
    h('div', [{type: 'comment', value: '[if IE]>...<![endif]'}])
  );

  t.deepEqual(
    rehype().use(min, {removeConditional: true}).run(h('div', [{type: 'comment', value: '[if IE]>...<![endif]'}])),
    h('div')
  );

  t.end();
});
