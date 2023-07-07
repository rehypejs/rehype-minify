import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-comments', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('div', [{type: 'comment', value: 'foo'}])])),
    u('root', [h('div')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])])
      ),
    u('root', [h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])])
  )

  t.deepEqual(
    rehype()
      .use(min, {removeConditional: true})
      .runSync(
        u('root', [h('div', [{type: 'comment', value: '[if IE]>…<![endif]'}])])
      ),
    u('root', [h('div')])
  )

  t.end()
})
