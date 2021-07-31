/**
 * @fileoverview
 *   Check if a node is a conditional comment.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   import {u} from 'unist-builder'
 *   import {isConditionalComment} from 'hast-util-is-conditional-comment'
 *
 *   isConditionalComment(u('comment', '[if IE]>...<![endif]')) //=> true
 *   isConditionalComment(u('comment', '<![endif]')) //=> true
 *   isConditionalComment(u('comment', 'foo')) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isConditionalComment(node)`
 *
 *   Return `true` if `node` is a comment node matching one of the know IE
 *   conditional comments.
 */

var re = /^\[if[ \t\f\n\r]+[^\]]+]|<!\[endif]$/

export function isConditionalComment(node) {
  return node && node.type === 'comment' && re.test(node.value)
}
