import { set } from 'lodash-es';
import prettier from 'prettier';

import flattenKeys from './utils/flattenKeys.js';

// TODO Needs to also accept Objects of JSON objects
type JSONObject = string | boolean | number | JSONObject[]

type Key = string | string[]

type GeneratorValue = any

const vsCodeConfigBuilder = (value: GeneratorValue = {}) => {
  return {
    toString: () => prettier.format(JSON.stringify(flattenKeys(value)), { parser: 'json' }),
    map: (fn: (value: GeneratorValue) => GeneratorValue) => vsCodeConfigBuilder(fn(value)),
    fold: () => value,

    setProperty(key: Key, value: JSONObject) {
      return this.map((v) => set(Object.assign({}, v), key, value))
    },

    setNoFlatten(key: Key) {
      return this.map((v) =>
        set(
          Object.assign({}, v),
          Array.isArray(key) ? [...key, '__noFlatten'] : `${key}.__noFlatten`,
          true
        )
      )
    },
  }
}

export default vsCodeConfigBuilder
