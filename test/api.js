import fs from 'fs'
import path from 'path'
import test from 'tape'
import {rehype} from 'rehype'
import negate from 'negate'
import {isHidden} from 'is-hidden'
import {trimTrailingLines} from 'trim-trailing-lines'
import minify from '../packages/rehype-preset-minify/index.js'

test('plugin', (t) => {
  const root = path.join('test', 'fixtures')
  const fixtures = fs.readdirSync(root).filter(negate(isHidden))

  t.plan(fixtures.length * 2)

  let index = -1

  while (++index < fixtures.length) {
    const name = fixtures[index]
    const fp = path.join(root, name)
    const input = fs.readFileSync(path.join(fp, 'input.html'), 'utf8')
    const output = fs.readFileSync(path.join(fp, 'output.html'), 'utf8')
    let config

    try {
      config = JSON.parse(fs.readFileSync(path.join(fp, 'config.json'), 'utf8'))
    } catch {}

    rehype()
      .use(minify, config)
      .process(input, (error, doc) => {
        t.ifErr(error, 'shouldn’t fail')
        t.equal(String(doc), trimTrailingLines(output), name)
      })
  }
})
