/**
 * @type {Record<string, string[]|null>}
 */
export const schema = {
  acceptCharset: ['form'],
  autoComplete: ['form'],
  charSet: ['meta', 'script'],
  contentEditable: null,
  crossOrigin: ['audio', 'img', 'link', 'script', 'video'],
  dir: null,
  draggable: null,
  dropzone: null,
  encType: ['form'],
  formEncType: ['button', 'input'],
  formMethod: ['button', 'input'],
  inputMode: ['input', 'textarea'],
  kind: ['track'],
  method: ['form'],
  preload: ['audio', 'video'],
  referrerPolicy: ['a', 'area', 'iframe', 'img', 'link'],
  sandbox: ['iframe'],
  spellCheck: null,
  scope: ['th'],
  shape: ['area'],
  sizes: ['link'],
  step: ['input'],
  translate: null,
  type: [
    'a',
    'link',
    'button',
    'embed',
    'object',
    'script',
    'source',
    'style',
    'input',
    'menu',
    'menuitem'
  ],
  wrap: ['textarea']
}
