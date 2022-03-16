import { readFile } from 'node:fs/promises';

import vsCodeConfigBuilder from '../vsCodeConfigBuilder.js';

const __dirname = new URL('.', import.meta.url).pathname

const readFixture = async (name: string) =>
  (await readFile(`${__dirname}fixtures/${name}`)).toString()

it('should generate correctly', async () => {
  const foo = vsCodeConfigBuilder().extendProperty('editor', {
    cursorBlinking: 'expand',
    defaultFormatter: 'esbenp.prettier-vscode',
    emptySelectionClipboard: false,
    lineHeight: 31,
    fontSize: 15,
    tabSize: 2,
    wordWrapColumn: 100,
    fontLigatures: true,
    fontWeight: '500',
    lineNumbers: 'relative',
    tabCompletion: 'on',
    suggestSelection: 'first',
    smoothScrolling: true,
    formatOnSave: true,
    minimap: { enabled: false },
    rulers: [100],
    renderWhitespace: 'boundary',
    fontFamily:
      'Rec Mono Duotone, BerkeleyMonoVariable-Regular, Cascadia Code PL, MonoLisa, Menlo, Monaco, monospace',
  })

  const fooResult = foo.toPrettierString()

  expect(fooResult).toEqual(await readFixture('config-1.json'))
})
