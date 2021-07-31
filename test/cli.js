import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'
import test from 'tape'
import {trimTrailingLines} from 'trim-trailing-lines'

test('preset', function (t) {
  var input = path.join('test', 'fixtures', 'small', 'input.html')
  var output = path.join('test', 'fixtures', 'small', 'output.html')
  var bin = path.join('.', 'node_modules', 'rehype-cli', 'cli.js')

  t.plan(2)

  // Preset is loaded from `.rehyperc`
  exec(bin + ' "' + input + '"', function (error, stdout) {
    t.ifErr(error)
    t.equal(
      stdout,
      trimTrailingLines(String(fs.readFileSync(output))),
      'should minify from the preset'
    )
  })
})
