import test from 'tape'
import rehype from 'rehype'
import h from 'hastscript'
import min from './index.js'

test('rehype-minify-meta-content', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'keywords', content: 'foo, bar baz, qux'})),
    h('meta', {name: 'keywords', content: 'foo,bar baz,qux'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('meta', {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, user-scalable=yes'
        })
      ),
    h('meta', {name: 'viewport', content: 'width=device-width,initial-scale=1'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'viewport', content: true})),
    h('meta', {name: 'viewport', content: true})
  )

  t.deepEqual(rehype().use(min).runSync(h('meta')), h('meta'))

  t.end()
})
