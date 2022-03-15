import { readFile } from 'node:fs/promises';

import Generator from '../generator.js';

const __dirname = new URL('.', import.meta.url).pathname

const readFixture = async (name: string) =>
  (await readFile(`${__dirname}fixtures/${name}`)).toString()

it('should generate correctly', async () => {
  const foo = new Generator()

  foo
    .setProperty('editor.cursorBlinking', 'expand')
    .setProperty('editor.defaultFormatter', 'esbenp.prettier-vscode')
    .setProperty('editor.emptySelectionClipboard', false)
    .setProperty('editor.lineHeight', 31)
    .setProperty('editor.fontSize', 15)
    .setProperty('editor.tabSize', 2)
    .setProperty('editor.wordWrapColumn', 100)
    .setProperty('editor.fontLigatures', true)
    .setProperty('editor.fontWeight', '500')
    .setProperty('editor.lineNumbers', 'relative')
    .setProperty('editor.tabCompletion', 'on')
    .setProperty('editor.suggestSelection', 'first')
    .setProperty('editor.smoothScrolling', true)
    .setProperty('editor.formatOnSave', true)
    .setProperty('editor.minimap.enabled', false)
    .setProperty('editor.rulers', [100])
    .setProperty('editor.renderWhitespace', 'boundary')
    .setProperty(
      'editor.fontFamily',
      'Rec Mono Duotone, BerkeleyMonoVariable-Regular, Cascadia Code PL, MonoLisa, Menlo, Monaco, monospace'
    )

  const fooResult = foo.toString()

  expect(fooResult).toEqual(await readFixture('config-1.json'))
})
