import { execa } from 'execa';

import { builder } from './my-configuration.js';

async function main() {
  await execa(
    `ksdiff`,
    [
      '--wait',
      '-l',
      'vs-code-configuration',
      '/Users/zachary/Library/Application Support/Code/User/settings.json',
      '-',
    ],
    { input: builder.toPrettierString() }
  )
}

main()
