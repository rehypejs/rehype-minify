import test from 'tape'
import {rehype} from 'rehype'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-json-script', (t) => {
  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('script', {type: 'application/ld+json'}, '{\n\t"@context": {}\n\t}')
      ),
    h('script', {type: 'application/ld+json'}, '{"@context":{}}')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(
        h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
      ),
    h('script', {type: 'application/ld+json'}, '{\n\t"@context": {')
  )

  t.deepEqual(
    rehype()
      .use(min)
      .runSync(h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')),
    h('script', {type: 'foo'}, '{\n\t"@context": {}\n\t}')
  )

  t.end()
})
