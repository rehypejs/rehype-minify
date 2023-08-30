/**
 * hast utility to check if a node is a conditional comment.
 *
 * ## What is this?
 *
 * This package is a utility to check whether a hast node is a “conditional”
 * comment.
 * Conditional comments are a legacy feature that was specific to Internet
 * Explorer.
 * They were no longer used in IE 10.
 *
 * ## When should I use this?
 *
 * You can use this package when you’re building tools that handle old and
 * non-standard HTML, but generally it’s recommended to remove conditional
 * comments.
 *
 * ## Use
 *
 * ```js
 * import {isConditionalComment} from 'hast-util-is-conditional-comment'
 *
 * isConditionalComment(u({type: 'comment', value: '[if IE]>...<![endif]'})) //=> true
 * isConditionalComment(u({type: 'comment', value: '<![endif]'})) //=> true
 * isConditionalComment(u({type: 'comment', value: 'foo'})) //=> false
 * ```
 *
 * ## API
 *
 * ### `isConditionalComment(node)`
 *
 * Check if a node is a conditional comment.
 *
 * ###### Parameters
 *
 * *   `node` (`Node`) — node to check
 *
 * ###### Returns
 *
 * Whether a node is a conditional comment (`boolean`).
 */

export {isConditionalComment} from './lib/index.js'
