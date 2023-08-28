import assert from 'node:assert/strict'
import {exec as execCallback} from 'node:child_process'
import fs from 'node:fs/promises'
import {promisify} from 'node:util'
import {fileURLToPath} from 'node:url'
import test from 'node:test'
import {trimTrailingLines} from 'trim-trailing-lines'

const exec = promisify(execCallback)

test('cli', async function (t) {
  await t.test('should minify from the CLI', async function () {
    const inputUrl = new URL('fixtures/small/input.html', import.meta.url)
    const outputUrl = new URL('fixtures/small/output.html', import.meta.url)
    const binUrl = new URL(
      '../../../node_modules/rehype-cli/cli.js',
      import.meta.url
    )

    // Preset is loaded from `.rehyperc`
    const result = await exec(
      fileURLToPath(binUrl) + ' "' + fileURLToPath(inputUrl) + '"'
    )

    assert.equal(
      result.stdout,
      trimTrailingLines(String(await fs.readFile(outputUrl)))
    )
  })
})
