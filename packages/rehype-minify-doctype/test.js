import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-minify-doctype', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          // @ts-expect-error: fields are no longer valid.
          h(undefined, [
            {
              type: 'doctype',
              name: 'HTML',
              public: '-//W3C//DTD HTML 4.01//EN',
              system: 'http://www.w3.org/TR/html4/strict.dtd'
            }
          ])
        ),
      // @ts-expect-error: fields are no longer valid.
      h(undefined, [
        {type: 'doctype', name: 'HTML', public: undefined, system: undefined}
      ])
    )
  })

  await t.test('should keep a regular doctype', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        // @ts-expect-error: fields are no longer valid.
        .runSync(h(undefined, [{type: 'doctype', name: 'html'}])),
      // @ts-expect-error: fields are no longer valid.
      h(undefined, [{type: 'doctype', name: 'html'}])
    )
  })
})
