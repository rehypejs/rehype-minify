// See: <https://html.spec.whatwg.org/#the-css-user-agent-style-sheet-and-presentational-hints>
module.exports = [
  // Contribute whitespace intrinsically.
  'br',
  'wbr',
  // Similar to block.
  'li',
  'table',
  'caption',
  'colgroup',
  'col',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'summary',
  'optgroup',
  'option',
  // Page
  'html',
  'head',
  'body',
  // Flow content
  'address',
  'blockquote',
  'center', // Legacy
  'dialog',
  'div',
  'figure',
  'figcaption',
  'footer',
  'form',
  'header',
  'hr',
  'legend',
  'listing', // Legacy
  'main',
  'p',
  'plaintext', // Legacy
  'pre',
  'xmp', // Legacy
  // Sections and headings
  'article',
  'aside',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hgroup',
  'nav',
  'section',
  // Lists
  'dir', // Legacy
  'dd',
  'dl',
  'dt',
  'menu',
  'ol',
  'ul',
  // Block-like:
  'li',
  'th',
  'td'
]
