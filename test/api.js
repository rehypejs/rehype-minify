import fs from 'fs'
import path from 'path'
import test from 'tape'
import rehype from 'rehype'
import negate from 'negate'
import hidden from 'is-hidden'
import trimTrailingLines from 'trim-trailing-lines'
import minify from '../packages/rehype-preset-minify/index.js'

test('plugin', function (t) {
  var root = path.join('test', 'fixtures')
  var fixtures = fs.readdirSync(root).filter(negate(hidden))

  t.plan(fixtures.length * 2)

  fixtures.forEach(function (name) {
    var fp = path.join(root, name)
    var input = fs.readFileSync(path.join(fp, 'input.html'), 'utf8')
    var output = fs.readFileSync(path.join(fp, 'output.html'), 'utf8')
    var config

    try {
      config = JSON.parse(fs.readFileSync(path.join(fp, 'config.json'), 'utf8'))
    } catch (_) {}

    rehype()
      .use(minify, config)
      .process(input, function (error, doc) {
        t.ifErr(error, 'shouldn’t fail')
        t.equal(String(doc), trimTrailingLines(output), name)
      })
  })
})
