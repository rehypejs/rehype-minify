import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-sort-attribute-values', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('#foo.qux.quux.bar.foo.baz', {itemProp: true})])),
    u('root', [h('#foo.bar.baz.foo.quux.qux', {itemProp: true})])
  )

  // 3 x foo, 2 x bar, 1 x baz, 1 x qux, 1 x quux.
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('.foo', [h('.bar.foo'), h('.quux'), h('.qux.baz.bar.foo')])
        ])
      ),
    u('root', [h('.foo', [h('.foo.bar'), h('.quux'), h('.foo.bar.baz.qux')])])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('.foobar', [h('.foo.foobar')])])),
    u('root', [h('.foobar', [h('.foobar.foo')])])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('.foo.foo')])),
    u('root', [h('.foo.foo')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('.foo.foob')])),
    u('root', [h('.foo.foob')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('.foob.foo')])),
    u('root', [h('.foo.foob')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('.foob.fooa')])),
    u('root', [h('.fooa.foob')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          {type: 'element', tagName: 'div', properties: {}, children: []}
        ])
      ),
    u('root', [{type: 'element', tagName: 'div', properties: {}, children: []}])
  )

  t.end()
})
