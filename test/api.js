'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var fs = require('fs');
var path = require('path');
var test = require('tape');
var rehype = require('rehype');
var negate = require('negate');
var hidden = require('is-hidden');
var trim = require('trim-trailing-lines');
var minify = require('../packages/rehype-preset-minify');

test('plugin', function (t) {
  var root = path.join(__dirname, 'fixtures');
  var fixtures = fs.readdirSync(root).filter(negate(hidden));

  t.plan(fixtures.length * 2);

  fixtures.forEach(function (name) {
    var fp = path.join(root, name);
    var input = fs.readFileSync(path.join(fp, 'input.html'), 'utf8');
    var output = fs.readFileSync(path.join(fp, 'output.html'), 'utf8');
    var config;

    try {
      config = JSON.parse(fs.readFileSync(path.join(fp, 'config.json'), 'utf8'));
    } catch (err) {}

    rehype().use(minify, config).process(input, function (err, doc) {
      t.ifErr(err, 'shouldn’t fail');
      t.equal(String(doc), trim(output), name);
    });
  });
});
