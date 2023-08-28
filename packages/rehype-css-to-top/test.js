import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import min from './index.js'

test('rehype-css-to-top', async function (t) {
  await t.test('should move', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('head'),
            h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
          ])
        ),
      u('root', [
        h('head', h('link', {rel: ['stylesheet'], href: 'index.css'})),
        h('body')
      ])
    )
  })

  await t.test('should not move non-css', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          u('root', [
            h('head'),
            h(
              'body',
              h('link', {
                rel: ['stylesheet'],
                type: 'text/foostyle',
                href: 'index.css'
              })
            )
          ])
        ),
      u('root', [
        h('head'),
        h(
          'body',
          h('link', {
            rel: ['stylesheet'],
            type: 'text/foostyle',
            href: 'index.css'
          })
        )
      ])
    )
  })

  await t.test('should work w/o head', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(null, [
            h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
          ])
        ),
      h(null, [h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))])
    )
  })
})
