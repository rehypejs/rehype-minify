import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from 'rehype-css-to-top'

test('rehype-css-to-top', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('rehype-css-to-top')).sort(), [
      'default'
    ])
  })

  await t.test('should move', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            h('head'),
            h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
          ])
        ),
      h(undefined, [
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
          h(undefined, [
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
      h(undefined, [
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
          h(undefined, [
            h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
          ])
        ),
      h(undefined, [
        h('body', h('link', {rel: ['stylesheet'], href: 'index.css'}))
      ])
    )
  })
})
