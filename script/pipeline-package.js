'use strict';

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var vfile = require('to-vfile');
var execa = require('execa');
var findDown = require('vfile-find-down');
var trough = require('trough');
var uniq = require('uniq');

module.exports = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'package.json'), function (err, file) {
      ctx.package = file;
      next(err);
    });
  })
  .use(function (ctx, next) {
    var fp = path.relative(ctx.ancestor, ctx.root);

    execa('git', ['log', '--all', '--format="%cN <%cE>"', fp]).then(function (result) {
      ctx.contributors = uniq(result.stdout.split('\n')).sort().map(function (line) {
        return line.slice(1, -1);
      }).filter(Boolean);

      if (ctx.contributors.length === 0) {
        ctx.contributors = null;
      }

      next();
    }, next);
  })
  .use(function (ctx, next) {
    findDown.all(['.js', '.json'], ctx.root, function (err, files) {
      if (files) {
        ctx.files = files
          .map(function (file) {
            return path.relative(ctx.root, file.path);
          })
          .filter(function (name) {
            return name !== 'package.json' && !/(example|test)/.test(name);
          })
          .sort();
      }

      next(err);
    });
  })
  .use(function (ctx) {
    var prev = JSON.parse(ctx.package);
    var pkg = require(path.join(ctx.ancestor, 'package.json'));
    var relative = path.relative(ctx.ancestor, ctx.root);

    var curr = {
      name: path.basename(ctx.root),
      version: prev.version,
      description: prev.description,
      license: pkg.license,
      keywords: prev.keywords,
      repository: pkg.repository + '/tree/master/' + relative,
      bugs: pkg.bugs,
      author: pkg.author,
      contributors: ctx.contributors || [pkg.author],
      browser: prev.browser || undefined,
      files: ctx.files || prev.files,
      dependencies: prev.dependencies,
      excludeFromPreset: prev.excludeFromPreset,
      xo: false
    };

    ctx.package.contents = JSON.stringify(curr, 0, 2) + '\n';
  })
  .use(function (ctx, next) {
    fs.writeFile(ctx.package.path, ctx.package.contents, next);
  })
  .use(function (ctx) {
    ctx.package.stored = true;
  });
