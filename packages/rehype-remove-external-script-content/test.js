import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-remove-external-script-content', (t) => {
  t.deepEqual(
    rehype().use(min).runSync(h('script', 'alert(true)')),
    h('script', 'alert(true)')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('script', {src: 'index.js'}, 'alert(true)')),
    h('script', {src: 'index.js'})
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('script', {type: 'fooscript', src: 'index.js'}, 'alert(true)')
      ),
    h('script', {type: 'fooscript', src: 'index.js'}, 'alert(true)')
  )

  t.end()
})
