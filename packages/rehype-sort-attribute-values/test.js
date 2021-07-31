import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-sort-attribute-values', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('#foo.qux.quux.bar.foo.baz', {itemProp: true})),
    h('#foo.bar.baz.foo.quux.qux', {itemProp: true})
  )

  // 3 x foo, 2 x bar, 1 x baz, 1 x qux, 1 x quux.
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('.foo', [h('.bar.foo'), h('.quux'), h('.qux.baz.bar.foo')])),
    h('.foo', [h('.foo.bar'), h('.quux'), h('.foo.bar.baz.qux')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('.foobar', [h('.foo.foobar')])),
    h('.foobar', [h('.foobar.foo')])
  )

  t.deepEqual(rehype().use(min).runSync(h('.foo.foo')), h('.foo.foo'))

  t.deepEqual(rehype().use(min).runSync(h('.foo.foob')), h('.foo.foob'))

  t.deepEqual(rehype().use(min).runSync(h('.foob.foo')), h('.foo.foob'))

  t.deepEqual(rehype().use(min).runSync(h('.foob.fooa')), h('.fooa.foob'))

  t.end()
})
