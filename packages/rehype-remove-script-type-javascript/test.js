import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-script-type-javascript', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', {type: 'text/javascript'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'script',
        properties: {type: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', {language: 'javascript'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'script',
        properties: {language: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', {type: 'fooscript'})])),
    u('root', [h('script', {type: 'fooscript'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', {language: 'fooscript'})])),
    u('root', [h('script', {language: 'fooscript'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('script', {type: 'module'})])),
    u('root', [h('script', {type: 'module'})])
  )

  t.end()
})
