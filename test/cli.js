'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var fs = require('fs');
var path = require('path');
var test = require('tape');
var execa = require('execa');
var trim = require('trim-trailing-lines');

test('preset', function (t) {
  var input = path.join('test', 'fixtures', 'small', 'input.html');
  var output = path.join('test', 'fixtures', 'small', 'output.html');
  var bin = require.resolve('rehype-cli/cli');

  t.plan(1);

  /* preset is loaded from `.rehyperc` */
  execa(bin, [input]).then(function (result) {
    t.equal(
      result.stdout,
      trim(String(fs.readFileSync(output))),
      'should minify from the preset'
    );
  }, t.ifErr);
});
