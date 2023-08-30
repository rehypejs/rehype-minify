import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import {rehype} from 'rehype'
import min from './index.js'

test('rehype-prevent-favicon-request', async function (t) {
  await t.test('should work', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [{type: 'doctype'}, h('html', [h('head'), h('body')])])
        ),
      h(undefined, [
        {type: 'doctype'},
        h('html', [
          h(
            'head',
            h('link', {
              href: 'data:image/x-icon;,',
              rel: ['shortcut', 'icon'],
              type: 'image/x-icon'
            })
          ),
          h('body')
        ])
      ])
    )
  })

  await t.test('should do nothing w/ existing favicon (1)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            {type: 'doctype'},
            h('html', [
              h('head', [
                h('link', {
                  href: '/example.ico',
                  rel: ['shortcut', 'icon']
                })
              ])
            ])
          ])
        ),
      h(undefined, [
        {type: 'doctype'},
        h('html', [
          h('head', [
            h('link', {
              href: '/example.ico',
              rel: ['shortcut', 'icon']
            })
          ])
        ])
      ])
    )
  })

  await t.test('should do nothing w/ existing favicon (2)', async function () {
    assert.deepEqual(
      rehype()
        .use(min)
        .runSync(
          h(undefined, [
            {type: 'doctype'},
            h('html', [
              h('head', [
                h('link', {
                  href: '/example.ico',
                  rel: ['icon']
                })
              ])
            ])
          ])
        ),
      h(undefined, [
        {type: 'doctype'},
        h('html', [
          h('head', [
            h('link', {
              href: '/example.ico',
              rel: ['icon']
            }),
            h('link', {
              href: 'data:image/x-icon;,',
              rel: ['shortcut', 'icon'],
              type: 'image/x-icon'
            })
          ])
        ])
      ])
    )
  })

  await t.test('should do nothing without head', async function () {
    assert.deepEqual(
      rehype().use(min).runSync(h(undefined, [])),
      h(undefined, [])
    )
  })
})
