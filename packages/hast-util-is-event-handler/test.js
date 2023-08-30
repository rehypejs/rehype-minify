import assert from 'node:assert/strict'
import test from 'node:test'
import {isEventHandler} from 'hast-util-is-event-handler'

test('hast-util-is-event-handler', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('hast-util-is-event-handler')).sort(),
      ['isEventHandler']
    )
  })

  await t.test('should be yes for `oncut`', async function () {
    assert.ok(isEventHandler('oncut'))
  })

  await t.test('should be yes for `onend`', async function () {
    assert.ok(isEventHandler('onend'))
  })

  await t.test('should be yes for `pushsubscriptionchange`', async function () {
    assert.ok(isEventHandler('onpushsubscriptionchange'))
  })

  await t.test('should be no for `ones`', async function () {
    assert.equal(isEventHandler('ones'), false)
  })

  await t.test('should be no for `one`', async function () {
    assert.equal(isEventHandler('one'), false)
  })

  await t.test('should be no for `on`', async function () {
    assert.equal(isEventHandler('on'), false)
  })

  await t.test('should be no for nothing', async function () {
    // @ts-expect-error: not enough arguments.
    assert.equal(isEventHandler(), false)
  })
})
