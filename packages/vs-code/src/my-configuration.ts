import { execa } from 'execa';

import vsCodeConfigBuilder from './vsCodeConfigBuilder.js';

interface ToStringable {
  toString(): string
}

const compare = async (builder: ToStringable, comparePath: string) => {
  return execa(`ksdiff`, ['--wait', '-l', 'vs-code-configuration', comparePath, '-'], {
    input: builder.toString(),
  })
}

;(async () => {
  const fontSettings = {
    cascadia: {
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 31,
      fontFamily: 'Cascadia Code PL, monospace',
      fontLigatures: "'ss01', 'ss02', 'ss03', 'ss04', 'ss05', 'ss06', 'onum', 'calt'",
    },
  }

  const printWidth = 100
  const useImportSorter = true
  const usePrettier = true
  const fontInUse: keyof typeof fontSettings = 'cascadia'

  const builder = vsCodeConfigBuilder()
    .extendProperty('editor', { cursorBlinking: 'expand' })

    // Developer QOL
    .mixin((builder) =>
      builder.extendProperty('editor', {
        lineNumbers: 'relative',
        tabCompletion: 'on',
        minimap: { enabled: false },
        emptySelectionClipboard: false,
        suggestSelection: 'recentlyUsedByPrefix',
      })
    )

    // Editor rendering
    .mixin((builder) =>
      builder.extendProperty('editor', {
        renderWhitespace: 'boundary',
        renderControlCharacters: true,
      })
    )

    // Typography
    .mixin((builder) => builder.extendProperty('editor', fontSettings[fontInUse]))

    // Theme
    .mixin((builder) =>
      builder.extendProperty('workbench', {
        colorTheme: 'GitHub Dark',
        iconTheme: 'material-icon-theme',
      })
    )

    // Code formatting
    .mixin((builder) =>
      builder.extendProperty('editor', {
        defaultFormatter: 'esbenp.prettier-vscode',
        formatOnSave: true,
      })
    )

    // Line lengths
    .mixin((builder) =>
      builder.extendProperty('editor', { wordWrapColumn: printWidth, rulers: [printWidth] })
    )

    // Default Prettier configuration
    .mixinIf(usePrettier, (builder) =>
      builder.extendProperty('prettier', { enable: true, printWidth, singleQuote: true })
    )

    // Code Explorer behavior
    .mixin((builder) =>
      builder.extendProperty('explorer', {
        confirmDelete: false,
        confirmDragAndDrop: false,
      })
    )

    // Integrated terminal
    .mixin((builder, currentValue) =>
      builder.extendProperty('terminal', {
        integrated: {
          // Use the font size from the editor, if possible.
          fontSize: currentValue.editor?.fontSize ?? 15,
        },
      })
    )

    .mixinIf(
      useImportSorter,
      (builder) =>
        builder.extendProperty('importSorter', {
          generalConfiguration: { sortOnBeforeSave: true },
          importStringConfiguration: {
            maximumNumberOfImportExpressionsPerLine: {
              type: 'newLineEachExpressionAfterCountLimitExceptIfOnlyOne',
              count: 100,
            },
          },
          sortConfiguration: {
            joinImportPaths: true,
            removeUnusedImports: true,
            removeUnusedDefaultImports: false,
          },
        })
      // .setNoFlatten('importSorter')
    )

  await compare(builder, '/Users/zachary/Library/Application Support/Code/User/settings.json')
})()
