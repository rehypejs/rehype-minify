import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-comments', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('div', [{type: 'comment', value: 'foo'}])),
    h('div')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])),
    h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])
  )

  t.deepEqual(
    rehype()
      .use(min, {removeConditional: true})
      .runSync(h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])),
    h('div')
  )

  t.end()
})
