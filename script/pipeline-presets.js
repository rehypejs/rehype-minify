'use strict';

/* Dependencies. */
var path = require('path');
var vfile = require('to-vfile');
var trough = require('trough');

var filePipeline = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'index.js'), function (err, file) {
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
          throw new Error('Did not expect `' + name + '` in `' + ctx.root + '`');
        }
      } else if (!pack.excludeFromPreset) {
        throw new Error('Expected `' + name + '` in `' + ctx.root + '`');
      }
    });
  });

module.exports = trough()
  .use(function (ctx, next) {
    filePipeline.run(ctx, function (err) {
      next(err);
    });
  });
