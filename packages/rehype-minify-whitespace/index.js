/**
 * @fileoverview
 *   Collapse white-space.
 *
 *   Normally, collapses to a single space.
 *   If `newlines: true`, collapses white-space containing newlines to `'\n'`
 *   instead of `' '`.
 * @example
 *   <h1>Heading</h1>
 *   <p><strong>This</strong> and <em>that</em></p>
 */

'use strict'

var collapseWhiteSpace = require('collapse-white-space')
var is = require('hast-util-is-element')
var embedded = require('hast-util-embedded')
var convert = require('unist-util-is/convert')
var whitespace = require('hast-util-whitespace')
var blocks = require('./block')
var contents = require('./content')
var skippables = require('./skippable')

module.exports = minifyWhitespace

var ignorableNode = convert(['doctype', 'comment'])
var parent = convert(['element', 'root'])
var root = convert(['root'])
var element = convert(['element'])
var text = convert(['text'])

function minifyWhitespace(options) {
  var collapse = (options || {}).newlines
    ? collapseToNewLines
    : collapseWhiteSpace

  return transform

  function transform(tree) {
    minify(tree, {collapse: collapse, whitespace: 'normal'})
  }
}

function minify(node, options) {
  var settings

  if (parent(node)) {
    settings = Object.assign({}, options)

    if (root(node) || blocklike(node)) {
      settings.before = true
      settings.after = true
    }

    settings.whitespace = inferWhiteSpace(node, options)

    return all(node, settings)
  }

  if (text(node)) {
    if (options.whitespace === 'normal') {
      return minifyText(node, options)
    }

    // Naïve collapse, but no trimming:
    if (options.whitespace === 'nowrap') {
      node.value = options.collapse(node.value)
    }

    // The `pre-wrap` or `pre` whitespace settings are neither collapsed nor
    // trimmed.
  }

  return {
    remove: false,
    ignore: ignorableNode(node),
    stripAtStart: false
  }
}

function minifyText(node, options) {
  var value = options.collapse(node.value)
  var start = 0
  var end = value.length
  var result = {remove: false, ignore: false, stripAtStart: false}

  if (options.before && removable(value.charAt(0))) {
    start++
  }

  if (start !== end && removable(value.charAt(end - 1))) {
    if (options.after) {
      end--
    } else {
      result.stripAtStart = true
    }
  }

  if (start === end) {
    result.remove = true
  } else {
    node.value = value.slice(start, end)
  }

  return result
}

function all(parent, options) {
  var before = options.before
  var after = options.after
  var children = parent.children
  var length = children.length
  var index = -1
  var result

  while (++index < length) {
    result = minify(
      children[index],
      Object.assign({}, options, {
        before: before,
        after: collapsableAfter(children, index, after)
      })
    )

    if (result.remove) {
      children.splice(index, 1)
      index--
      length--
    } else if (!result.ignore) {
      before = result.stripAtStart
    }

    // If this element, such as a `<select>` or `<img>`, contributes content
    // somehow, allow whitespace again.
    if (content(children[index])) {
      before = false
    }
  }

  return {
    remove: false,
    ignore: false,
    stripAtStart: before || after
  }
}

function collapsableAfter(nodes, index, after) {
  var length = nodes.length
  var node
  var result

  while (++index < length) {
    node = nodes[index]
    result = inferBoundary(node)

    if (result === undefined && node.children && !skippable(node)) {
      result = collapsableAfter(node.children, -1)
    }

    if (typeof result === 'boolean') {
      return result
    }
  }

  return after
}

// Infer two types of boundaries:
//
// 1. `true` — boundary for which whitespace around it does not contribute
//    anything
// 2. `false` — boundary for which whitespace around it *does* contribute
//
// No result (`undefined`) is returned if it is unknown.
function inferBoundary(node) {
  if (element(node)) {
    if (content(node)) {
      return false
    }

    if (blocklike(node)) {
      return true
    }

    // Unknown: either depends on siblings if embedded or metadata, or on
    // children.
  } else if (text(node)) {
    if (!whitespace(node)) {
      return false
    }
  } else if (!ignorableNode(node)) {
    return false
  }
}

// Infer whether a node is skippable.
function content(node) {
  return embedded(node) || is(node, contents)
}

// See: <https://html.spec.whatwg.org/#the-css-user-agent-style-sheet-and-presentational-hints>
function blocklike(node) {
  return is(node, blocks)
}

function skippable(node) {
  /* istanbul ignore next - currently only used on elements, but just to make sure. */
  var props = node.properties || {}

  return ignorableNode(node) || is(node, skippables) || props.hidden
}

function removable(character) {
  return character === ' ' || character === '\n'
}

// Collapse to spaces, or line feeds if they’re in a run.
function collapseToNewLines(value) {
  return String(value).replace(/\s+/g, replace)

  function replace($0) {
    return $0.indexOf('\n') === -1 ? ' ' : '\n'
  }
}

// We don’t support void elements here (so `nobr wbr` -> `normal` is ignored).
function inferWhiteSpace(node, options) {
  var props = node.properties || {}

  switch (node.tagName) {
    case 'listing':
    case 'plaintext':
    case 'xmp':
      return 'pre'
    case 'nobr':
      return 'nowrap'
    case 'pre':
      return props.wrap ? 'pre-wrap' : 'pre'
    case 'td':
    case 'th':
      return props.noWrap ? 'nowrap' : options.whitespace
    case 'textarea':
      return 'pre-wrap'
    default:
      return options.whitespace
  }
}
