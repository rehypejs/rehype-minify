import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-style-attribute', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('i', {style: 'color: #ff0000;'})),
    h('i', {style: 'color:red'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync({
        type: 'element',
        tagName: 'i',
        properties: {style: true},
        children: []
      }),
    {
      type: 'element',
      tagName: 'i',
      properties: {style: true},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync({
        type: 'element',
        tagName: 'i',
        properties: {style: 2},
        children: []
      }),
    {
      type: 'element',
      tagName: 'i',
      properties: {style: 2},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('i', {style: ''})),
    {
      type: 'element',
      tagName: 'i',
      properties: {style: null},
      children: []
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('i', {style: '!important'})),
    h('i', {style: '!important'})
  )

  t.deepEqual(rehype().use(min).runSync(h('i')), h('i'))

  t.end()
})
