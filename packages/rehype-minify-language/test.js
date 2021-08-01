import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-language', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('span', {lang: 'en-US'})])),
    u('root', [h('span', {lang: 'en'})])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('span', {xmlLang: '!'})])),
    u('root', [h('span', {xmlLang: '!'})])
  )

  t.end()
})
