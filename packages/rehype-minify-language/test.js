import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-minify-language', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('span', {lang: 'en-US'})])),
      h(undefined, [h('span', {lang: 'en'})])
    )
  })

  await t.test('should ignore invalid tags', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(h(undefined, [h('span', {xmlLang: '!'})])),
      h(undefined, [h('span', {xmlLang: '!'})])
    )
  })
})
