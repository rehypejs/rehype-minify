import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-meta-color', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'theme-color', content: '#ff0000'})),
    h('meta', {name: 'theme-color', content: 'red'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('meta', {name: 'msapplication-TileColor', content: '#00ff00'})
      ),
    h('meta', {name: 'msapplication-TileColor', content: '#0f0'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'theme-color', content: true})),
    h('meta', {name: 'theme-color', content: true})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'theme-color'})),
    h('meta', {name: 'theme-color'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'theme-color', content: ''})),
    h('meta', {name: 'theme-color', content: ''})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'theme-color', content: '#f'})),
    h('meta', {name: 'theme-color', content: '#f'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('meta', {name: 'theme-color', content: 'unknown'})),
    h('meta', {name: 'theme-color', content: 'unknown'})
  )

  t.end()
})
