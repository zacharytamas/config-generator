import flattenKeys from '../flattenKeys.js';

describe('without exclusions', () => {
  it('should flatten correctly with depth of 1', () => {
    expect(flattenKeys({ key1: 'abc', 'editor.fontSize': 15 })).toEqual({
      key1: 'abc',
      'editor.fontSize': 15,
    })
  })

  it('should flatten correct with depth of 2', () => {
    expect(
      flattenKeys({
        'git.autofetch': true,
        git: { confirmSync: false },
        editor: { fontSize: 15, rulers: [100] },
      })
    ).toEqual({
      'editor.fontSize': 15,
      'git.autofetch': true,
      'git.confirmSync': false,
      'editor.rulers': [100],
    })
  })

  it('should flatten correct with depth of 3', () => {
    expect(
      flattenKeys({
        'git.autofetch': true,
        javascript: { preferences: { importModuleSpecifierEnding: 'js' } },
        git: { confirmSync: false },
        editor: { fontSize: 15, minimap: { enabled: false } },
      })
    ).toEqual({
      'editor.fontSize': 15,
      'git.autofetch': true,
      'git.confirmSync': false,
      'editor.minimap.enabled': false,
      'javascript.preferences.importModuleSpecifierEnding': 'js',
    })
  })
})

describe('with exclusions', () => {
  it('should return a properly flattened object with exclusions un-flattened', () => {
    expect(
      flattenKeys({
        editor: { fontSize: 15 },
        importSorter: {
          sortConfiguration: {
            __noFlatten: true,
            joinImportPaths: true,
            removeUnusedImports: true,
          },
        },
      })
    ).toEqual({
      'editor.fontSize': 15,
      'importSorter.sortConfiguration': { joinImportPaths: true, removeUnusedImports: true },
    })
  })
})
