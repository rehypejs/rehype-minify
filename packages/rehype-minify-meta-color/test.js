import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-meta-color', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('meta', {name: 'theme-color', content: '#ff0000'})])
      ),
    u('root', [h('meta', {name: 'theme-color', content: 'red'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('meta', {name: 'msapplication-TileColor', content: '#00ff00'})
        ])
      ),
    u('root', [h('meta', {name: 'msapplication-TileColor', content: '#0f0'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta', {name: 'theme-color', content: true})])),
    u('root', [h('meta', {name: 'theme-color', content: true})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta', {name: 'theme-color'})])),
    u('root', [h('meta', {name: 'theme-color'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta', {name: 'theme-color', content: ''})])),
    u('root', [h('meta', {name: 'theme-color', content: ''})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('meta', {name: 'theme-color', content: '#f'})])),
    u('root', [h('meta', {name: 'theme-color', content: '#f'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('meta', {name: 'theme-color', content: 'unknown'})])
      ),
    u('root', [h('meta', {name: 'theme-color', content: 'unknown'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [{type: 'element', tagName: 'meta', children: []}])),
    u('root', [{type: 'element', tagName: 'meta', children: []}])
  )

  t.end()
})
