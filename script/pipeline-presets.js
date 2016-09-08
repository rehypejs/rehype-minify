'use strict';

/* Dependencies. */
var path = require('path');
var vfile = require('to-vfile');
var trough = require('trough');
var xtend = require('xtend');

var filePipeline = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'lib', ctx.basename), function (err, file) {
      ctx.file = file;
      next(err);
    });
  })
  .use(function (ctx) {
    var doc = ctx.file.toString();

    ctx.plugins.forEach(function (name) {
      var pack = require(path.join(ctx.ancestor, 'packages', name, 'package.json'));
      var re = new RegExp('\\b' + name.slice('rehype-'.length) + '\\b');

      if (re.test(doc)) {
        if (pack.excludeFromPreset) {
          throw new Error('Did not expect `' + name + '` in `' + ctx.basename + '`');
        }
      } else if (!pack.excludeFromPreset) {
        throw new Error('Expected `' + name + '` in `' + ctx.basename + '`');
      }
    });
  });

module.exports = trough()
  .use(function (ctx, next) {
    var count = 0;

    ['api.js', 'preset.js'].forEach(function (basename, index, all) {
      filePipeline.run(xtend(ctx, {basename: basename}), function (err) {
        count++;

        if (err || count === all.length) {
          next(err);
        }
      });
    });
  });
