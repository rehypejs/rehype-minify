/**
 * @fileoverview
 *   Remove `type` and `language` on JavaScript scripts.
 * @example
 *   <script type="text/javascript"></script>
 *   <script language="javascript1.5"></script>
 */

import visit from 'unist-util-visit'
import {isJavaScript} from 'hast-util-is-javascript'

export default function rehypeRemoveScriptTypeJavaScript() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  var props = node.properties

  if (isJavaScript(node)) {
    if ('type' in props) {
      props.type = null
    }

    if ('language' in props) {
      props.language = null
    }
  }
}
