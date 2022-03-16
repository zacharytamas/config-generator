import vsCodeConfigBuilder from './vsCodeConfigBuilder.js';

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
const addPrisma = true
const useVim = true
const useRewrap = true
const useWallaby = true
const useESLint = true
const fontInUse: keyof typeof fontSettings = `cascadia`

export const builder = vsCodeConfigBuilder()
  // Developer QOL
  .mixin((builder) =>
    builder
      .extendProperty('window', {
        newWindowDimensions: 'inherit',
        title: '${activeEditorShort}${separator}${rootPath}',
      })
      .extendProperty('editor', {
        tabCompletion: 'on',
        emptySelectionClipboard: false,
        suggestSelection: 'recentlyUsedByPrefix',
        tabSize: 2,
      })
      .extendProperty('workbench', {
        editor: {
          splitSizing: 'split',
          enablePreviewFromCodeNavigation: true,
          highlightModifiedTabs: true,
        },
        startupEditor: 'newUntitledFile',
      })
  )

  // Code style automation
  .mixin((builder) =>
    builder
      .extendProperty('files', {
        trimTrailingWhitespace: true,
      })
      .extendProperty('editor', {
        defaultFormatter: 'esbenp.prettier-vscode',
        formatOnSave: true,
      })
      .mixinIf(useRewrap, (builder, currentValue) =>
        builder.extendProperty('rewrap', {
          reformat: true,
          autoWrap: { enabled: true },
          // Wrap comments at a line length of 75% the overall word wrap
          // length to enhance readability. This is very much a subjective
          // preference.
          wrappingColumn: Math.floor((currentValue.editor?.wordWrapColumn ?? 100) * 0.75),
        })
      )
  )

  // Refactoring automation
  .mixin((builder) =>
    builder
      .extendProperty('javascript', {
        updateImportsOnFileMove: { enabled: 'always' },
      })
      .extendProperty('typescript', {
        updateImportsOnFileMove: { enabled: 'always' },
      })
  )

  // JavaScript/TypeScript development
  .mixin((builder) =>
    builder
      .extendProperty('js/ts', { implicitProjectConfig: { checkJs: true } })
      .extendProperty('debug', { javascript: { autoAttachFilter: 'onlyWithFlag' } })
      .mixinIf(useESLint, (builder) =>
        builder.extendProperty('eslint', {
          validate: ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
        })
      )
  )

  // Editor rendering
  .mixin((builder) =>
    builder.extendProperty('editor', {
      cursorBlinking: 'expand',
      lineNumbers: 'relative',
      minimap: { enabled: false },
      renderWhitespace: 'boundary',
      renderControlCharacters: true,
      semanticHighlighting: { enabled: true },
      smoothScrolling: true,
      // Fortunately I don't need this support and there is a performance improvement
      // for not turning it on.
      accessibilitySupport: 'off',
      guides: { bracketPairs: true },
    })
  )

  // Typography
  .mixin((builder) => builder.extendProperty('editor', fontSettings[fontInUse]))

  // Theme
  .mixin((builder) =>
    builder.extendProperty('workbench', {
      colorTheme: 'GitHub Dark',
      iconTheme: 'material-icon-theme',
      productIconTheme: 'fluent-icons',
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
      openEditors: { sortOrder: 'fullPath' },
    })
  )

  // Terminal
  .mixin((builder, currentValue) =>
    builder.extendProperty('terminal', {
      external: {
        osxExec: 'iTerm.app',
      },
      integrated: {
        // Use the font size from the editor, if possible.
        fontSize: currentValue.editor?.fontSize ?? 15,
        cursorBlinking: true,
        cursorStyle: 'line',
        cursorWidth: 2,
        confirmOnExit: 'hasChildProcesses',
        defaultLocation: 'editor',
        splitCwd: 'workspaceRoot',
      },
    })
  )

  // Git
  .mixin((b) =>
    b.extendProperty('git', {
      autofetch: true,
      confirmSync: false,
    })
  )

  // Prisma
  .mixinIf(addPrisma, (b) =>
    b
      .extendProperty(['[prisma]'], { 'editor.defaultFormatter': 'Prisma.prisma' })
      .setNoFlatten(['[prisma]'])
  )

  // Vim mode
  .mixinIf(useVim, (b) =>
    b.extendProperty('vim', {
      enableNeovim: true,
      neovimPath: '/opt/homebrew/bin/nvim',
      normalModeKeyBindingsNonRecursive: [
        { before: [':'], commands: ['workbench.action.showCommands'] },
        { before: ['<leader>', 'f'], commands: ['revealInExplorer'] },
        { before: ['<leader>', 'r', 'f'], commands: ['fileutils.renameFile'] },
        { before: ['escape'], commands: ['workbench.action.files.save'] },
      ],
      insertModeKeyBindingsNonRecursive: [],
      visualModeKeyBindingsNonRecursive: [
        { before: ['>'], commands: ['editor.action.indentLines'] },
        { before: ['<'], commands: ['editor.action.outdentLines'] },
      ],
    })
  )

  // GitLens
  .mixin((b) =>
    b.extendProperty('gitlens', {
      statusBar: { enabled: false },
      blame: { heatmap: { location: 'left' } },
    })
  )

  .mixinIf(useWallaby, (builder) =>
    builder.extendProperty('wallaby', { startAutomatically: false })
  )

  .mixinIf(useImportSorter, (builder) =>
    builder.extendProperty('importSorter', {
      generalConfiguration: { sortOnBeforeSave: true },
      importStringConfiguration: {
        maximumNumberOfImportExpressionsPerLine: {
          type: 'newLineEachExpressionAfterCountLimitExceptIfOnlyOne',
          count: 100,
        },
        trailingComma: 'multiLine',
        tabSize: 2,
      },
      sortConfiguration: {
        joinImportPaths: true,
        removeUnusedImports: true,
        removeUnusedDefaultImports: false,
        customOrderingRules: {
          rules: [
            { regex: '^react', orderLevel: 5 },
            { type: 'importMember', regex: '^$', orderLevel: 10 },
            { regex: '^[@]', orderLevel: 30 },
            { regex: '^[.]', orderLevel: 40 },
          ],
        },
      },
    })
  )
