import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-attribute-whitespace', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync({
        type: 'root',
        children: [
          h('input', {type: 'file', accept: ['  image/*', 'video/* ']})
        ]
      }),
    {
      type: 'root',
      children: [h('input', {type: 'file', accept: ['image/*', 'video/*']})]
    }
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync({type: 'root', children: [h('track', {src: '\talpha.vtt'})]}),
    {type: 'root', children: [h('track', {src: 'alpha.vtt'})]}
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync({type: 'root', children: [h('source', {src: 'video.ogv\n'})]}),
    {type: 'root', children: [h('source', {src: 'video.ogv'})]}
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync({type: 'root', children: [h('source', {src: true})]}),
    {type: 'root', children: [h('source', {src: true})]}
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync({
        type: 'root',
        children: [{type: 'element', tagName: 'source', children: []}]
      }),
    {
      type: 'root',
      children: [{type: 'element', tagName: 'source', children: []}]
    }
  )

  t.end()
})
