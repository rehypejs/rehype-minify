import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-javascript-script', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h(
            'script',
            'var name = "World";\nconsole.log("Hello, " + name + "!");'
          )
        ])
      ),
    u('root', [h('script', 'var name="World";console.log("Hello, "+name+"!")')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h(
            'script',
            '(function () {var name = "World";\nconsole.log("Hello, " + name + "!");})()'
          )
        ])
      ),
    u('root', [h('script', 'console.log("Hello, World!")')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('script', {type: 'fooscript'}, 'var name = "World";')])
      ),
    u('root', [h('script', {type: 'fooscript'}, 'var name = "World";')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('script', {language: 'fooscript'}, 'var name = "World";')])
      ),
    u('root', [h('script', {language: 'fooscript'}, 'var name = "World";')])
  )

  t.end()
})
