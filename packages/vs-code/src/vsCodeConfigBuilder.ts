import { cloneDeep, mergeWith, set, setWith } from 'lodash-es';
import prettier from 'prettier';

import flattenKeys from './utils/flattenKeys.js';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

type Key = string | string[]

type GeneratorValue = any

type MixinFn = (builder: VSCodeConfigBuilder, currentValue: GeneratorValue) => VSCodeConfigBuilder

export interface VSCodeConfigBuilder {
  toPrettierString(prettierOptions?: prettier.Options): string
  toString(): string
  map: (fn: (value: GeneratorValue) => GeneratorValue) => VSCodeConfigBuilder
  mixin: (fn: MixinFn) => ReturnType<MixinFn>
  mixinIf(condition: boolean, fn: MixinFn): ReturnType<MixinFn>
  fold: () => GeneratorValue
  extendProperty(key: Key, value: Record<string, Json>): VSCodeConfigBuilder
  setNoFlatten(key: Key): VSCodeConfigBuilder
}

const vsCodeConfigBuilder = (value: GeneratorValue = {}): VSCodeConfigBuilder => {
  return {
    toString() {
      return JSON.stringify(flattenKeys(value))
    },
    toPrettierString({ printWidth = 100, ...options }: prettier.Config = {}) {
      return prettier.format(this.toString(), { parser: 'json', printWidth, ...options })
    },
    map: (fn) => vsCodeConfigBuilder(fn(value)),

    mixin(fn) {
      return fn(this, value)
    },

    mixinIf(condition, fn) {
      if (condition) return this.mixin(fn)
      return this
    },

    fold: () => value,

    extendProperty(key, value) {
      return this.map((v) =>
        mergeWith(cloneDeep(v), setWith({}, key, value, console.log), (objValue, srcValue) => {
          if (typeof objValue === 'object' && typeof srcValue === 'object') {
            return { ...objValue, ...srcValue }
          }
        })
      )
    },

    setNoFlatten(key) {
      return this.map((v) =>
        set(cloneDeep(v), Array.isArray(key) ? [...key, '__noFlatten'] : `${key}.__noFlatten`, true)
      )
    },
  }
}

export default vsCodeConfigBuilder
