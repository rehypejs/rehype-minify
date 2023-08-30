import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-minify-javascript-script'

test('rehype-minify-javascript-script', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-minify-javascript-script')).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h(
              'script',
              'var name = "World";\nconsole.log("Hello, " + name + "!");'
            )
          ])
        ),
      h(undefined, [
        h('script', 'var name="World";console.log("Hello, "+name+"!")')
      ])
    )
  })

  await t.test('should work (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h(
              'script',
              '(function () {var name = "World";\nconsole.log("Hello, " + name + "!");})()'
            )
          ])
        ),
      h(undefined, [h('script', 'console.log("Hello, World!")')])
    )
  })

  await t.test('should ignore non-js (`type`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('script', {type: 'fooscript'}, 'var name = "World";')
          ])
        ),
      h(undefined, [h('script', {type: 'fooscript'}, 'var name = "World";')])
    )
  })

  await t.test('should ignore non-js (`language`)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('script', {language: 'fooscript'}, 'var name = "World";')
          ])
        ),
      h(undefined, [
        h('script', {language: 'fooscript'}, 'var name = "World";')
      ])
    )
  })
})
