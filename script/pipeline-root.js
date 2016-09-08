'use strict';

var fs = require('fs');
var path = require('path');
var u = require('unist-builder');
var trough = require('trough');
var remark = require('remark');
var zone = require('mdast-zone');
var vfile = require('to-vfile');

module.exports = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'readme.md'), function (err, file) {
      ctx.readme = file;
      next(err);
    });
  })
  .use(function (ctx, next) {
    var others = [];
    var core = [];

    ctx.plugins.forEach(function (name) {
      var pack = require(path.join(ctx.root, 'packages', name, 'package.json'));
      (pack.excludeFromPreset ? others : core).push(name);
    });

    remark()
      .use(attacher, 'plugins-core', core)
      .use(attacher, 'plugins-other', others)
      .process(ctx.readme, {bullet: '*'}, function (err) {
        next(err);
      });

    function attacher(proc, name, list) {
      return transform;

      function transform(tree) {
        zone(tree, name, visit);
      }

      function visit(start, nodes, end) {
        return [
          start,
          u('list', {ordered: false}, list.map(function (name) {
            return u('listItem', [
              u('link', {url: './packages/' + name}, [
                u('inlineCode', name)
              ])
            ]);
          })),
          end
        ];
      }
    }
  })
  .use(function (ctx, next) {
    fs.writeFile(ctx.readme.path, ctx.readme, function (err) {
      next(err);
    });
  })
  .use(function (ctx) {
    ctx.readme.stored = true;
  });
