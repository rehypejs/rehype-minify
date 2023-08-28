import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-sort-attribute-values', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('#foo.qux.quux.bar.foo.baz', {itemProp: true})])),
      u('root', [h('#foo.bar.baz.foo.quux.qux', {itemProp: true})])
    )
  })

  await t.test('should work (2)', async function () {
    // 3 x foo, 2 x bar, 1 x baz, 1 x qux, 1 x quux.
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('.foo', [h('.bar.foo'), h('.quux'), h('.qux.baz.bar.foo')])
          ])
        ),
      u('root', [h('.foo', [h('.foo.bar'), h('.quux'), h('.foo.bar.baz.qux')])])
    )
  })

  await t.test('should work (3)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('.foobar', [h('.foo.foobar')])])),
      u('root', [h('.foobar', [h('.foobar.foo')])])
    )
  })

  await t.test('should work (4)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('.foo.foo')])),
      u('root', [h('.foo.foo')])
    )
  })

  await t.test('should work (5)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('.foo.foob')])),
      u('root', [h('.foo.foob')])
    )
  })

  await t.test('should work (6)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('.foob.foo')])),
      u('root', [h('.foo.foob')])
    )
  })

  await t.test('should work (7)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('.foob.fooa')])),
      u('root', [h('.fooa.foob')])
    )
  })
})
