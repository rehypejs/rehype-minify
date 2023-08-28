import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-minify-language', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('span', {lang: 'en-US'})])),
      u('root', [h('span', {lang: 'en'})])
    )
  })

  await t.test('should ignore invalid tags', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(u('root', [h('span', {xmlLang: '!'})])),
      u('root', [h('span', {xmlLang: '!'})])
    )
  })
})
