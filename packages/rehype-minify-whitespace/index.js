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
var whitespaceSensitive = require('html-whitespace-sensitive-tag-names')
var convert = require('unist-util-is/convert')
var modify = require('unist-util-modify-children')
var element = require('hast-util-is-element')
var has = require('hast-util-has-property')
var embedded = require('hast-util-embedded')
var bodyOK = require('hast-util-is-body-ok-link')
var list = require('./list.json')

var text = convert('text')

module.exports = collapse

function collapse(options) {
  return transform
  function transform(tree) {
    return minify(tree, options || {})
  }
}

function minify(tree, options) {
  var whitespace = options.newlines ? collapseToNewLines : collapseWhiteSpace
  var modifier = modify(visitor)
  var inside = false
  var seen = false

  visitor(tree)

  return tree

  function visitor(node, index, parent) {
    var head
    var previous
    var next
    var value

    // text node which is not inside an inline element
    if (text(node) && !element(parent, list)) {
      previous = parent.children[index - 1]
      next = parent.children[index + 1]

      value = trimLeft(node.value, previous)
      value = trimRight(value, next)

      // Remove the node if it’s collapsed entirely.
      if (!value) {
        parent.children.splice(index, 1)
        return index
      }

      node.value = value
    }

    // inline element, check children
    if (element(node, list)) {
      node.children.forEach((child, i) => {
        if (text(child)) {
          if (i === 0) {
            // previous is parent sibling
            previous = parent.children[index - 1]
          } else {
            previous = node.children[i - 1]
          }

          if (i === node.children.length - 1) {
            next = parent.children[index + 1]
          } else {
            next = node.children[i + 1]
          }

          child.value = trimLeft(child.value, previous)
          child.value = trimRight(child.value, next)

          // Remove the node if it’s collapsed entirely.
          if (!child.value) {
            node.children.splice(i, 1)
          }
        }
      })
    }

    if (!seen && !inside) {
      head = element(node, 'head')
      inside = head
      seen = head
    }

    if (node.children && !element(node, whitespaceSensitive)) {
      modifier(node)
    }

    if (head) {
      inside = false
    }
  }

  function viable(node) {
    return !node || inside || !collapsable(node)
  }

  function findLastTextNode(element) {
    var children = element.children
    var child
    while (children && children.length > 0) {
      child = children[children.length - 1]
      children = child.children
    }

    return child && text(child) ? child : null
  }

  function trimLeft(value, previous) {
    value = whitespace(value)
    var end = value.length
    var start = 0
  
    if (empty(value.charAt(0))) {
      if (!previous || viable(previous)) {
        start++
      } else {
        // if previous element is inline, check if last child has a trailing space
        if (element(previous, list)) {
          var textNode = findLastTextNode(previous)
          if (textNode) {
            var v = whitespace(textNode.value)
            if (v && empty(v.charAt(v.length - 1))) {
              start++
            }
          }
        } else {
          // if previous is a text, check if it has a trailing space
          if (text(previous)) {
            var v = whitespace(previous.value)
            if (v && empty(v.charAt(v.length - 1))) {
              start++
            }
          }
        }
      }
    }
  
    return value.slice(start, end)
  }
  
  function findFirstTextNode(element) {
    var children = element.children
    var child
    while (children && children.length > 0) {
      child = children[0]
      children = child.children
    }

    return child && text(child) ? child : null
  }

  function trimRight(value, next) {
    value = whitespace(value)
    var end = value.length
    var start = 0
  
    if (empty(value.charAt(end - 1))) {
      if (!next || viable(next)) {
        end--
      } else {
        // if previous element is inline, check if first child has a leading space
        if (element(next, list)) {
          var textNode = findFirstTextNode(next);
          if (textNode) {
            var v = whitespace(textNode.value)
            if (v && empty(v.charAt(0))) {
              end--
            }
          }
        } else {
          // if next is a text, check if it has a leading space
          if (text(next)) {
            var v = whitespace(next.value)
            if (v && empty(v.charAt(0))) {
              end--
            }
          }
        }
      }
    }
  
    return value.slice(start, end)
  }
}

// Check if `node` is collapsable.
function collapsable(node) {
  return (
    text(node) ||
    element(node, list) ||
    embedded(node) ||
    bodyOK(node) ||
    (element(node, 'meta') && has(node, 'itemProp'))
  )
}

// Collapse to spaces, or newlines if they’re in a run.
function collapseToNewLines(value) {
  var result = String(value).replace(/\s+/g, function($0) {
    return $0.indexOf('\n') === -1 ? ' ' : '\n'
  })

  return result
}

function empty(character) {
  return character === ' ' || character === '\n'
}