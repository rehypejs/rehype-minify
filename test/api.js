import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {rehype} from 'rehype'
import {isHidden} from 'is-hidden'
import {trimTrailingLines} from 'trim-trailing-lines'
import minify from '../packages/rehype-preset-minify/index.js'

test('plugin', (t) => {
  const root = path.join('test', 'fixtures')
  const fixtures = fs.readdirSync(root).filter((d) => !isHidden(d))

  t.plan(fixtures.length * 2)

  let index = -1

  while (++index < fixtures.length) {
    const name = fixtures[index]
    const fp = path.join(root, name)
    const input = fs.readFileSync(path.join(fp, 'input.html'), 'utf8')
    const output = fs.readFileSync(path.join(fp, 'output.html'), 'utf8')
    /** @type {Record<string, unknown>} */
    let config

    try {
      config = JSON.parse(fs.readFileSync(path.join(fp, 'config.json'), 'utf8'))
    } catch {}

    rehype()
      // @ts-expect-error: to do type.
      .use(minify, config)
      .process(input, (error, doc) => {
        t.ifErr(error, 'shouldn’t fail')
        t.equal(String(doc), trimTrailingLines(output), name)
      })
  }
})
