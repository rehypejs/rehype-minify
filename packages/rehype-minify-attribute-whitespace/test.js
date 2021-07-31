import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-attribute-whitespace', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('input', {type: 'file', accept: ['  image/*', 'video/* ']})),
    h('input', {type: 'file', accept: ['image/*', 'video/*']})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('track', {src: '\talpha.vtt'})),
    h('track', {src: 'alpha.vtt'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('source', {src: 'video.ogv\n'})),
    h('source', {src: 'video.ogv'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('source', {src: true})),
    h('source', {src: true})
  )

  t.end()
})
