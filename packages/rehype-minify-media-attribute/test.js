import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-media-attribute', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('link', {media: '(min-width: 320px)', href: 'index.css'})])
      ),
    u('root', [h('link', {media: '(min-width:320px)', href: 'index.css'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('source', {media: '(min-width: 721px)', src: 'pear.jpg'})])
      ),
    u('root', [h('source', {media: '(min-width:721px)', src: 'pear.jpg'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('style', {media: 'all'}, '* {color: red}')])),
    u('root', [
      {
        type: 'element',
        tagName: 'style',
        properties: {media: null},
        children: [{type: 'text', value: '* {color: red}'}]
      }
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('source', {media: '!important', src: 'pear.jpg'})])
      ),
    u('root', [h('source', {media: '!important', src: 'pear.jpg'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('div')])),
    u('root', [h('div')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('source', {media: true})])),
    u('root', [h('source', {media: true})])
  )

  t.end()
})
