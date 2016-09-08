'use strict';

/* Dependencies. */
var api = require('./lib/api');
var preset = require('./lib/preset');

/* Expose. */
module.exports = minify;

minify.config = require('./lib/config');

/* Check if we’re loaded as a plugin or a preset */
function minify(a, b) {
  return (a.use && a.process && a.readable && a.writable ? api : preset)(a, b);
}
