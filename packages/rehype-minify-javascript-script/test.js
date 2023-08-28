import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-javascript-script', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h(
              'script',
              'var name = "World";\nconsole.log("Hello, " + name + "!");'
            )
          ])
        ),
      u('root', [
        h('script', 'var name="World";console.log("Hello, "+name+"!")')
      ])
    )
  })

  await t.test('should work (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h(
              'script',
              '(function () {var name = "World";\nconsole.log("Hello, " + name + "!");})()'
            )
          ])
        ),
      u('root', [h('script', 'console.log("Hello, World!")')])
    )
  })

  await t.test('should ignore non-js (`type`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [h('script', {type: 'fooscript'}, 'var name = "World";')])
        ),
      u('root', [h('script', {type: 'fooscript'}, 'var name = "World";')])
    )
  })

  await t.test('should ignore non-js (`language`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('script', {language: 'fooscript'}, 'var name = "World";')
          ])
        ),
      u('root', [h('script', {language: 'fooscript'}, 'var name = "World";')])
    )
  })
})
