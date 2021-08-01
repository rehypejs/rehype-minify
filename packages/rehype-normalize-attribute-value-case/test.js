import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-normalize-attribute-value-case', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('form', {id: 'FOO', method: 'GET'})])),
    u('root', [h('form', {id: 'FOO', method: 'get'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('form', {method: true})])),
    u('root', [h('form', {method: true})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('form', {acceptCharset: ['UTF8', 'UTF-8']})])),
    u('root', [h('form', {acceptCharset: ['utf8', 'utf-8']})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [{type: 'element', tagName: 'form', children: []}])),
    u('root', [{type: 'element', tagName: 'form', children: []}])
  )

  t.end()
})
