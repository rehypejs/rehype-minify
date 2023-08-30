import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {isHidden} from 'is-hidden'
import {rehype} from 'rehype'
import rehypePresetMinify from 'rehype-preset-minify'
import {trimTrailingLines} from 'trim-trailing-lines'

test('rehype-preset-minify (api)', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('rehype-preset-minify')).sort(), [
      'default'
    ])
  })

  const root = new URL('fixtures/', import.meta.url)
  const fixtures = await fs.readdir(root)

  let index = -1

  while (++index < fixtures.length) {
    const name = fixtures[index]

    if (isHidden(name)) {
      continue
    }

    // eslint-disable-next-line no-await-in-loop
    await t.test(name, async function () {
      const folder = new URL(name + '/', root)
      const input = String(await fs.readFile(new URL('input.html', folder)))
      const output = String(await fs.readFile(new URL('output.html', folder)))

      const file = await rehype().use(rehypePresetMinify).process(input)

      assert.equal(String(file), trimTrailingLines(output))
    })
  }
})
