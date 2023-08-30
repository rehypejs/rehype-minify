import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-sort-attribute-values'

test('rehype-sort-attribute-values', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('rehype-sort-attribute-values')).sort(),
      ['default']
    )
  })

  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [h('#foo.qux.quux.bar.foo.baz', {itemProp: true})])
        ),
      h(undefined, [h('#foo.bar.baz.foo.quux.qux', {itemProp: true})])
    )
  })

  await t.test('should work (2)', async function () {
    // 3 x foo, 2 x bar, 1 x baz, 1 x qux, 1 x quux.
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('.foo', [h('.bar.foo'), h('.quux'), h('.qux.baz.bar.foo')])
          ])
        ),
      h(undefined, [
        h('.foo', [h('.foo.bar'), h('.quux'), h('.foo.bar.baz.qux')])
      ])
    )
  })

  await t.test('should work (3)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('.foobar', [h('.foo.foobar')])])),
      h(undefined, [h('.foobar', [h('.foobar.foo')])])
    )
  })

  await t.test('should work (4)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('.foo.foo')])),
      h(undefined, [h('.foo.foo')])
    )
  })

  await t.test('should work (5)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('.foo.foob')])),
      h(undefined, [h('.foo.foob')])
    )
  })

  await t.test('should work (6)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('.foob.foo')])),
      h(undefined, [h('.foo.foob')])
    )
  })

  await t.test('should work (7)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('.foob.fooa')])),
      h(undefined, [h('.fooa.foob')])
    )
  })
})
