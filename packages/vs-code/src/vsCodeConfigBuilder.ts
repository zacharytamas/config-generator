import { cloneDeep, mergeWith, set } from 'lodash-es';
import prettier from 'prettier';

import flattenKeys from './utils/flattenKeys.js';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

type Key = string | string[]

type GeneratorValue = any

type MixinFn = (builder: VSCodeConfigBuilder, currentValue: GeneratorValue) => VSCodeConfigBuilder

interface VSCodeConfigBuilder {
  toString(): string
  map: (fn: (value: GeneratorValue) => GeneratorValue) => VSCodeConfigBuilder
  mixin: (fn: MixinFn) => ReturnType<MixinFn>
  mixinIf(condition: boolean, fn: MixinFn): ReturnType<MixinFn>
  fold: () => GeneratorValue
  setProperty(key: Key, value: Json): VSCodeConfigBuilder
  extendProperty(key: Key, value: Record<string, Json>): VSCodeConfigBuilder
  setNoFlatten(key: Key): VSCodeConfigBuilder
}

const vsCodeConfigBuilder = (value: GeneratorValue = {}): VSCodeConfigBuilder => {
  return {
    toString: () => prettier.format(JSON.stringify(flattenKeys(value)), { parser: 'json' }),
    map: (fn) => vsCodeConfigBuilder(fn(value)),

    mixin(fn) {
      return fn(this, value)
    },

    mixinIf(condition, fn) {
      if (condition) return this.mixin(fn)
      return this
    },

    fold: () => value,

    setProperty(key, value) {
      return this.map((v) => set(cloneDeep(v), key, value))
    },

    extendProperty(key, value) {
      return this.map((v) =>
        mergeWith(cloneDeep(v), set({}, key, value), (objValue, srcValue) => {
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
