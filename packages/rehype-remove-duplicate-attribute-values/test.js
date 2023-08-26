import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-duplicate-attribute-values', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('i', {className: ['foo', 'foo'], autoComplete: ['on', 'on']})
        ])
      ),
    u('root', [h('i', {className: ['foo'], autoComplete: ['on', 'on']})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          {type: 'element', tagName: 'i', properties: {}, children: []}
        ])
      ),
    u('root', [{type: 'element', tagName: 'i', properties: {}, children: []}])
  )

  t.end()
})
