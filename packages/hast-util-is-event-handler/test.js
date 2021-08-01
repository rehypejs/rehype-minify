import test from 'tape'
import {isEventHandler} from './index.js'

test('hast-util-is-event-handler', (t) => {
  t.ok(isEventHandler('oncut'), 'oncut')
  t.ok(isEventHandler('onend'), 'onend')
  t.ok(isEventHandler('onpushsubscriptionchange'), 'pushsubscriptionchange')
  t.notOk(isEventHandler('ones'), 'ones')
  t.notOk(isEventHandler('one'), 'one')
  t.notOk(isEventHandler('on'), 'on')
  // @ts-expect-error: not enough arguments.
  t.notOk(isEventHandler(), 'nothing')

  t.end()
})
