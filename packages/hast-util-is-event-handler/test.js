import test from 'tape'
import {isEventHandler} from './index.js'

test('hast-util-is-event-handler', function (t) {
  t.ok(isEventHandler('oncut'), 'oncut')
  t.ok(isEventHandler('onend'), 'onend')
  t.ok(isEventHandler('onpushsubscriptionchange'), 'pushsubscriptionchange')
  t.notOk(isEventHandler('ones'), 'ones')
  t.notOk(isEventHandler('one'), 'one')
  t.notOk(isEventHandler('on'), 'on')
  t.notOk(isEventHandler(), 'nothing')

  t.end()
})
