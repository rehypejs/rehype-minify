/**
 * @fileoverview
 *   Remove comments (except conditional comments).
 *
 *   When configured with `force: true` (default: `false`), conditional comments
 *   are also removed.
 * @example
 *   <!--Hello-->
 *   <!--[if IE 6]>OK<![endif]-->
 */

import {filter} from 'unist-util-filter'
import {isConditionalComment} from 'hast-util-is-conditional-comment'

export default function rehypeRemoveComments(options = {}) {
  const force = options.removeConditional

  return transform

  function transform(tree) {
    return filter(tree, {cascade: false}, force ? hard : soft)
  }
}

function soft(node) {
  return hard(node) || isConditionalComment(node)
}

function hard(node) {
  return node.type !== 'comment'
}
