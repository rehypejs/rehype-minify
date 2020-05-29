'use strict'

var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec
var test = require('tape')
var trim = require('trim-trailing-lines')

test('preset', function (t) {
  var input = path.join('test', 'fixtures', 'small', 'input.html')
  var output = path.join('test', 'fixtures', 'small', 'output.html')
  var bin = require.resolve('rehype-cli/cli')

  t.plan(2)

  // Preset is loaded from `.rehyperc`
  exec(bin + ' "' + input + '"', function (error, stdout) {
    t.ifErr(error)
    t.equal(
      stdout,
      trim(String(fs.readFileSync(output))),
      'should minify from the preset'
    )
  })
})
