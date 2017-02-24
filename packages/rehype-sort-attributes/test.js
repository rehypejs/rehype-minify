'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var rehype = require('rehype');
var h = require('hastscript');
var min = require('./');

test('rehype-sort-attributes', function (t) {
  t.equal(
    rehype().stringify(rehype().use(min).runSync(
      h('p', {id: 'foo', className: ['bar']}, [
        h('strong', {id: 'baz', className: ['qux']}),
        h('em', {hidden: false, className: ['quux']})
      ])
    )),
    rehype().stringify(h('p', {className: ['bar'], id: 'foo'}, [
      h('strong', {className: ['qux'], id: 'baz'}),
      h('em', {hidden: false, className: ['quux']})
    ]))
  );

  t.end();
});
