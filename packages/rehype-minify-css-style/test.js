import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-css-style', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('style', '* { color: #ff0000; }')])),
    u('root', [h('style', '*{color:red}')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('style', {type: 'foostyle'}, '* { color: #ff0000; }')])
      ),
    u('root', [h('style', {type: 'foostyle'}, '* { color: #ff0000; }')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(u('root', [h('style', '* { color }')])),
    u('root', [h('style', '* { color }')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')])
      ),
    u('root', [h('style', '* { -webkit-: 0 0 2px rgba(#000, 0.4); }')])
  )

  t.end()
})
