import test from 'tape'
import rehype from 'rehype'
import h from 'hastscript'
import min from './index.js'

test('rehype-minify-language', function (t) {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('span', {lang: 'en-US'})),
    h('span', {lang: 'en'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('span', {xmlLang: '!'})),
    h('span', {xmlLang: '!'})
  )

  t.end()
})
