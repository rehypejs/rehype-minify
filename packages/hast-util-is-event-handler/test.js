'use strict';

/* eslint-disable import/no-extraneous-dependencies */

var test = require('tape');
var ok = require('./');

test('hast-util-is-event-handler', function (t) {
  t.ok(ok('oncut'), 'oncut');
  t.ok(ok('onend'), 'onend');
  t.ok(ok('onpushsubscriptionchange'), 'pushsubscriptionchange');
  t.notOk(ok('ones'), 'ones');
  t.notOk(ok('one'), 'one');
  t.notOk(ok('on'), 'on');
  t.notOk(ok(), 'nothing');

  t.end();
});
