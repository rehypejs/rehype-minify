import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-style-attribute', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('i', {style: 'color: #ff0000;'})])),
    u('root', [h('i', {style: 'color:red'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          {
            type: 'element',
            tagName: 'i',
            properties: {style: true},
            children: []
          }
        ])
      ),
    u('root', [
      {
        type: 'element',
        tagName: 'i',
        properties: {style: true},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          {
            type: 'element',
            tagName: 'i',
            properties: {style: 2},
            children: []
          }
        ])
      ),
    u('root', [
      {
        type: 'element',
        tagName: 'i',
        properties: {style: 2},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('i', {style: ''})])),
    u('root', [
      {
        type: 'element',
        tagName: 'i',
        properties: {style: null},
        children: []
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('i', {style: '!important'})])),
    u('root', [h('i', {style: '!important'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('i')])),
    u('root', [h('i')])
  )

  t.end()
})
