import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-meta-content', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('meta', {name: 'keywords', content: 'foo, bar baz, qux'})])
      ),
    u('root', [h('meta', {name: 'keywords', content: 'foo,bar baz,qux'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('meta', {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, user-scalable=yes'
          })
        ])
      ),
    u('root', [
      h('meta', {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1'
      })
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta', {name: 'viewport', content: true})])),
    u('root', [h('meta', {name: 'viewport', content: true})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta')])),
    u('root', [h('meta')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [{type: 'element', tagName: 'meta', children: []}])),
    u('root', [{type: 'element', tagName: 'meta', children: []}])
  )

  t.end()
})
