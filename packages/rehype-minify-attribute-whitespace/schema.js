// Note: Don’t include non-strings (such as `boolean`s) here, they are handled
// by `rehype-stringify`.

/**
 * @type {Record<string, Array<string>|null>}
 */
export const schema = {
  accept: ['input'],
  acceptCharset: ['form'],
  accessKey: null,
  action: ['form'],
  cite: ['blockquote', 'del', 'ins', 'q'],
  className: null,
  cols: ['textarea'],
  colSpan: ['td', 'th'],
  data: ['object'],
  dropzone: null,
  formAction: ['button', 'input'],
  height: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video'],
  high: ['meter'],
  href: ['a', 'area', 'base', 'link'],
  htmlFor: ['output'],
  icon: ['menuitem'],
  itemId: null,
  low: ['meter'],
  manifest: ['html'],
  max: ['meter', 'progress'],
  maxLength: ['input', 'textarea'],
  media: ['source'],
  min: ['meter'],
  minLength: ['input', 'textarea'],
  optimum: ['meter'],
  ping: ['a', 'area'],
  poster: ['video'],
  profile: ['head'],
  rows: ['textarea'],
  rowSpan: ['td', 'th'],
  size: ['input', 'select'],
  span: ['col', 'colgroup'],
  src: [
    'audio',
    'embed',
    'iframe',
    'img',
    'input',
    'script',
    'source',
    'track',
    'video'
  ],
  start: ['ol'],
  step: ['input'],
  style: null,
  tabIndex: null,
  useMap: ['img', 'object'],
  value: ['li', 'meter', 'progress'],
  width: ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video']
}
