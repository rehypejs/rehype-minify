import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-style-type-css', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('link', {rel: ['stylesheet'], type: 'text/css'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'link',
        properties: {rel: ['stylesheet'], type: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('style', {type: 'text/css'})])),
    u('root', [
      {
        type: 'element',
        tagName: 'style',
        properties: {type: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('link', {type: 'foostyle'})])),
    u('root', [h('link', {type: 'foostyle'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('style', {type: 'foostyle'})])),
    u('root', [h('style', {type: 'foostyle'})])
  )

  t.end()
})
