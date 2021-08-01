import test from 'tape'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-json-script', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('script', {type: 'application/ld+json'}, '{\n\t"@context": {}\n\t}')
        ])
      ),
    u('root', [h('script', {type: 'application/ld+json'}, '{"@context":{}}')])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [
          h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
        ])
      ),
    u('root', [
      h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
    ])
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        u('root', [h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')])
      ),
    u('root', [h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')])
  )

  t.end()
})
